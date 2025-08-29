import express from "express";
import type { Request, Response } from "express";
import { z } from "zod";

import { storage } from "../server/storage";
import { insertOrderSchema, insertOrderItemSchema } from "../shared/schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------- Health ----------
app.get("/api/health", async (_req, res) => {
  try {
    const { db } = await import("../server/db");
    // @ts-ignore drizzle-neon-http: client raw
    await db.$client`select 1`;
    res.json({ ok: true });
  } catch (e) {
    console.error("[/api/health]", e);
    res.status(500).json({ ok: false });
  }
});

// ---------- Products ----------
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const data = type
      ? await storage.getProductsByType(String(type))
      : await storage.getProducts();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const row = await storage.getProduct(req.params.id);
    if (!row) return res.status(404).json({ message: "Product not found" });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// crear producto/servicio
const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  type: z.enum(["product", "service"]),
  active: z.boolean().optional().default(true),
});

app.post("/api/products", async (req: Request, res: Response) => {
  try {
    const data = createProductSchema.parse(req.body);
    const created = await storage.createProduct(data);
    res.status(201).json(created);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid product", errors: e.errors });
    }
    console.error(e);
    res.status(500).json({ message: "Failed to create product" });
  }
});

const updateProductSchema = createProductSchema.partial();

app.patch("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const patch = updateProductSchema.parse(req.body);
    const updated = await storage.updateProduct(req.params.id, patch);
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid product", errors: e.errors });
    }
    console.error(e);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// baja lógica
app.delete("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const updated = await storage.updateProduct(req.params.id, { active: false });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// ---------- Orders ----------
const createOrderSchema = z.object({
  order: insertOrderSchema,
  items: z.array(insertOrderItemSchema),
});

app.get("/api/orders", async (_req, res) => {
  try {
    res.json(await storage.getOrders());
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const row = await storage.getOrder(req.params.id);
    if (!row) return res.status(404).json({ message: "Order not found" });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

app.get("/api/orders/number/:orderNumber", async (req, res) => {
  try {
    const row = await storage.getOrderByNumber(req.params.orderNumber);
    if (!row) return res.status(404).json({ message: "Order not found" });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { order, items } = createOrderSchema.parse(req.body);

    const date = order.scheduledAt.toISOString().split("T")[0];
    const time = order.scheduledAt.toTimeString().slice(0, 5);

    const slot = await storage.getSlot(date, time);
    if (!slot) return res.status(400).json({ message: "Selected time slot not available" });
    if (slot.bookedCount >= slot.capacity) {
      return res.status(400).json({ message: "Selected time slot is full" });
    }

    const created = await storage.createOrder(order, items);
    await storage.bookSlot(date, time);

    res.status(201).json(created);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid order data", errors: e.errors });
    }
    console.error(e);
    res.status(500).json({ message: "Failed to create order" });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body as { status: string };
    const updated = await storage.updateOrderStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// ---------- Calendar ----------
app.get("/api/slots/:date", async (req, res) => {
  try {
    res.json(await storage.getAvailableSlots(req.params.date));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch time slots" });
  }
});

app.get("/api/slots/:date/:time", async (req, res) => {
  try {
    const row = await storage.getSlot(req.params.date, req.params.time);
    if (!row) return res.status(404).json({ message: "Time slot not found" });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch time slot" });
  }
});

// ---------- Promotions ----------
app.get("/api/promotions", async (_req, res) => {
  try {
    res.json(await storage.getActivePromotions());
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch promotions" });
  }
});

// ---------- Settings ----------
app.get("/api/settings/:key", async (req, res) => {
  try {
    const row = await storage.getSetting(req.params.key);
    if (!row) return res.status(404).json({ message: "Setting not found" });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch setting" });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    const { key, value } = req.body as { key: string; value: any };
    const row = await storage.setSetting(key, value);
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to save setting" });
  }
});

// api/index.ts (fragmentos)

// ---------- Products (agregar filtro por categoryId) ----------
app.get("/api/products", async (req, res) => {
  try {
    const { type, categoryId } = req.query as { type?: string; categoryId?: string };
    let data;
    if (categoryId) data = await storage.getProductsByCategory(categoryId);
    else if (type)  data = await storage.getProductsByType(type);
    else            data = await storage.getProducts();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ---------- Categories (NUEVO) ----------
const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  active: z.boolean().optional().default(true),
});

app.get("/api/categories", async (_req, res) => {
  try {
    const cats = await storage.getCategories();
    res.json(cats);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

app.get("/api/categories/:id", async (req, res) => {
  try {
    const cat = await storage.getCategory(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch category" });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const data = categorySchema.parse(req.body);
    const created = await storage.createCategory(data);
    res.status(201).json(created);
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: "Invalid category", errors: e.errors });
    console.error(e);
    res.status(500).json({ message: "Failed to create category" });
  }
});

app.patch("/api/categories/:id", async (req, res) => {
  try {
    const patch = categorySchema.partial().parse(req.body);
    const updated = await storage.updateCategory(req.params.id, patch);
    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: "Invalid category", errors: e.errors });
    console.error(e);
    res.status(500).json({ message: "Failed to update category" });
  }
});


export default app;
