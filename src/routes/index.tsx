import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { addSite, listSites } from '../server/sites'

export const Route = createFileRoute('/')({
  loader: () => listSites(),
  component: Home,
})

function Home() {
  const sites = Route.useLoaderData()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

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

  return (
    <main style={{ maxWidth: 560, margin: '40px auto', padding: 16 }}>
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
      <ul>
        {sites.map((s) => (
          <li key={s.id}>{s.url}</li>
        ))}
      </ul>
    </main>
  )
}
