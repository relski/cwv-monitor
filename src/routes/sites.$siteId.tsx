import { createFileRoute, Link } from '@tanstack/react-router'
import type { checks } from '#/db/schema'
import { getSiteHistory } from '#/server/sites'
import { ms, cls } from '#/lib/format'

type Check = typeof checks.$inferSelect

export const Route = createFileRoute('/sites/$siteId')({
  loader: ({ params }) =>
    getSiteHistory({ data: { siteId: Number(params.siteId) } }),
  component: SitePage,
})

const sourceLabels = {
  url: 'this page',
  origin: 'site-wide',
} as const

function HistoryTable({ history }: { history: Check[] }) {
  const cell = { padding: '6px 10px', textAlign: 'left' } as const;

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={cell}>Checked</th>
          <th style={cell}>Field LCP</th>
          <th style={cell}>Field INP</th>
          <th style={cell}>Field CLS</th>
          <th style={cell}>Lab score</th>
          <th style={cell}>Source</th>
        </tr>
      </thead>
      <tbody>
        {history.map((c) => (
          <tr key={c.id}>
            <td style={cell}>{new Date(c.createdAt).toLocaleString()}</td>
            <td style={cell}>{ms(c.fieldLcp)}</td>
            <td style={cell}>{ms(c.fieldInp)}</td>
            <td style={cell}>{cls(c.fieldCls)}</td>
            <td style={cell}>{c.perfScore ?? '–'}</td>
            <td style={cell}>
              {c.fieldSource
                ? sourceLabels[c.fieldSource as keyof typeof sourceLabels]
                : '–'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SitePage() {
  const { site, history } = Route.useLoaderData()

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
      <Link to="/">← Back</Link>
      <h1>{site.url}</h1>

      {history.length === 0 ? (
        <p>No checks yet.</p>
      ) : (
        <HistoryTable history={history} />
      )}
    </main>
  )
}