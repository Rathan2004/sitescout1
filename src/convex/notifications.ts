import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create email notification
export const createNotification = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("emailNotifications", {
      userId: args.userId,
      email: args.email,
      type: args.type,
      subject: args.subject,
      body: args.body,
      status: "pending",
    });
    return notificationId;
  },
});

// Get pending notifications
export const getPendingNotifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("emailNotifications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Mark notification as sent
export const markNotificationSent = mutation({
  args: {
    notificationId: v.id("emailNotifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      status: "sent",
      sentAt: Date.now(),
    });
  },
});

// Get user notifications
export const getUserNotifications = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailNotifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);
  },
});
