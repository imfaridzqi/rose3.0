import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { db } from "../db"
import { users } from "../db/schema"
import { eq } from "drizzle-orm"
import type { PublicUser } from "../db/schema"

function omitPassword(user: typeof users.$inferSelect): PublicUser {
  const { password: _, ...rest } = user
  return rest
}

export const authRoute = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .post(
    "/register",
    async ({ body, error }) => {
      const [existing] = await db.select().from(users).where(eq(users.email, body.email))
      if (existing) return error(409, { message: "Email already registered" })

      const hashed = await Bun.password.hash(body.password)
      await db.insert(users).values({ name: body.name, email: body.email, password: hashed })

      const [created] = await db.select().from(users).where(eq(users.email, body.email))
      return { user: omitPassword(created) }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 8 }),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, jwt: jwtInstance, error }) => {
      const [user] = await db.select().from(users).where(eq(users.email, body.email))
      if (!user) return error(401, { message: "Invalid email or password" })

      const valid = await Bun.password.verify(body.password, user.password)
      if (!valid) return error(401, { message: "Invalid email or password" })

      const token = await jwtInstance.sign({
        sub: String(user.id),
        email: user.email,
      })

      return { token, user: omitPassword(user) }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
    }
  )
  .get(
    "/me",
    async ({ headers, jwt: jwtInstance, error }) => {
      const token = headers.authorization?.replace("Bearer ", "")
      if (!token) return error(401, { message: "Unauthorized" })

      const payload = await jwtInstance.verify(token)
      if (!payload) return error(401, { message: "Invalid or expired token" })

      const [user] = await db.select().from(users).where(eq(users.id, Number(payload.sub)))
      if (!user) return error(404, { message: "User not found" })

      return { user: omitPassword(user) }
    }
  )
