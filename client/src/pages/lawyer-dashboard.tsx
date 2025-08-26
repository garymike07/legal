import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LawyerCaseManagement from "@/components/lawyer-case-management";
import { CASE_STATUSES } from "@/lib/constants";

export default function LawyerDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect to login if not authenticated
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

  // Check if user is a lawyer
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'lawyer') {
      toast({
        title: "Access Denied",
        description: "This dashboard is only available to registered lawyers.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: cases, isLoading: casesLoading } = useQuery<any[]>({
    queryKey: ["/api/cases"],
    enabled: isAuthenticated && user?.role === 'lawyer',
  });

  const { data: recentActivity } = useQuery<any[]>({
    queryKey: ["/api/cases", "", "5", "0"],
    enabled: isAuthenticated && user?.role === 'lawyer',
  });

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

  if (!isAuthenticated || user?.role !== 'lawyer') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="neu-card p-8 text-center">
          <i className="fas fa-exclamation-triangle text-destructive text-4xl mb-4"></i>
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">This dashboard is only available to registered lawyers.</p>
        </div>
      </div>
    );
  }

  const activeCases = cases?.filter((c: any) => c.status === 'active') || [];
  const pendingCases = cases?.filter((c: any) => c.status === 'pending') || [];
  const closedCases = cases?.filter((c: any) => c.status === 'closed') || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Dashboard Header */}
      <header className="bg-secondary/30 border-b border-border/50 py-8 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Legal Practice Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user?.firstName || user?.email} • Professional Case Management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Cases</div>
                <div className="text-2xl font-bold text-primary">{cases?.length || 0}</div>
              </div>
              {user?.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
              { id: 'cases', label: 'Case Management', icon: 'fas fa-folder-open' },
              { id: 'clients', label: 'Clients', icon: 'fas fa-users' },
              { id: 'documents', label: 'Documents', icon: 'fas fa-file-alt' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="py-8 px-4 lg:px-8">
        <div className="container mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="neu-card p-6 text-center" data-testid="stat-active-cases">
                  <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-folder-open text-primary text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-primary">{activeCases.length}</div>
                  <div className="text-sm text-muted-foreground">Active Cases</div>
                </div>
                
                <div className="neu-card p-6 text-center" data-testid="stat-pending-cases">
                  <div className="w-12 h-12 bg-accent/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-clock text-accent text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-accent">{pendingCases.length}</div>
                  <div className="text-sm text-muted-foreground">Pending Cases</div>
                </div>
                
                <div className="neu-card p-6 text-center" data-testid="stat-closed-cases">
                  <div className="w-12 h-12 bg-muted/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-check-circle text-muted-foreground text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">{closedCases.length}</div>
                  <div className="text-sm text-muted-foreground">Closed Cases</div>
                </div>
                
                <div className="neu-card p-6 text-center" data-testid="stat-total-cases">
                  <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-chart-bar text-primary text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-primary">{cases?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Cases</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="neu-card p-6">
                  <h2 className="text-xl font-bold mb-6">Recent Cases</h2>
                  {recentActivity && recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.slice(0, 5).map((case_: any) => (
                        <div 
                          key={case_.id} 
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                          data-testid={`recent-case-${case_.id}`}
                        >
                          <div>
                            <div className="font-medium">{case_.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Client: {case_.clientName}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            case_.status === 'active' ? 'bg-primary/20 text-primary' :
                            case_.status === 'pending' ? 'bg-accent/20 text-accent' :
                            'bg-muted/20 text-muted-foreground'
                          }`}>
                            {case_.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <i className="fas fa-folder-open text-muted-foreground text-3xl mb-3"></i>
                      <p className="text-muted-foreground">No cases yet. Create your first case!</p>
                    </div>
                  )}
                </div>

                <div className="neu-card p-6">
                  <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('cases')}
                      className="w-full p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-left"
                      data-testid="quick-action-new-case"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-plus text-primary"></i>
                        <div>
                          <div className="font-medium">Create New Case</div>
                          <div className="text-sm text-muted-foreground">Start a new client case</div>
                        </div>
                      </div>
                    </button>
                    
                    <a
                      href="https://new.kenyalaw.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full p-4 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors"
                      data-testid="quick-action-research"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-search text-accent"></i>
                        <div>
                          <div className="font-medium">Legal Research</div>
                          <div className="text-sm text-muted-foreground">Access Kenya Law database</div>
                        </div>
                      </div>
                    </a>
                    
                    <button 
                      onClick={() => setActiveTab('documents')}
                      className="w-full p-4 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors text-left"
                      data-testid="quick-action-documents"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-file-alt text-muted-foreground"></i>
                        <div>
                          <div className="font-medium">Document Library</div>
                          <div className="text-sm text-muted-foreground">Manage case documents</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Case Management Tab */}
          {activeTab === 'cases' && (
            <LawyerCaseManagement />
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Client Management</h2>
                <button className="btn-primary" data-testid="button-add-client">
                  <i className="fas fa-plus mr-2"></i>
                  Add Client
                </button>
              </div>
              
              <div className="neu-card p-6 text-center">
                <i className="fas fa-users text-muted-foreground text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">Client Management System</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive client information is extracted from your cases. 
                  Client details are automatically organized from case data.
                </p>
                <button 
                  onClick={() => setActiveTab('cases')}
                  className="btn-secondary"
                  data-testid="button-view-cases"
                >
                  View Cases
                </button>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Document Library</h2>
                <a href="/documents" className="btn-primary" data-testid="button-generate-document">
                  <i className="fas fa-plus mr-2"></i>
                  Generate Document
                </a>
              </div>
              
              <div className="neu-card p-6 text-center">
                <i className="fas fa-file-alt text-muted-foreground text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">Document Generation</h3>
                <p className="text-muted-foreground mb-4">
                  Create professional legal documents using our comprehensive template library.
                  All documents are generated in compliance with Kenyan legal standards.
                </p>
                <a href="/documents" className="btn-secondary" data-testid="button-browse-templates">
                  Browse Templates
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
