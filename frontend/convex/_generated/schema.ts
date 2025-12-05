import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notebooks: defineTable({
    ownerUserId: v.string(),
    name: v.string(),
    content: v.string(),
    invitedUserIds: v.array(v.string())
  }),});
