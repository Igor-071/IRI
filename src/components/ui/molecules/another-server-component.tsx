import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Shield, Zap } from "lucide-react"

// Another server component to show multiple server components
async function getSecurityData() {
  await new Promise((resolve) => setTimeout(resolve, 50))

  return {
    securityLevel: "High",
    lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    threats: 0,
    uptime: "99.9%",
  }
}

export async function AnotherServerComponent() {
  const securityData = await getSecurityData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Server Component
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-sm">Security Level: {securityData.securityLevel}</span>
          </div>
          <div className="text-sm">Uptime: {securityData.uptime}</div>
          <div className="text-sm">Threats Detected: {securityData.threats}</div>
          <div className="text-sm">Last Scan: {new Date(securityData.lastScan).toLocaleTimeString()}</div>
        </div>

        <div className="text-sm text-muted-foreground">🔒 This is another server component with different data</div>
      </CardContent>
    </Card>
  )
}
