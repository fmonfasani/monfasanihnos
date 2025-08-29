"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/index.ts
var index_exports = {};
__export(index_exports, {
  app: () => app,
  default: () => index_default,
  handler: () => handler
});
module.exports = __toCommonJS(index_exports);
var import_express2 = __toESM(require("express"));
var import_serverless_http = __toESM(require("serverless-http"));

// server/routes.ts
var import_http = require("http");

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
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var import_drizzle_orm2 = require("drizzle-orm");
var import_drizzle_zod = require("drizzle-zod");
var products = (0, import_pg_core.pgTable)("products", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  name: (0, import_pg_core.text)("name").notNull(),
  description: (0, import_pg_core.text)("description"),
  type: (0, import_pg_core.text)("type").notNull(),
  // "pizza" | "empanada"
  price: (0, import_pg_core.integer)("price").notNull(),
  // price in cents
  image: (0, import_pg_core.text)("image"),
  active: (0, import_pg_core.boolean)("active").notNull().default(true),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var orders = (0, import_pg_core.pgTable)("orders", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  orderNumber: (0, import_pg_core.text)("order_number").notNull().unique(),
  customerName: (0, import_pg_core.text)("customer_name").notNull(),
  customerPhone: (0, import_pg_core.text)("customer_phone").notNull(),
  customerEmail: (0, import_pg_core.text)("customer_email"),
  mode: (0, import_pg_core.text)("mode").notNull(),
  // "takeaway" | "delivery"
  address: (0, import_pg_core.text)("address"),
  neighborhood: (0, import_pg_core.text)("neighborhood"),
  reference: (0, import_pg_core.text)("reference"),
  notes: (0, import_pg_core.text)("notes"),
  status: (0, import_pg_core.text)("status").notNull().default("pending"),
  // "pending" | "confirmed" | "in_progress" | "ready" | "completed" | "cancelled"
  scheduledAt: (0, import_pg_core.timestamp)("scheduled_at").notNull(),
  totalAmount: (0, import_pg_core.integer)("total_amount").notNull(),
  deliveryFee: (0, import_pg_core.integer)("delivery_fee").default(0),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var orderItems = (0, import_pg_core.pgTable)("order_items", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  orderId: (0, import_pg_core.varchar)("order_id").notNull().references(() => orders.id),
  productId: (0, import_pg_core.varchar)("product_id").notNull().references(() => products.id),
  quantity: (0, import_pg_core.integer)("quantity").notNull(),
  price: (0, import_pg_core.integer)("price").notNull()
  // price at time of order
});
var calendarSlots = (0, import_pg_core.pgTable)("calendar_slots", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  date: (0, import_pg_core.text)("date").notNull(),
  // YYYY-MM-DD format
  time: (0, import_pg_core.text)("time").notNull(),
  // HH:MM format
  capacity: (0, import_pg_core.integer)("capacity").notNull().default(8),
  bookedCount: (0, import_pg_core.integer)("booked_count").notNull().default(0),
  active: (0, import_pg_core.boolean)("active").notNull().default(true)
});
var promotions = (0, import_pg_core.pgTable)("promotions", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  title: (0, import_pg_core.text)("title").notNull(),
  description: (0, import_pg_core.text)("description").notNull(),
  discountPercentage: (0, import_pg_core.integer)("discount_percentage"),
  originalPrice: (0, import_pg_core.integer)("original_price"),
  promoPrice: (0, import_pg_core.integer)("promo_price").notNull(),
  badgeText: (0, import_pg_core.text)("badge_text"),
  gradient: (0, import_pg_core.text)("gradient").notNull(),
  // CSS gradient class
  active: (0, import_pg_core.boolean)("active").notNull().default(true),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var settings = (0, import_pg_core.pgTable)("settings", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  key: (0, import_pg_core.text)("key").notNull().unique(),
  value: (0, import_pg_core.jsonb)("value").notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
});
var ordersRelations = (0, import_drizzle_orm2.relations)(orders, ({ many }) => ({
  items: many(orderItems)
}));
var orderItemsRelations = (0, import_drizzle_orm2.relations)(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));
var productsRelations = (0, import_drizzle_orm2.relations)(products, ({ many }) => ({
  orderItems: many(orderItems)
}));
var insertProductSchema = (0, import_drizzle_zod.createInsertSchema)(products).omit({
  id: true,
  createdAt: true
});
var insertOrderSchema = (0, import_drizzle_zod.createInsertSchema)(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true
});
var insertOrderItemSchema = (0, import_drizzle_zod.createInsertSchema)(orderItems).omit({
  id: true
});
var insertCalendarSlotSchema = (0, import_drizzle_zod.createInsertSchema)(calendarSlots).omit({
  id: true
});
var insertPromotionSchema = (0, import_drizzle_zod.createInsertSchema)(promotions).omit({
  id: true,
  createdAt: true
});
var insertSettingSchema = (0, import_drizzle_zod.createInsertSchema)(settings).omit({
  id: true,
  updatedAt: true
});

// server/db.ts
var import_serverless = require("@neondatabase/serverless");
var import_neon_serverless = require("drizzle-orm/neon-serverless");
var import_ws = __toESM(require("ws"));
import_serverless.neonConfig.webSocketConstructor = import_ws.default;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new import_serverless.Pool({ connectionString: process.env.DATABASE_URL });
var db = (0, import_neon_serverless.drizzle)({ client: pool, schema: schema_exports });

