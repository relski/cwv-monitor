import { createFileRoute, Link } from '@tanstack/react-router'
import type { checks } from '#/db/schema'
import { getSiteHistory } from '#/server/sites'
import { ms, cls } from '#/lib/format'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={cell}>Checked</TableHead>
          <TableHead style={cell}>Field LCP</TableHead>
          <TableHead style={cell}>Field INP</TableHead>
          <TableHead style={cell}>Field CLS</TableHead>
          <TableHead style={cell}>Lab score</TableHead>
          <TableHead style={cell}>Source</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((c) => (
          <TableRow key={c.id}>
            <TableCell style={cell}>{new Date(c.createdAt).toLocaleString()}</TableCell>
            <TableCell style={cell}>{ms(c.fieldLcp)}</TableCell>
            <TableCell style={cell}>{ms(c.fieldInp)}</TableCell>
            <TableCell style={cell}>{cls(c.fieldCls)}</TableCell>
            <TableCell style={cell}>{c.perfScore ?? '–'}</TableCell>
            <TableCell style={cell}>
              {c.fieldSource
                ? sourceLabels[c.fieldSource as keyof typeof sourceLabels]
                : '–'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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