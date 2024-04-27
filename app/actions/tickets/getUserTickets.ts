"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import { eq } from "drizzle-orm";

export async function getUserTickets(userId: string) {
  try {
    if (!userId) {
      return {
        status: false,
        error: "User Id is required",
      };
    }

    
  } catch (error: any) {
    return {
      status: false,
      error: error.message,
    };
  }
}
