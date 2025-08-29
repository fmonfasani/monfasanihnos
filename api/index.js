var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import serverless from "serverless-http";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  calendarSlots: () => calendarSlots,
  insertCalendarSlotSchema: () => insertCalendarSlotSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  insertPromotionSchema: () => insertPromotionSchema,
  insertSettingSchema: () => insertSettingSchema,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  products: () => products,
  productsRelations: () => productsRelations,
  promotions: () => promotions,
  settings: () => settings
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  // "pizza" | "empanada"
  price: integer("price").notNull(),
  // price in cents
  image: text("image"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  mode: text("mode").notNull(),
  // "takeaway" | "delivery"
  address: text("address"),
  neighborhood: text("neighborhood"),
  reference: text("reference"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  // "pending" | "confirmed" | "in_progress" | "ready" | "completed" | "cancelled"
  scheduledAt: timestamp("scheduled_at").notNull(),
  totalAmount: integer("total_amount").notNull(),
  deliveryFee: integer("delivery_fee").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull()
  // price at time of order
});
var calendarSlots = pgTable("calendar_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  // YYYY-MM-DD format
  time: text("time").notNull(),
  // HH:MM format
  capacity: integer("capacity").notNull().default(8),
  bookedCount: integer("booked_count").notNull().default(0),
  active: boolean("active").notNull().default(true)
});
var promotions = pgTable("promotions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountPercentage: integer("discount_percentage"),
  originalPrice: integer("original_price"),
  promoPrice: integer("promo_price").notNull(),
  badgeText: text("badge_text"),
  gradient: text("gradient").notNull(),
  // CSS gradient class
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));
var productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems)
}));
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var insertCalendarSlotSchema = createInsertSchema(calendarSlots).omit({
  id: true
});
var insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true
});
var insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and } from "drizzle-orm";
var DatabaseStorage = class {
  // Products
  async getProducts() {
    return await db.select().from(products).where(eq(products.active, true));
  }
  async getProductsByType(type) {
    return await db.select().from(products).where(and(eq(products.type, type), eq(products.active, true)));
  }
  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || void 0;
  }
  async createProduct(insertProduct) {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  async updateProduct(id, updateProduct) {
    const [product] = await db.update(products).set(updateProduct).where(eq(products.id, id)).returning();
    return product || void 0;
  }
  // Orders
  async getOrders() {
    const ordersWithItems = await db.query.orders.findMany({
      with: {
        items: {
          with: {
            product: true
          }
        }
      },
      orderBy: (orders2, { desc }) => [desc(orders2.createdAt)]
    });
    return ordersWithItems;
  }
  async getOrder(id) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
    return order || void 0;
  }
  async getOrderByNumber(orderNumber) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
    return order || void 0;
  }
  async createOrder(insertOrder, items) {
    const orderNumber = `MH${Date.now().toString().slice(-6)}`;
    const [order] = await db.insert(orders).values({
      ...insertOrder,
      orderNumber
    }).returning();
    const orderItemsData = items.map((item) => ({
      ...item,
      orderId: order.id
    }));
    await db.insert(orderItems).values(orderItemsData);
    const orderWithItems = await this.getOrder(order.id);
    return orderWithItems;
  }
  async updateOrderStatus(id, status) {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order || void 0;
  }
  // Calendar Slots
  async getAvailableSlots(date) {
    return await db.select().from(calendarSlots).where(and(
      eq(calendarSlots.date, date),
      eq(calendarSlots.active, true)
    ));
  }
  async getSlot(date, time) {
    const [slot] = await db.select().from(calendarSlots).where(and(
      eq(calendarSlots.date, date),
      eq(calendarSlots.time, time)
    ));
    return slot || void 0;
  }
  async bookSlot(date, time) {
    const currentSlot = await this.getSlot(date, time);
    if (!currentSlot) return void 0;
    const [slot] = await db.update(calendarSlots).set({ bookedCount: currentSlot.bookedCount + 1 }).where(and(
      eq(calendarSlots.date, date),
      eq(calendarSlots.time, time)
    )).returning();
    return slot || void 0;
  }
  async createSlot(insertSlot) {
    const [slot] = await db.insert(calendarSlots).values(insertSlot).returning();
    return slot;
  }
  // Promotions
  async getActivePromotions() {
    return await db.select().from(promotions).where(eq(promotions.active, true));
  }
  async getPromotion(id) {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotion || void 0;
  }
  async createPromotion(insertPromotion) {
    const [promotion] = await db.insert(promotions).values(insertPromotion).returning();
    return promotion;
  }
  // Settings
  async getSetting(key) {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || void 0;
  }
  async setSetting(key, value) {
    const [setting] = await db.insert(settings).values({ key, value }).onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: /* @__PURE__ */ new Date() }
    }).returning();
    return setting;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/products", async (req, res) => {
    try {
      const { type } = req.query;
      const products2 = type ? await storage.getProductsByType(type) : await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const orders2 = await storage.getOrders();
      res.json(orders2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  app2.get("/api/orders/number/:orderNumber", async (req, res) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  const createOrderSchema = z.object({
    order: insertOrderSchema,
    items: z.array(insertOrderItemSchema)
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = createOrderSchema.parse(req.body);
      const slot = await storage.getSlot(
        order.scheduledAt.toISOString().split("T")[0],
        order.scheduledAt.toTimeString().slice(0, 5)
      );
      if (!slot) {
        return res.status(400).json({ message: "Selected time slot not available" });
      }
      if (slot.bookedCount >= slot.capacity) {
        return res.status(400).json({ message: "Selected time slot is full" });
      }
      const newOrder = await storage.createOrder(order, items);
      await storage.bookSlot(
        order.scheduledAt.toISOString().split("T")[0],
        order.scheduledAt.toTimeString().slice(0, 5)
      );
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  app2.get("/api/slots/:date", async (req, res) => {
    try {
      const slots = await storage.getAvailableSlots(req.params.date);
      res.json(slots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time slots" });
    }
  });
  app2.get("/api/slots/:date/:time", async (req, res) => {
    try {
      const slot = await storage.getSlot(req.params.date, req.params.time);
      if (!slot) {
        return res.status(404).json({ message: "Time slot not found" });
      }
      res.json(slot);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time slot" });
    }
  });
  app2.get("/api/promotions", async (req, res) => {
    try {
      const promotions2 = await storage.getActivePromotions();
      res.json(promotions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });
  app2.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });
  app2.post("/api/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      const setting = await storage.setSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to save setting" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(
    import.meta.dirname,
    "..",
    "dist",
    "public"
  );
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else if (!process.env.VERCEL) {
    serveStatic(app);
  }
})();
var handler = serverless(app);
var index_default = app;
export {
  app,
  index_default as default,
  handler
};
