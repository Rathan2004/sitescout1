import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a transaction
export const createTransaction = mutation({
  args: {
    listingId: v.string(),
    sellerId: v.string(),
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Must be signed in to create a transaction");
    }

    const transactionId = await ctx.db.insert("transactions", {
      listingId: args.listingId,
      buyerId: userId,
      sellerId: args.sellerId,
      amount: args.amount,
      currency: args.currency,
      status: "pending",
    });

    // Track analytics
    await ctx.db.insert("analytics", {
      eventType: "transaction_completed",
      userId,
      listingId: args.listingId,
    });

    return transactionId;
  },
});

// Get user's transactions (as buyer)
export const getBuyerTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("transactions")
      .withIndex("by_buyerId", (q) => q.eq("buyerId", userId))
      .order("desc")
      .collect();
  },
});

// Get user's transactions (as seller)
export const getSellerTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("transactions")
      .withIndex("by_sellerId", (q) => q.eq("sellerId", userId))
      .order("desc")
      .collect();
  },
});

// Update transaction status
export const updateTransactionStatus = mutation({
  args: {
    transactionId: v.id("transactions"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Only buyer or seller can update
    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.transactionId, {
      status: args.status,
    });

    // Send notification
    const recipientId = transaction.buyerId === userId ? transaction.sellerId : transaction.buyerId;
    const recipient = await ctx.db.get(recipientId as any);
    
    if (recipient && 'email' in recipient && recipient.email) {
      await ctx.db.insert("emailNotifications", {
        userId: recipientId,
        email: recipient.email,
        type: "transaction_update",
        subject: `Transaction ${args.status}`,
        body: `Your transaction has been ${args.status}.`,
        status: "pending",
      });
    }
  },
});
