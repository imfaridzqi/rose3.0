import { Elysia } from "elysia"
import { jwt } from "@elysiajs/jwt"

export type JwtPayload = {
  sub: number
  email: string
}

export const authMiddleware = new Elysia({ name: "auth-middleware" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .macro({
    requireAuth: true,
  })
  .resolve(async ({ jwt: jwtInstance, headers, error, macro }) => {
    if (!macro?.requireAuth) return {}

    const token = headers.authorization?.replace("Bearer ", "")
    if (!token) return error(401, { message: "Unauthorized" })

    const payload = await jwtInstance.verify(token)
    if (!payload) return error(401, { message: "Invalid or expired token" })

    return { currentUser: payload as unknown as JwtPayload }
  })
