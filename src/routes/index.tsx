import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { checks } from "../db/schema";
import { addSite, listSites } from "../server/sites";
import { runCheck } from "../server/checks";
import { ms, cls } from "#/lib/format";
import { Button } from "#/components/ui/button";

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
        <Button type="submit">Add</Button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sites.map((s) => (
          <li key={s.id} style={{ margin: '20px 0' }}>
            <Link to="/sites/$siteId" params={{ siteId: String(s.id) }}>
              <strong>{s.url}</strong>
            </Link>
            <Button onClick={() => onCheck(s.id)} disabled={running === s.id}>
              {running === s.id ? 'Checking… (can take ~30s)' : 'Check now'}
            </Button>
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