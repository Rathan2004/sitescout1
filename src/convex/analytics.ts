import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Track event
export const trackEvent = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("analytics", {
      eventType: args.eventType,
      userId: args.userId,
      listingId: args.listingId,
      metadata: args.metadata,
    });
    return eventId;
  },
});

// Get analytics summary
export const getAnalyticsSummary = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allEvents = await ctx.db.query("analytics").collect();
    
    const filteredEvents = allEvents.filter((event) => {
      if (args.startDate && event._creationTime < args.startDate) return false;
      if (args.endDate && event._creationTime > args.endDate) return false;
      return true;
    });

    const summary = {
      totalEvents: filteredEvents.length,
      listingViews: filteredEvents.filter((e) => e.eventType === "listing_view").length,
      listingsCreated: filteredEvents.filter((e) => e.eventType === "listing_created").length,
      transactionsCompleted: filteredEvents.filter((e) => e.eventType === "transaction_completed").length,
      usersRegistered: filteredEvents.filter((e) => e.eventType === "user_registered").length,
      handlersRegistered: filteredEvents.filter((e) => e.eventType === "handler_registered").length,
    };

    return summary;
  },
});

// Get events by type
export const getEventsByType = query({
  args: {
    eventType: v.union(
      v.literal("listing_view"),
      v.literal("listing_created"),
      v.literal("transaction_completed"),
      v.literal("user_registered"),
      v.literal("handler_registered")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analytics")
      .withIndex("by_eventType", (q) => q.eq("eventType", args.eventType))
      .order("desc")
      .take(100);
  },
});