// server/storage.ts
var import_drizzle_orm3 = require("drizzle-orm");
var DatabaseStorage = class {
  // Products
  async getProducts() {
    return await db.select().from(products).where((0, import_drizzle_orm3.eq)(products.active, true));
  }
  async getProductsByType(type) {
    return await db.select().from(products).where((0, import_drizzle_orm3.and)((0, import_drizzle_orm3.eq)(products.type, type), (0, import_drizzle_orm3.eq)(products.active, true)));
  }
  async getProduct(id) {
    const [product] = await db.select().from(products).where((0, import_drizzle_orm3.eq)(products.id, id));
    return product || void 0;
  }
  async createProduct(insertProduct) {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  async updateProduct(id, updateProduct) {
    const [product] = await db.update(products).set(updateProduct).where((0, import_drizzle_orm3.eq)(products.id, id)).returning();
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
      where: (0, import_drizzle_orm3.eq)(orders.id, id),
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
      where: (0, import_drizzle_orm3.eq)(orders.orderNumber, orderNumber),
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
    const [order] = await db.update(orders).set({ status }).where((0, import_drizzle_orm3.eq)(orders.id, id)).returning();
    return order || void 0;
  }
  // Calendar Slots
  async getAvailableSlots(date) {
    return await db.select().from(calendarSlots).where((0, import_drizzle_orm3.and)(
      (0, import_drizzle_orm3.eq)(calendarSlots.date, date),
      (0, import_drizzle_orm3.eq)(calendarSlots.active, true)
    ));
  }
  async getSlot(date, time) {
    const [slot] = await db.select().from(calendarSlots).where((0, import_drizzle_orm3.and)(
      (0, import_drizzle_orm3.eq)(calendarSlots.date, date),
      (0, import_drizzle_orm3.eq)(calendarSlots.time, time)
    ));
    return slot || void 0;
  }
  async bookSlot(date, time) {
    const currentSlot = await this.getSlot(date, time);
    if (!currentSlot) return void 0;
    const [slot] = await db.update(calendarSlots).set({ bookedCount: currentSlot.bookedCount + 1 }).where((0, import_drizzle_orm3.and)(
      (0, import_drizzle_orm3.eq)(calendarSlots.date, date),
      (0, import_drizzle_orm3.eq)(calendarSlots.time, time)
    )).returning();
    return slot || void 0;
  }
  async createSlot(insertSlot) {
    const [slot] = await db.insert(calendarSlots).values(insertSlot).returning();
    return slot;
  }
  // Promotions
  async getActivePromotions() {
    return await db.select().from(promotions).where((0, import_drizzle_orm3.eq)(promotions.active, true));
  }
  async getPromotion(id) {
    const [promotion] = await db.select().from(promotions).where((0, import_drizzle_orm3.eq)(promotions.id, id));
    return promotion || void 0;
  }
  async createPromotion(insertPromotion) {
    const [promotion] = await db.insert(promotions).values(insertPromotion).returning();
    return promotion;
  }
  // Settings
  async getSetting(key) {
    const [setting] = await db.select().from(settings).where((0, import_drizzle_orm3.eq)(settings.key, key));
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
var import_zod = require("zod");
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
  const createOrderSchema = import_zod.z.object({
    order: insertOrderSchema,
    items: import_zod.z.array(insertOrderItemSchema)
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
      if (error instanceof import_zod.z.ZodError) {
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
  const httpServer = (0, import_http.createServer)(app2);
  return httpServer;
}

// server/vite.ts
var import_express = __toESM(require("express"));
var import_fs = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_vite2 = require("vite");

// vite.config.ts
var import_vite = require("vite");
var import_path = __toESM(require("path"));
var vite_config_default = (0, import_vite.defineConfig)(async () => {
  const react = (await import("@vitejs/plugin-react")).default;
  const runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;
  const plugins = [react(), runtimeErrorOverlay()];
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }
  return {
    plugins,
    resolve: {
      alias: {
        "@": import_path.default.resolve(__dirname, "client", "src"),
        "@shared": import_path.default.resolve(__dirname, "shared"),
        "@assets": import_path.default.resolve(__dirname, "attached_assets")
      }
    },
    root: import_path.default.resolve(__dirname, "client"),
    build: {
      outDir: import_path.default.resolve(__dirname, "dist/public"),
      emptyOutDir: true
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"]
      }
    }
  };
});

// server/vite.ts
var import_nanoid = require("nanoid");
var viteLogger = (0, import_vite2.createLogger)();
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
  const resolvedConfig = await vite_config_default();
  const vite = await (0, import_vite2.createServer)({
    ...resolvedConfig,
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
      const clientTemplate = import_path2.default.resolve(
        __dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await import_fs.default.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${(0, import_nanoid.nanoid)()}"`
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
  const distPath = import_path2.default.resolve(
    __dirname,
    "..",
    "dist",
    "public"
  );
  if (!import_fs.default.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(import_express.default.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(import_path2.default.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
app.use(import_express2.default.urlencoded({ extended: false }));
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
var handler = (0, import_serverless_http.default)(app);
var index_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app,
  handler
});
