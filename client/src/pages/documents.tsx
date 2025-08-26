import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import DocumentWizard from "@/components/document-wizard";
import { LEGAL_CATEGORIES } from "@/lib/constants";

export default function Documents() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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

  const { data: templates, isLoading: templatesLoading } = useQuery<any[]>({
    queryKey: ["/api/document-templates", selectedCategory],
  });

  const { data: userDocuments, isLoading: documentsLoading } = useQuery<any[]>({
    queryKey: ["/api/generated-documents"],
    enabled: isAuthenticated,
  });

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setShowWizard(true);
  };

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

  if (showWizard && selectedTemplate) {
    return (
      <DocumentWizard 
        template={selectedTemplate}
        onComplete={() => {
          setShowWizard(false);
          setSelectedTemplate(null);
        }}
        onCancel={() => {
          setShowWizard(false);
          setSelectedTemplate(null);
        }}
      />
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
              <span className="gradient-text">Document Assembly</span><br />
              <span className="text-foreground">Legal Document Generator</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Generate professional legal documents using our step-by-step wizard. 
              Templates comply with Kenyan law and generate both PDF and DOCX formats.
            </p>
          </section>

          {/* Category Filter */}
          <section className="mb-12">
            <div className="glass-panel p-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Document Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`p-3 rounded-lg transition-colors ${
                    selectedCategory === "" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                  data-testid="category-all"
                >
                  All Categories
                </button>
                {LEGAL_CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`p-3 rounded-lg transition-colors text-sm ${
                      selectedCategory === category.value 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary/50 hover:bg-secondary"
                    }`}
                    data-testid={`category-${category.value}`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Document Templates */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Available Templates</h2>
            
            {templatesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading templates...</p>
              </div>
            ) : templates && templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template: any) => (
                  <div 
                    key={template.id} 
                    className="neu-card p-6 interactive"
                    data-testid={`template-${template.id}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-alt text-accent text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {LEGAL_CATEGORIES.find(c => c.value === template.category)?.label}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full btn-accent"
                      data-testid={`button-select-${template.id}`}
                    >
                      <i className="fas fa-magic mr-2"></i>
                      Start Document
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-file-alt text-muted-foreground text-4xl mb-4"></i>
                <p className="text-muted-foreground">No templates available for this category.</p>
              </div>
            )}
          </section>

          {/* User's Generated Documents */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-center">Your Documents</h2>
            
            {documentsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your documents...</p>
              </div>
            ) : userDocuments && userDocuments.length > 0 ? (
              <div className="space-y-4">
                {userDocuments.map((doc: any) => (
                  <div 
                    key={doc.id} 
                    className="neu-card p-6"
                    data-testid={`document-${doc.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <i className="fas fa-file text-primary"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Template: {doc.template?.name} • Created: {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {doc.pdfUrl && (
                          <a 
                            href={doc.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm"
                            data-testid={`download-pdf-${doc.id}`}
                          >
                            <i className="fas fa-file-pdf mr-1"></i>
                            PDF
                          </a>
                        )}
                        {doc.docxUrl && (
                          <a 
                            href={doc.docxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary text-sm"
                            data-testid={`download-docx-${doc.id}`}
                          >
                            <i className="fas fa-file-word mr-1"></i>
                            DOCX
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-folder-open text-muted-foreground text-4xl mb-4"></i>
                <p className="text-muted-foreground mb-4">You haven't generated any documents yet.</p>
                <button 
                  onClick={() => setSelectedCategory("")}
                  className="btn-primary"
                  data-testid="button-start-first-document"
                >
                  Create Your First Document
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
