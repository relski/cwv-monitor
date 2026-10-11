import { pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'

export const sites = pgTable(
  'sites',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.url)],
)
