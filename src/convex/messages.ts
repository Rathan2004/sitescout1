import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Send a message
export const sendMessage = mutation({
  args: {
    listingId: v.string(),
    receiverId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Must be signed in to send messages");
    }

    const messageId = await ctx.db.insert("messages", {
      listingId: args.listingId,
      senderId: userId,
      receiverId: args.receiverId,
      content: args.content,
      read: false,
    });

    return messageId;
  },
});

// Get messages for a conversation
export const getConversation = query({
  args: {
    listingId: v.string(),
    otherUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("listingId"), args.listingId),
          q.or(
            q.and(
              q.eq(q.field("senderId"), userId),
              q.eq(q.field("receiverId"), args.otherUserId)
            ),
            q.and(
              q.eq(q.field("senderId"), args.otherUserId),
              q.eq(q.field("receiverId"), userId)
            )
          )
        )
      )
      .collect();

    return messages.sort((a, b) => a._creationTime - b._creationTime);
  },
});

// Mark messages as read
export const markAsRead = mutation({
  args: {
    messageIds: v.array(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    for (const messageId of args.messageIds) {
      const message = await ctx.db.get(messageId);
      if (message && message.receiverId === userId) {
        await ctx.db.patch(messageId, { read: true });
      }
    }
  },
});

// Get unread message count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    const unreadMessages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("receiverId"), userId),
          q.eq(q.field("read"), false)
        )
      )
      .collect();

    return unreadMessages.length;
  },
});
