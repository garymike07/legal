import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ConstitutionExplorer from "@/components/constitution-explorer";
import { CONSTITUTION_CHAPTERS, EXTERNAL_LINKS } from "@/lib/constants";

export default function Constitution() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedChapter, setSelectedChapter] = useState(CONSTITUTION_CHAPTERS[0]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/constitution/search", searchQuery],
    enabled: searchQuery.length > 2,
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          {/* Header Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">Constitution of Kenya</span><br />
              <span className="text-foreground">2010</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Interactive exploration of Kenya's Constitution with advanced search, 
              chapter navigation, and AI-powered legal summaries.
            </p>
            
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={EXTERNAL_LINKS.constitution}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                data-testid="button-download-pdf"
              >
                <i className="fas fa-download mr-2"></i>
                Download PDF
              </a>
              <a 
                href={EXTERNAL_LINKS.kenyaLaw}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                data-testid="button-kenya-law"
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                Kenya Law Database
              </a>
            </div>
          </section>

          {/* Search Section */}
          <section className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="glass-panel p-6">
                <div className="flex items-center gap-4 mb-4">
                  <i className="fas fa-search text-primary text-xl"></i>
                  <input
                    type="text"
                    placeholder="Search Constitution articles, chapters, or content..."
                    className="input-glass flex-1 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-constitution-search"
                  />
                </div>
                
                {searchLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                )}
                
                {searchResults && searchResults.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-lg font-semibold">Search Results</h3>
                    {searchResults.map((result: any) => (
                      <div 
                        key={result.id} 
                        className="neu-card p-4 interactive"
                        data-testid={`search-result-${result.id}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-primary">{result.title}</h4>
                          <span className="text-xs text-muted-foreground">{result.chapter}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{result.content}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            Article {result.section}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Relevance: {Math.round(result.relevance * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Constitution Explorer */}
          <ConstitutionExplorer 
            selectedChapter={selectedChapter}
            onChapterSelect={setSelectedChapter}
          />

          {/* External Resources */}
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Related Legal Resources</h2>
              <p className="text-muted-foreground">
                Access additional legal databases and official government resources
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href={EXTERNAL_LINKS.legislation}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-card p-6 text-center interactive"
                data-testid="resource-legislation"
              >
                <i className="fas fa-book text-primary text-2xl mb-4"></i>
                <h3 className="font-semibold mb-2">Laws of Kenya</h3>
                <p className="text-sm text-muted-foreground">500+ chapters of current legislation</p>
              </a>
              
              <a 
                href={EXTERNAL_LINKS.judgments}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-card p-6 text-center interactive"
                data-testid="resource-judgments"
              >
                <i className="fas fa-gavel text-accent text-2xl mb-4"></i>
                <h3 className="font-semibold mb-2">Case Law</h3>
                <p className="text-sm text-muted-foreground">Searchable judicial decisions</p>
              </a>
              
              <a 
                href={EXTERNAL_LINKS.nlas}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-card p-6 text-center interactive"
                data-testid="resource-nlas"
              >
                <i className="fas fa-hands-helping text-primary text-2xl mb-4"></i>
                <h3 className="font-semibold mb-2">Legal Aid Services</h3>
                <p className="text-sm text-muted-foreground">National Legal Aid Service</p>
              </a>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
