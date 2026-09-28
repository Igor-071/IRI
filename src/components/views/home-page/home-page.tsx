import { FunctionComponent } from 'react';

import { ClientComponent } from '@/components/ui/molecules/client-component';
import { ServerComponent } from '@/components/ui/molecules/server-component';
import { AnotherServerComponent } from '@/components/ui/molecules/another-server-component';
import { FormsShowcase } from '@/components/ui/organisms/forms-showcase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/atoms/card';
import { Info } from 'lucide-react';

interface Props {
  name?: string;
}

const HomePage: FunctionComponent<Props> = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Next.js Server vs Client Rendering Showcase</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              How This Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              • <strong>Global State Provider</strong> (Client Component) wraps the entire app and
              manages theme/user state
            </p>
            <p>
              • <strong>Server Components</strong> are passed as children to the provider, not
              imported directly
            </p>
            <p>
              • Server components fetch data on the server and render before being sent to the
              client
            </p>
            <p>• Client components can use hooks, handle events, and access the global state</p>
            <p>
              • The composition pattern allows server components to benefit from client-side state
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Component - Interactive */}
      <ClientComponent />

      {/* Server Components - Passed as children to the provider */}
      <ServerComponent />

      <AnotherServerComponent />

      {/* Forms Showcase Component */}
      <FormsShowcase />
    </div>
  );
};

export default HomePage;
