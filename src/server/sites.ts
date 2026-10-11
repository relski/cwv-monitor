import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db'
import { sites } from '../db/schema'
import { requireUser } from './auth'

export const listSites = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await requireUser()
  return db
    .select()
    .from(sites)
    .where(eq(sites.userId, user.id))
    .orderBy(desc(sites.createdAt))
})

export const addSite = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ url: z.string().url() }))
  .handler(async ({ data }) => {
    const user = await requireUser()
    const url = new URL(data.url).toString()
    await db.insert(sites).values({ userId: user.id, url }).onConflictDoNothing()
    return { ok: true }
  })
