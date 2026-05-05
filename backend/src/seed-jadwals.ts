import "dotenv/config"
import { db } from "./db"
import { jadwals } from "./db/schema"

// user_id → team_id
const userTeam: Record<number, number> = {
  1:  1,  // Irfan            → PERFORMANCE HD
  2:  1,  // Andi Kurniawan   → PERFORMANCE HD
  3:  2,  // Siti Rahayu      → SURVEILLANCE GAMAS
  4:  3,  // Budi Santoso     → FBB ASSURANCE SOLVER
  5:  2,  // Dewi Lestari     → SURVEILLANCE GAMAS
  6:  4,  // Rendra Wijaya    → FFM HSI
  7:  4,  // Fitri Handayani  → FFM HSI
  8:  5,  // Hendra Saputra   → ASSURANCE MOBILE
  9:  5,  // Yuni Astuti      → ASSURANCE MOBILE
  10: 6,  // Dimas Prasetyo   → FBB ASSURANCE TIAL
  11: 6,  // Rini Oktaviani   → FBB ASSURANCE TIAL
}

// shift rotation per user (day1, day2, day3)
// shift ids: 1=Pagi(A) 3=Siang(B) 4=Malam(C) 11=Pagi10(A10) 14=Pagi9(A9) 13=Siang11(B11)
const rotation: Record<number, [number, number, number]> = {
  1:  [2,  2,  2 ],  // Irfan            → AO, AO, AO (office hour)
  2:  [1,  3,  4 ],  // Andi Kurniawan   → A → B → C
  3:  [3,  4,  1 ],  // Siti Rahayu      → B → C → A
  4:  [2,  2,  2 ],  // Budi Santoso     → AO, AO, AO (supervisor)
  5:  [4,  1,  3 ],  // Dewi Lestari     → C → A → B
  6:  [1,  1,  3 ],  // Rendra Wijaya    → A, A, B
  7:  [14, 14, 11],  // Fitri Handayani  → A9, A9, A10
  8:  [3,  13, 3 ],  // Hendra Saputra   → B, B11, B
  9:  [11, 3,  13],  // Yuni Astuti      → A10, B, B11
  10: [2,  2,  2 ],  // Dimas Prasetyo   → AO, AO, AO (supervisor)
  11: [1,  4,  1 ],  // Rini Oktaviani   → A, C, A
}

const today = new Date("2026-05-05")
const dates = [1, 2, 3].map(n => {
  const d = new Date(today)
  d.setDate(today.getDate() + n)
  return d.toISOString().split("T")[0]
})

console.log(`Membuat jadwal untuk: ${dates.join(", ")}\n`)

let inserted = 0
for (const [userIdStr, shifts] of Object.entries(rotation)) {
  const userId = Number(userIdStr)
  const teamId = userTeam[userId]

  for (let i = 0; i < 3; i++) {
    const shiftId = shifts[i]
    const tglKerja = dates[i]
    try {
      await db.insert(jadwals).values({ userId, teamId, shiftId, tglKerja })
      inserted++
    } catch (e: any) {
      console.log(`✗ user ${userId} tgl ${tglKerja} — ${e.message}`)
    }
  }

  console.log(`✓ user_id ${userId} → team ${teamId} | ${shifts.map((s, i) => `${dates[i]}:shift${s}`).join(", ")}`)
}

console.log(`\nSelesai: ${inserted}/33 jadwal berhasil dimasukkan.`)
process.exit(0)
