import { 
  products, orders, orderItems, calendarSlots, promotions, settings,
  type Product, type InsertProduct, type Order, type InsertOrder, 
  type OrderItem, type InsertOrderItem, type CalendarSlot, type InsertCalendarSlot,
  type Promotion, type InsertPromotion, type Setting, type InsertSetting,
  type OrderWithItems
} from "../shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByType(type: string): Promise<Product[]>;
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
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.active, true));
  }

  async getProductsByType(type: string): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.type, type), eq(products.active, true)));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(updateProduct).where(eq(products.id, id)).returning();
    return product || undefined;
  }

  // Orders
  async getOrders(): Promise<OrderWithItems[]> {
    const ordersWithItems = await db.query.orders.findMany({
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });
    return ordersWithItems;
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });
    return order || undefined;
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderWithItems | undefined> {
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems> {
    // Generate order number
    const orderNumber = `MH${Date.now().toString().slice(-6)}`;
    
    const [order] = await db.insert(orders).values({
      ...insertOrder,
      orderNumber,
    }).returning();

    // Insert order items
    const orderItemsData = items.map(item => ({
      ...item,
      orderId: order.id,
    }));
    
    await db.insert(orderItems).values(orderItemsData);

    // Return order with items
    const orderWithItems = await this.getOrder(order.id);
    return orderWithItems!;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order || undefined;
  }

  // Calendar Slots
  async getAvailableSlots(date: string): Promise<CalendarSlot[]> {
    return await db.select()
      .from(calendarSlots)
      .where(and(
        eq(calendarSlots.date, date),
        eq(calendarSlots.active, true)
      ));
  }

  async getSlot(date: string, time: string): Promise<CalendarSlot | undefined> {
    const [slot] = await db.select()
      .from(calendarSlots)
      .where(and(
        eq(calendarSlots.date, date),
        eq(calendarSlots.time, time)
      ));
    return slot || undefined;
  }

  async bookSlot(date: string, time: string): Promise<CalendarSlot | undefined> {
    // Get current slot to increment bookedCount
    const currentSlot = await this.getSlot(date, time);
    if (!currentSlot) return undefined;
    
    const [slot] = await db.update(calendarSlots)
      .set({ bookedCount: currentSlot.bookedCount + 1 })
      .where(and(
        eq(calendarSlots.date, date),
        eq(calendarSlots.time, time)
      ))
      .returning();
    return slot || undefined;
  }

  async createSlot(insertSlot: InsertCalendarSlot): Promise<CalendarSlot> {
    const [slot] = await db.insert(calendarSlots).values(insertSlot).returning();
    return slot;
  }

  // Promotions
  async getActivePromotions(): Promise<Promotion[]> {
    return await db.select().from(promotions).where(eq(promotions.active, true));
  }

  async getPromotion(id: string): Promise<Promotion | undefined> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotion || undefined;
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const [promotion] = await db.insert(promotions).values(insertPromotion).returning();
    return promotion;
  }

  // Settings
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async setSetting(key: string, value: any): Promise<Setting> {
    const [setting] = await db.insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() }
      })
      .returning();
    return setting;
  }
}

export const storage = new DatabaseStorage();
