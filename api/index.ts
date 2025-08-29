import express from "express";
import type { Request, Response } from "express";
import { z } from "zod";

// Import the storage layer and schemas from the existing code. These modules
// encapsulate all of the database interactions and data validation. Because
// they already work in a serverless environment (using the Neon driver),
// re‑using them here allows the API routes to work without modification.
import { storage } from "../server/storage";
import {
  insertOrderSchema,
  insertOrderItemSchema,
} from "../shared/schema";

// Create an Express application. In Vercel the exported app will be
// automatically converted into a serverless function. Do not call
// `.listen()` here – Vercel handles the request lifecycle for you.
const app = express();

// Enable JSON and URL‑encoded body parsing. These match the behaviour of the
// original `server/index.ts` so that incoming requests are decoded
// correctly.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/api/health', async (_req, res) => {
  try { const { db } = await import('../server/db'); await db.$client`select 1`; res.json({ ok: true }); }
  catch (e) { console.error(e); res.status(500).json({ ok: false }); }
});


/*
 * Products
 *
 * GET /api/products         → list products (optionally filter by type)
 * GET /api/products/:id      → get a single product by ID
 */
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const products = type
      ? await storage.getProductsByType(String(type))
      : await storage.getProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const product = await storage.getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

/*
 * Orders
 *
 * GET /api/orders               → list all orders
 * GET /api/orders/:id           → get an order by its ID
 * GET /api/orders/number/:num   → get an order by its order number
 * POST /api/orders              → create a new order with items
 * PATCH /api/orders/:id/status  → update the status of an order
 */
app.get("/api/orders", async (_req: Request, res: Response) => {
  try {
    const orders = await storage.getOrders();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.get("/api/orders/:id", async (req: Request, res: Response) => {
  try {
    const order = await storage.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

app.get(
  "/api/orders/number/:orderNumber",
  async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  },
);

// Schema for validating the request body when creating a new order. We
// validate both the top‑level `order` object and the `items` array of order
// items. See shared/schema.ts for the structure.
const createOrderSchema = z.object({
  order: insertOrderSchema,
  items: z.array(insertOrderItemSchema),
});

app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const { order, items } = createOrderSchema.parse(req.body);

    // Before creating the order, ensure the selected time slot is available and
    // not fully booked. The slot is identified by date and time strings.
    const slot = await storage.getSlot(
      order.scheduledAt.toISOString().split("T")[0],
      order.scheduledAt.toTimeString().slice(0, 5),
    );

    if (!slot) {
      return res.status(400).json({ message: "Selected time slot not available" });
    }
    if (slot.bookedCount >= slot.capacity) {
      return res.status(400).json({ message: "Selected time slot is full" });
    }

    // Create the order and then book the slot. The storage layer handles
    // inserting the order into the database and returning the full
    // OrderWithItems structure.
    const newOrder = await storage.createOrder(order, items);
    await storage.bookSlot(
      order.scheduledAt.toISOString().split("T")[0],
      order.scheduledAt.toTimeString().slice(0, 5),
    );

    res.status(201).json(newOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid order data", errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

app.patch("/api/orders/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await storage.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

/*
 * Calendar Slots
 *
 * GET /api/slots/:date       → list all slots for a date
 * GET /api/slots/:date/:time → get a single slot (date + time)
 */
app.get("/api/slots/:date", async (req: Request, res: Response) => {
  try {
    const slots = await storage.getAvailableSlots(req.params.date);
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch time slots" });
  }
});

app.get(
  "/api/slots/:date/:time",
  async (req: Request, res: Response) => {
    try {
      const slot = await storage.getSlot(req.params.date, req.params.time);
      if (!slot) {
        return res.status(404).json({ message: "Time slot not found" });
      }
      res.json(slot);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch time slot" });
    }
  },
);

/*
 * Promotions
 *
 * GET /api/promotions → list all active promotions
 */
app.get("/api/promotions", async (_req: Request, res: Response) => {
  try {
    const promotions = await storage.getActivePromotions();
    res.json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch promotions" });
  }
});

/*
 * Settings
 *
 * GET /api/settings/:key  → retrieve a setting by key
 * POST /api/settings      → create or update a setting
 */
app.get("/api/settings/:key", async (req: Request, res: Response) => {
  try {
    const setting = await storage.getSetting(req.params.key);
    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }
    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch setting" });
  }
});

app.post("/api/settings", async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const setting = await storage.setSetting(key, value);
    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save setting" });
  }
});

// Export the Express app. When this file lives in the `/api` folder, Vercel
// treats the exported object as a serverless function handler.
export default app;