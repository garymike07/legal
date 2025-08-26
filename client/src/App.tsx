import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";

const NotFound = lazy(() => import("@/pages/not-found"));
const Landing = lazy(() => import("@/pages/landing"));
const Home = lazy(() => import("@/pages/home"));
const Constitution = lazy(() => import("@/pages/constitution"));
const Documents = lazy(() => import("@/pages/documents"));
const Forum = lazy(() => import("@/pages/forum"));
const LawyerDashboard = lazy(() => import("@/pages/lawyer-dashboard"));
const PrisonerRights = lazy(() => import("@/pages/prisoner-rights"));

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/constitution" component={Constitution} />
            <Route path="/documents" component={Documents} />
            <Route path="/forum" component={Forum} />
            <Route path="/lawyer-dashboard" component={LawyerDashboard} />
            <Route path="/prisoner-rights" component={PrisonerRights} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
