import { mysqlTable, serial, varchar, timestamp, date, text, bigint, time, customType } from "drizzle-orm/mysql-core"

// BIGINT UNSIGNED — tipe yang sama dengan serial, dipakai untuk FK columns
const ubigint = customType<{ data: number; driverData: string }>({
  dataType: () => "bigint unsigned",
  fromDriver: (v) => Number(v),
  toDriver: (v) => String(v),
})

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  nik: varchar("nik", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // profil
  tempatLahir:  varchar("tempat_lahir", { length: 100 }),
  tglLahir:     date("tgl_lahir"),
  noHp:         varchar("no_hp", { length: 20 }),
  noKtp:        varchar("no_ktp", { length: 20 }),
  jk:           varchar("jk", { length: 1 }),
  agama:        varchar("agama", { length: 30 }),
  alamat:       text("alamat"),
  role:         varchar("role", { length: 50 }),
  idbot:        bigint("idbot", { mode: "number" }),
  statusNikah:  varchar("status_nikah", { length: 20 }),
  usernameTele: varchar("username_tele", { length: 100 }),
  ukuranBaju:   varchar("ukuran_baju", { length: 10 }),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type PublicUser = Omit<User, "password">

// ── teams ────────────────────────────────────────────────────────────────────
export const teams = mysqlTable("teams", {
  id:     serial("id").primaryKey(),
  nmTeam: varchar("nm_team", { length: 100 }).notNull(),
})

export type Team = typeof teams.$inferSelect
export type NewTeam = typeof teams.$inferInsert

// ── shifts ───────────────────────────────────────────────────────────────────
export const shifts = mysqlTable("shifts", {
  id:        serial("id").primaryKey(),
  nmShift:   varchar("nm_shift",   { length: 100 }).notNull(),
  kodeShift: varchar("kode_shift", { length: 20  }).notNull(),
  jamMasuk:  time("jam_masuk").notNull(),
  jamKeluar: time("jam_keluar").notNull(),
})

export type Shift = typeof shifts.$inferSelect
export type NewShift = typeof shifts.$inferInsert

// ── jadwals ──────────────────────────────────────────────────────────────────
export const jadwals = mysqlTable("jadwals", {
  id:             serial("id").primaryKey(),
  shiftId:        ubigint("shift_id").notNull().references(() => shifts.id),
  teamId:         ubigint("team_id").notNull().references(() => teams.id),
  userId:         ubigint("user_id").notNull().references(() => users.id),
  tglKerja:       date("tgl_kerja").notNull(),
  ket:            varchar("ket", { length: 255 }),
  statusPresensi: varchar("status_presensi", { length: 50 }),
})

export type Jadwal = typeof jadwals.$inferSelect
export type NewJadwal = typeof jadwals.$inferInsert
