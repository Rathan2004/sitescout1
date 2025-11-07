import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new listing
export const createListing = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Must be signed in to create a listing");
    }

    const listingId = await ctx.db.insert("listings", {
      userId,
      title: args.title,
      description: args.description,
      domain: args.domain,
      price: args.price,
      currency: args.currency,
      listingType: args.listingType,
      category: args.category,
      monthlyRevenue: args.monthlyRevenue,
      monthlyTraffic: args.monthlyTraffic,
      domainAge: args.domainAge,
      domainAuthority: args.domainAuthority,
      technologies: args.technologies,
      images: args.images,
      featuredImage: args.featuredImage,
      status: "pending",
      featured: false,
      views: 0,
    });

    // Track analytics
    await ctx.db.insert("analytics", {
      eventType: "listing_created",
      userId,
      listingId: listingId.toString(),
    });

    return listingId;
  },
});

// Get all active listings with filters
export const getListings = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    listingType: v.optional(v.union(v.literal("sale"), v.literal("rent"))),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let listings = await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .take(100);

    // Apply filters
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(searchLower) ||
          l.domain.toLowerCase().includes(searchLower) ||
          l.description.toLowerCase().includes(searchLower)
      );
    }

    if (args.category) {
      listings = listings.filter((l) => l.category === args.category);
    }

    if (args.listingType) {
      listings = listings.filter((l) => l.listingType === args.listingType);
    }

    if (args.minPrice !== undefined) {
      listings = listings.filter((l) => l.price >= args.minPrice!);
    }

    if (args.maxPrice !== undefined) {
      listings = listings.filter((l) => l.price <= args.maxPrice!);
    }

    return listings;
  },
});

// Get a single listing by ID
export const getListingById = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      return null;
    }

    // Get user info - userId is a string, need to cast to Id
    const userId = listing.userId as any;
    const user = await ctx.db.get(userId);

    return {
      ...listing,
      user: user && '_id' in user && 'email' in user
        ? {
            id: user._id,
            name: (user as any).name || "Anonymous",
            email: (user as any).email || "",
            avatar: (user as any).image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`,
            role: (user as any).role || "user",
          }
        : undefined,
    };
  },
});

// Increment listing views
export const incrementViews = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    await ctx.db.patch(args.listingId, {
      views: listing.views + 1,
    });

    // Track analytics
    await ctx.db.insert("analytics", {
      eventType: "listing_view",
      listingId: args.listingId.toString(),
    });
  },
});

// Update listing
export const updateListing = mutation({
  args: {
    listingId: v.id("listings"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("pending"), v.literal("sold"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.userId !== userId) {
      throw new Error("Unauthorized: You can only update your own listings");
    }

    const updates: any = {};
    if (args.title) updates.title = args.title;
    if (args.description) updates.description = args.description;
    if (args.price) updates.price = args.price;
    if (args.status) updates.status = args.status;

    await ctx.db.patch(args.listingId, updates);
  },
});

// Delete listing
export const deleteListing = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own listings");
    }

    await ctx.db.delete(args.listingId);
  },
});

// Get user's listings
export const getUserListings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
