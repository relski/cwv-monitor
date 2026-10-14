import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { checks } from "../db/schema";
import { addSite, listSites } from "../server/sites";
import { runCheck } from "../server/checks";
import { ms, cls } from "#/lib/format";

type Check = typeof checks.$inferSelect

export const Route = createFileRoute('/')({
  loader: () => listSites(),
  component: Home,
})

function SiteResult({ latest }: { latest: Check }) {
  let fieldText: string
  if (latest.fieldSource === null) {
    fieldText = 'no data (not enough traffic)'
  } else {
    fieldText = `LCP ${ms(latest.fieldLcp)} · INP ${ms(latest.fieldInp)} · CLS ${cls(latest.fieldCls)}`
    if (latest.fieldSource === 'origin') fieldText += ' (site-wide)'
  }

  return (
    <div style={{ fontSize: 14, marginTop: 6 }}>
      <div>Field (real users): {fieldText}</div>
      <div>
        Lab (Lighthouse): LCP {ms(latest.labLcp)} · TBT {ms(latest.labTbt)} · CLS{' '}
        {cls(latest.labCls)} · score {latest.perfScore ?? '–'}
      </div>
      <div style={{ color: '#888' }}>
        checked {new Date(latest.createdAt).toLocaleString()}
      </div>
    </div>
  )
}

function Home() {
  const sites = Route.useLoaderData()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [running, setRunning] = useState<number | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await addSite({ data: { url } })
      setUrl('')
      router.invalidate()
    } catch {
      setError('Enter a valid URL, including https://')
    }
  }

  async function onCheck(siteId: number) {
    setError('')
    setRunning(siteId)
    try {
      await runCheck({ data: { siteId } })
      router.invalidate()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Check failed')
    } finally {
      setRunning(null)
    }
  }

  return (
    <main style={{ maxWidth: 1200, margin: '40px auto', padding: 16 }}>
      <h1>CWV Monitor</h1>
      <form onSubmit={onSubmit}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          style={{ width: '70%' }}
        />
        <button type="submit">Add</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sites.map((s) => (
          <li key={s.id} style={{ margin: '20px 0' }}>
            <strong>{s.url}</strong>{' '}
            <button onClick={() => onCheck(s.id)} disabled={running === s.id}>
              {running === s.id ? 'Checking… (can take ~30s)' : 'Check now'}
            </button>
            {s.latest ? (
              <SiteResult latest={s.latest} />
            ) : (
              <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
                Not checked yet
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}