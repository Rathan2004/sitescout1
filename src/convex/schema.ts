import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Listings table
    listings: defineTable({
      userId: v.string(),
      title: v.string(),
      description: v.string(),
      domain: v.string(),
      price: v.number(),
      currency: v.string(),
      listingType: v.union(v.literal("sale"), v.literal("rent")),
      category: v.string(),
      monthlyRevenue: v.optional(v.number()),
      monthlyTraffic: v.optional(v.number()),
      domainAge: v.optional(v.number()),
      domainAuthority: v.optional(v.number()),
      technologies: v.array(v.string()),
      images: v.array(v.string()),
      featuredImage: v.string(),
      status: v.union(v.literal("active"), v.literal("pending"), v.literal("sold"), v.literal("inactive")),
      featured: v.boolean(),
      views: v.number(),
    }).index("by_userId", ["userId"])
      .index("by_status", ["status"])
      .index("by_listingType", ["listingType"]),

    // Handler registrations table
    handlerRegistrations: defineTable({
      userId: v.optional(v.string()),
      name: v.string(),
      email: v.string(),
      serviceType: v.union(v.literal("transfer"), v.literal("maintenance"), v.literal("optimization")),
      hourlyRate: v.number(),
      experience: v.string(),
      skills: v.array(v.string()),
      bio: v.string(),
      portfolio: v.optional(v.string()),
      status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    }).index("by_email", ["email"])
      .index("by_status", ["status"]),

    // Transactions table
    transactions: defineTable({
      listingId: v.string(),
      buyerId: v.string(),
      sellerId: v.string(),
      amount: v.number(),
      currency: v.string(),
      status: v.union(v.literal("pending"), v.literal("completed"), v.literal("cancelled")),
      paymentMethod: v.optional(v.string()),
    }).index("by_buyerId", ["buyerId"])
      .index("by_sellerId", ["sellerId"])
      .index("by_status", ["status"]),

    // Email notifications table
    emailNotifications: defineTable({
      userId: v.string(),
      email: v.string(),
      type: v.union(
        v.literal("registration"),
        v.literal("payment_status"),
        v.literal("transaction_update"),
        v.literal("handler_registration"),
        v.literal("listing_status")
      ),
      subject: v.string(),
      body: v.string(),
      status: v.union(v.literal("pending"), v.literal("sent"), v.literal("failed")),
      sentAt: v.optional(v.number()),
    }).index("by_userId", ["userId"])
      .index("by_status", ["status"]),

    // Analytics table
    analytics: defineTable({
      eventType: v.union(
        v.literal("listing_view"),
        v.literal("listing_created"),
        v.literal("transaction_completed"),
        v.literal("user_registered"),
        v.literal("handler_registered")
      ),
      userId: v.optional(v.string()),
      listingId: v.optional(v.string()),
      metadata: v.optional(v.string()),
    }).index("by_eventType", ["eventType"])
      .index("by_userId", ["userId"]),

    // Messages table
    messages: defineTable({
      listingId: v.string(),
      senderId: v.string(),
      receiverId: v.string(),
      content: v.string(),
      read: v.boolean(),
    }).index("by_listingId", ["listingId"])
      .index("by_senderId", ["senderId"])
      .index("by_receiverId", ["receiverId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;