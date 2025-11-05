import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper to check if user is admin
const isAdmin = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;
  
  const user = await ctx.db.get(userId);
  return user?.role === "admin";
};

// Get all users (admin only)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    return await ctx.db.query("users").order("desc").take(100);
  },
});

// Get all listings (admin only)
export const getAllListings = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    return await ctx.db.query("listings").order("desc").take(100);
  },
});

// Get all transactions (admin only)
export const getAllTransactions = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    return await ctx.db.query("transactions").order("desc").take(100);
  },
});

// Get all handler registrations (admin only)
export const getAllHandlerRegistrations = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    return await ctx.db.query("handlerRegistrations").order("desc").take(100);
  },
});

// Update handler registration status (admin only)
export const updateHandlerStatus = mutation({
  args: {
    registrationId: v.id("handlerRegistrations"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    await ctx.db.patch(args.registrationId, {
      status: args.status,
    });
    
    // Create notification for status update
    const registration = await ctx.db.get(args.registrationId);
    if (registration) {
      await ctx.db.insert("emailNotifications", {
        userId: registration.userId || "system",
        email: registration.email,
        type: "handler_registration",
        subject: `Handler Registration ${args.status}`,
        body: `Your handler registration has been ${args.status}.`,
        status: "pending",
      });
    }
  },
});

// Get platform statistics (admin only)
export const getPlatformStats = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    const users = await ctx.db.query("users").collect();
    const listings = await ctx.db.query("listings").collect();
    const transactions = await ctx.db.query("transactions").collect();
    const handlers = await ctx.db.query("handlerRegistrations").collect();
    
    const completedTransactions = transactions.filter((t) => t.status === "completed");
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalUsers: users.length,
      totalListings: listings.length,
      activeListings: listings.filter((l) => l.status === "active").length,
      totalTransactions: transactions.length,
      completedTransactions: completedTransactions.length,
      totalRevenue,
      totalHandlers: handlers.length,
      approvedHandlers: handlers.filter((h) => h.status === "approved").length,
    };
  },
});
