import { mysqlTable, serial, varchar, timestamp, date, text, bigint } from "drizzle-orm/mysql-core"

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
