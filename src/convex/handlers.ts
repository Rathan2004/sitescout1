import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Register as a handler
export const registerHandler = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    serviceType: v.union(v.literal("transfer"), v.literal("maintenance"), v.literal("optimization")),
    hourlyRate: v.number(),
    experience: v.string(),
    skills: v.array(v.string()),
    bio: v.string(),
    portfolio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const registrationId = await ctx.db.insert("handlerRegistrations", {
      userId: userId || undefined,
      name: args.name,
      email: args.email,
      serviceType: args.serviceType,
      hourlyRate: args.hourlyRate,
      experience: args.experience,
      skills: args.skills,
      bio: args.bio,
      portfolio: args.portfolio,
      status: "pending",
    });

    // Track analytics
    await ctx.db.insert("analytics", {
      eventType: "handler_registered",
      userId: userId || undefined,
    });

    // Send notification email
    await ctx.db.insert("emailNotifications", {
      userId: userId || "system",
      email: args.email,
      type: "handler_registration",
      subject: "Handler Registration Received",
      body: `Thank you for registering as a handler. We will review your application and get back to you soon.`,
      status: "pending",
    });

    return registrationId;
  },
});

// Get approved handlers
export const getApprovedHandlers = query({
  args: {
    serviceType: v.optional(v.union(v.literal("transfer"), v.literal("maintenance"), v.literal("optimization"))),
  },
  handler: async (ctx, args) => {
    let handlers = await ctx.db
      .query("handlerRegistrations")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    if (args.serviceType) {
      handlers = handlers.filter((h) => h.serviceType === args.serviceType);
    }

    return handlers;
  },
});
