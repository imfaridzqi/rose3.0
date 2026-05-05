import { Elysia } from "elysia"
import { eq } from "drizzle-orm"
import { db } from "../db"
import { jadwals, users, teams, shifts } from "../db/schema"

export const jadwalsRoute = new Elysia({ prefix: "/jadwals" })
  .get("/today", async () => {
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

    const rows = await db
      .select({
        name:      users.name,
        nmTeam:    teams.nmTeam,
        nmShift:   shifts.nmShift,
        kodeShift: shifts.kodeShift,
      })
      .from(jadwals)
      .innerJoin(users,  eq(users.id,  jadwals.userId))
      .innerJoin(teams,  eq(teams.id,  jadwals.teamId))
      .innerJoin(shifts, eq(shifts.id, jadwals.shiftId))
      .where(eq(jadwals.tglKerja, today))
      .orderBy(users.name)

    const pagi  = rows.filter(r => r.kodeShift.startsWith("A"))
    const siang = rows.filter(r => r.kodeShift.startsWith("B"))
    const malam = rows.filter(r => r.kodeShift.startsWith("C"))

    return {
      date:  today,
      total: pagi.length + siang.length + malam.length,
      pagi,
      siang,
      malam,
    }
  })
