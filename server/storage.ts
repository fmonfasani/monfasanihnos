import {
  products,
  orders,
  orderItems,
  calendarSlots,
  promotions,
  settings,
  categories,                 // <-- NUEVO
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CalendarSlot,
  type InsertCalendarSlot,
  type Promotion,
  type InsertPromotion,
  type Setting,
  type OrderWithItems,
  type Category,              // <-- NUEVO
  type InsertCategory,        // <-- NUEVO
} from "../shared/schema";

import { db } from "../server/db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByType(type: string): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;  // <-- NUEVO
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;

  // Orders
  getOrders(): Promise<OrderWithItems[]>;
  getOrder(id: string): Promise<OrderWithItems | undefined>;
  getOrderByNumber(orderNumber: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Calendar Slots
  getAvailableSlots(date: string): Promise<CalendarSlot[]>;
  getSlot(date: string, time: string): Promise<CalendarSlot | undefined>;
  bookSlot(date: string, time: string): Promise<CalendarSlot | undefined>;
  createSlot(slot: InsertCalendarSlot): Promise<CalendarSlot>;

  // Promotions
  getActivePromotions(): Promise<Promotion[]>;
  getPromotion(id: string): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;

  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(key: string, value: any): Promise<Setting>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(c: InsertCategory): Promise<Category>;
  updateCategory(id: string, patch: Partial<InsertCategory>): Promise<Category | undefined>;
}

export class DatabaseStorage implements IStorage {
  // ---------- Products ----------
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.active, true));
  }

  async getProductsByType(type: string): Promise<Product[]> {
    return db.select().from(products).where(and(eq(products.type, type), eq(products.active, true)));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return db.select().from(products).where(and(eq(products.categoryId, categoryId), eq(products.active, true)));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [row] = await db.select().from(products).where(eq(products.id, id));
    return row ?? undefined;
  }

  async createProduct(data: InsertProduct): Promise<Product> {
    const [row] = await db.insert(products).values(data).returning();
    return row;
  }

  async updateProduct(id: string, patch: Partial<InsertProduct>): Promise<Product | undefined> {
    const [row] = await db.update(products).set(patch).where(eq(products.id, id)).returning();
    return row ?? undefined;
  }

  // ---------- Orders ----------
  async getOrders(): Promise<OrderWithItems[]> {
    return db.query.orders.findMany({
      with: { items: { with: { product: true } } },
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const row = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: { items: { with: { product: true } } },
    });
    return row ?? undefined;
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderWithItems | undefined> {
    const row = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: { items: { with: { product: true } } },
    });
    return row ?? undefined;
  }

  async createOrder(orderData: InsertOrder, itemsData: InsertOrderItem[]): Promise<OrderWithItems> {
    const orderNumber = `MH${Date.now().toString().slice(-6)}`;
    const [order] = await db.insert(orders).values({ ...orderData, orderNumber }).returning();
    const rows = itemsData.map(i => ({ ...i, orderId: order.id }));
    await db.insert(orderItems).values(rows);
    const full = await this.getOrder(order.id);
    return full!;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [row] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return row ?? undefined;
  }

  // ---------- Calendar Slots ----------
  async getAvailableSlots(date: string): Promise<CalendarSlot[]> {
    return db.select().from(calendarSlots).where(and(eq(calendarSlots.date, date), eq(calendarSlots.active, true)));
  }

  async getSlot(date: string, time: string): Promise<CalendarSlot | undefined> {
    const [row] = await db.select().from(calendarSlots).where(and(eq(calendarSlots.date, date), eq(calendarSlots.time, time)));
    return row ?? undefined;
  }

  async bookSlot(date: string, time: string): Promise<CalendarSlot | undefined> {
    const current = await this.getSlot(date, time);
    if (!current) return undefined;
    const [row] = await db.update(calendarSlots)
      .set({ bookedCount: current.bookedCount + 1 })
      .where(and(eq(calendarSlots.date, date), eq(calendarSlots.time, time)))
      .returning();
    return row ?? undefined;
  }

  async createSlot(slot: InsertCalendarSlot): Promise<CalendarSlot> {
    const [row] = await db.insert(calendarSlots).values(slot).returning();
    return row;
  }

  // ---------- Promotions ----------
  async getActivePromotions(): Promise<Promotion[]> {
    return db.select().from(promotions).where(eq(promotions.active, true));
  }

  async getPromotion(id: string): Promise<Promotion | undefined> {
    const [row] = await db.select().from(promotions).where(eq(promotions.id, id));
    return row ?? undefined;
  }

  async createPromotion(promo: InsertPromotion): Promise<Promotion> {
    const [row] = await db.insert(promotions).values(promo).returning();
    return row;
  }

  // ---------- Settings ----------
  async getSetting(key: string): Promise<Setting | undefined> {
    const [row] = await db.select().from(settings).where(eq(settings.key, key));
    return row ?? undefined;
  }

  async setSetting(key: string, value: any): Promise<Setting> {
    const [row] = await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } })
      .returning();
    return row;
  }

  // ---------- Categories ----------
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).where(eq(categories.active, true));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [row] = await db.select().from(categories).where(eq(categories.id, id));
    return row ?? undefined;
  }

  async createCategory(c: InsertCategory): Promise<Category> {
    const [row] = await db.insert(categories).values(c).returning();
    return row;
  }

  async updateCategory(id: string, patch: Partial<InsertCategory>): Promise<Category | undefined> {
    const [row] = await db.update(categories).set(patch).where(eq(categories.id, id)).returning();
    return row ?? undefined;
  }
}

export const storage = new DatabaseStorage();
