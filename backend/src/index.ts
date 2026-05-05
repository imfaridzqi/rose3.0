import "dotenv/config"
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import pino from "pino"
import { usersRoute } from "./routes/users"
import { authRoute } from "./routes/auth"

const logger = pino({ level: "info" })

const app = new Elysia()
  .use(cors())
  .onRequest(({ request }) => {
    logger.info({ method: request.method, url: request.url }, "incoming request")
  })
  .onError(({ error, code }) => {
    logger.error({ code, error }, "request error")
  })
  .get("/health", () => ({ status: "ok" }))
  .use(authRoute)
  .use(usersRoute)
  .listen(Number(process.env.PORT) || 3000)

logger.info(`Server running at http://localhost:${app.server?.port}`)
