import { createFileRoute } from '@tanstack/react-router'
import { getSiteHistory } from "#/server/sites"

export const Route = createFileRoute('/sites/$siteId')({
   loader: ({ params }) => {
      return getSiteHistory({ data: { siteId: Number(params.siteId) } })
   },
   component: SitePage,
})

function SitePage() {
   const { site, history } = Route.useLoaderData();

   return (
      <main style={{ maxWidth: 640, margin: '40px auto', padding: 16 }}>
         <h1>{site.url}</h1>
         <p>{history.length} checks</p>
      </main>
   )
}