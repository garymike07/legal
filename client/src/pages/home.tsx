import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="neu-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">Welcome to</span><br />
              <span className="text-foreground">Kenya Legal Aid</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your comprehensive platform for accessing Kenya's legal resources, constitutional knowledge, 
              and community support. Choose your path below to get started.
            </p>
          </section>

          {/* Quick Access Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <a 
              href="/constitution" 
              className="neu-card p-8 interactive text-center block"
              data-testid="card-constitution"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-book-open text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore Constitution</h3>
              <p className="text-muted-foreground mb-4">
                Interactive Kenya Constitution 2010 with search and analysis tools
              </p>
              <div className="btn-primary">
                Access Now
              </div>
            </a>

            <a 
              href="/forum" 
              className="neu-card p-8 interactive text-center block"
              data-testid="card-forum"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-comments text-accent text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Legal Q&A Forum</h3>
              <p className="text-muted-foreground mb-4">
                Get answers from legal experts and community members
              </p>
              <div className="btn-accent">
                Ask Question
              </div>
            </a>

            <a 
              href="/documents" 
              className="neu-card p-8 interactive text-center block"
              data-testid="card-documents"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-file-alt text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Documents</h3>
              <p className="text-muted-foreground mb-4">
                Create legal documents using our step-by-step wizard
              </p>
              <div className="btn-primary">
                Start Wizard
              </div>
            </a>
          </section>

          {/* Role-Based Quick Actions */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="neu-card p-8">
              <h2 className="text-2xl font-bold mb-6">For Legal Professionals</h2>
              <div className="space-y-4">
                <a 
                  href="/lawyer-dashboard" 
                  className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  data-testid="link-lawyer-dashboard"
                >
                  <i className="fas fa-user-tie text-primary text-xl"></i>
                  <div>
                    <div className="font-medium">Lawyer Dashboard</div>
                    <div className="text-sm text-muted-foreground">Manage cases, clients, and legal practice</div>
                  </div>
                </a>
                
                <a 
                  href="https://new.kenyalaw.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  data-testid="link-legal-research"
                >
                  <i className="fas fa-search text-accent text-xl"></i>
                  <div>
                    <div className="font-medium">Legal Research</div>
                    <div className="text-sm text-muted-foreground">Access Kenya Law database for case law</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="neu-card p-8">
              <h2 className="text-2xl font-bold mb-6">For Citizens & Prisoners</h2>
              <div className="space-y-4">
                <a 
                  href="/prisoner-rights" 
                  className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  data-testid="link-prisoner-rights"
                >
                  <i className="fas fa-shield-alt text-accent text-xl"></i>
                  <div>
                    <div className="font-medium">Know Your Rights</div>
                    <div className="text-sm text-muted-foreground">Constitutional rights and legal protections</div>
                  </div>
                </a>
                
                <a 
                  href="https://www.nlas.go.ke/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  data-testid="link-legal-aid"
                >
                  <i className="fas fa-hands-helping text-primary text-xl"></i>
                  <div>
                    <div className="font-medium">Legal Aid Services</div>
                    <div className="text-sm text-muted-foreground">Connect with National Legal Aid Service</div>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Recent Activity Dashboard */}
          <section className="neu-card p-8">
            <h2 className="text-2xl font-bold mb-6">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">275K+</div>
                <div className="text-sm text-muted-foreground">Legal Cases in Database</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Laws Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Users Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
