import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Server, Database, Clock } from "lucide-react"

// Simulate server-side data fetching
async function getServerData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    serverTime: new Date().toISOString(),
    posts: [
      { id: 1, title: "Understanding Server Components", views: 1234 },
      { id: 2, title: "Client vs Server Rendering", views: 856 },
      { id: 3, title: "Next.js App Router Guide", views: 2341 },
    ],
    stats: {
      totalUsers: 15420,
      activeUsers: 892,
      totalPosts: 3847,
    },
  }
}

export async function ServerComponent() {
  const data = await getServerData()

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          Server Component (Data Fetched on Server)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Server Time: {data.serverTime}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{data.stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{data.stats.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{data.stats.totalPosts.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Recent Posts
          </h4>
          <div className="space-y-2">
            {data.posts.map((post) => (
              <div key={post.id} className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm">{post.title}</span>
                <span className="text-xs text-muted-foreground">{post.views} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          🚀 This component renders on the server and has access to server-side APIs
        </div>
      </CardContent>
    </Card>
  )
}
