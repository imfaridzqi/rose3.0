import { Elysia, t } from "elysia"
import { db } from "../db"
import { users } from "../db/schema"
import { eq } from "drizzle-orm"

export const usersRoute = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    return db.select().from(users)
  })
  .get("/:id", async ({ params, error }) => {
    const [user] = await db.select().from(users).where(eq(users.id, Number(params.id)))
    if (!user) return error(404, { message: "User not found" })
    return user
  })
  .post(
    "/",
    async ({ body, error }) => {
      const existing = await db.select().from(users).where(eq(users.email, body.email))
      if (existing.length > 0) return error(409, { message: "Email already exists" })
      await db.insert(users).values(body)
      const [created] = await db.select().from(users).where(eq(users.email, body.email))
      return created
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
      }),
    }
  )
  .delete("/:id", async ({ params, error }) => {
    const [user] = await db.select().from(users).where(eq(users.id, Number(params.id)))
    if (!user) return error(404, { message: "User not found" })
    await db.delete(users).where(eq(users.id, Number(params.id)))
    return { message: "Deleted" }
  })
