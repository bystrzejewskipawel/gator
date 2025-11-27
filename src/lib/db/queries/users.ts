import { db } from "..";
import {users} from "src/schema.js";
import { sql, eq } from 'drizzle-orm';

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(userName: string) {
  const [result] = await db.select().from(users).where(eq(users.name, userName));
  return result;
}

export async function deleteUsers() {
  const [result] = await db.delete(users);
  return result;
}

export async function getUsers() {
  const result = db.select().from(users);
  return result;
}