"use server";

import { connectToDatabase } from "@/database/mongoose";

// Better Auth stores users in the "user" collection.
export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongoose connection not connected");
    const users = await db
      .collection("user")
      .find({ email: { $exists: true, $ne: null } }, { projection: { _id: 1, id: 1, email: 1, name: 1 } })
      .toArray();
    return users
      .filter((u) => u.email && u.name)
      .map((u) => ({ id: (u.id as string) || u._id?.toString() || "", email: u.email as string, name: u.name as string }));
  } catch (e) {
    console.error("Error fetching users for news email:", e);
    return [];
  }
};
