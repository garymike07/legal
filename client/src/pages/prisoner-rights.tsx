import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PrisonerResources from "@/components/prisoner-resources";
import { EXTERNAL_LINKS } from "@/lib/constants";

export default function PrisonerRights() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const rightsCategories = [
    {
      id: "constitutional-rights",
      title: "Constitutional Rights",
      description: "Fundamental rights guaranteed by the Constitution of Kenya 2010",
      icon: "fas fa-book",
      articles: ["Article 25: Right to life", "Article 28: Human dignity", "Article 29: Freedom and security", "Article 50: Fair hearing"]
    },
    {
      id: "treatment-conditions",
      title: "Treatment & Conditions",
      description: "Standards for humane treatment and living conditions",
      icon: "fas fa-shield-alt",
      articles: ["Article 25: Right to life", "Article 28: Human dignity", "Article 25(c): Torture prohibition"]
    },
    {
      id: "legal-representation",
      title: "Legal Representation",
      description: "Right to legal aid and representation in court",
      icon: "fas fa-balance-scale",
      articles: ["Article 50(2)(g): Right to advocate", "Article 50(2)(h): State-provided advocate"]
    },
    {
      id: "family-contact",
      title: "Family & Communication",
      description: "Rights to family contact and communication",
      icon: "fas fa-phone",
      articles: ["Article 32: Freedom of conscience", "Article 35: Access to information"]
    },
    {
      id: "healthcare",
      title: "Healthcare Access",
      description: "Right to healthcare and medical treatment",
      icon: "fas fa-heartbeat",
      articles: ["Article 43: Economic and social rights", "Article 28: Human dignity"]
    },
    {
      id: "appeal-process",
      title: "Appeals & Review",
      description: "Right to appeal and judicial review",
      icon: "fas fa-gavel",
      articles: ["Article 50: Fair hearing", "Article 165: High Court jurisdiction"]
    }
  ];

  const selfRepSteps = [
    {
      step: 1,
      title: "Understand Your Case",
      description: "Review your charges, conviction, and sentence details",
      actions: ["Obtain case file copies", "Review judgment and sentencing", "Identify potential grounds for appeal"]
    },
    {
      step: 2,
      title: "Know Appeal Deadlines",
      description: "Understand time limits for filing appeals",
      actions: ["14 days for High Court appeals", "30 days for Court of Appeal", "File notice of appeal promptly"]
    },
    {
      step: 3,
      title: "Prepare Your Appeal",
      description: "Gather evidence and legal grounds",
      actions: ["Identify legal errors", "Collect supporting documents", "Prepare written submissions"]
    },
    {
      step: 4,
      title: "File Your Appeal",
      description: "Submit required documents to court",
      actions: ["Complete appeal forms", "Pay required fees (or request waiver)", "Serve copies to prosecution"]
    },
    {
      step: 5,
      title: "Seek Legal Aid",
      description: "Apply for free legal representation",
      actions: ["Contact NLAS", "Complete financial means test", "Provide supporting documentation"]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          {/* Header Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">Know Your Rights</span><br />
              <span className="text-foreground">Legal Protection & Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Understanding your constitutional rights, legal protections, and available resources 
              under Kenyan law. Educational content for prisoners, families, and advocates.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={EXTERNAL_LINKS.constitution}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                data-testid="button-constitution"
              >
                <i className="fas fa-book mr-2"></i>
                Read Constitution
              </a>
              <a 
                href={EXTERNAL_LINKS.nlas}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
                data-testid="button-legal-aid"
              >
                <i className="fas fa-hands-helping mr-2"></i>
                Get Legal Aid
              </a>
            </div>
          </section>

          {/* Rights Categories Grid */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Your Constitutional Rights</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Constitution of Kenya 2010 guarantees fundamental rights for all citizens, 
                including those in custody. These rights cannot be taken away.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rightsCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="neu-card p-8 interactive"
                  data-testid={`rights-category-${category.id}`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <i className={`${category.icon} text-accent text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Constitutional Articles:</h4>
                    {category.articles.map((article, index) => (
                      <div 
                        key={index} 
                        className="text-xs bg-secondary/30 p-2 rounded"
                        data-testid={`article-${category.id}-${index}`}
                      >
                        {article}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Self-Representation Guide */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Self-Representation Guide</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Step-by-step guidance for representing yourself in appeals and legal proceedings.
                While legal representation is recommended, this guide helps you understand the process.
              </p>
            </div>
            
            <div className="glass-panel p-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                {selfRepSteps.map((step) => (
                  <div 
                    key={step.step} 
                    className="neu-card p-6"
                    data-testid={`self-rep-step-${step.step}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Key Actions:</h4>
                          <ul className="space-y-1">
                            {step.actions.map((action, index) => (
                              <li 
                                key={index} 
                                className="text-sm flex items-center gap-2"
                                data-testid={`action-${step.step}-${index}`}
                              >
                                <i className="fas fa-check text-accent text-xs"></i>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Emergency Contacts & Resources */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Emergency Contacts & Resources</h2>
              <p className="text-muted-foreground">
                Important contacts for immediate legal assistance and rights violations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="neu-card p-6 text-center" data-testid="contact-nlas">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-hands-helping text-primary text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">National Legal Aid Service</h3>
                <p className="text-sm text-muted-foreground mb-4">Free legal aid for qualifying individuals</p>
                <a 
                  href={EXTERNAL_LINKS.nlas}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                  data-testid="button-contact-nlas"
                >
                  Contact NLAS
                </a>
              </div>
              
              <div className="neu-card p-6 text-center" data-testid="contact-knchr">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-shield-alt text-accent text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Kenya National Commission on Human Rights</h3>
                <p className="text-sm text-muted-foreground mb-4">Report human rights violations</p>
                <button className="btn-accent text-sm" data-testid="button-contact-knchr">
                  Report Violation
                </button>
              </div>
              
              <div className="neu-card p-6 text-center" data-testid="contact-judiciary">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-gavel text-primary text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Judiciary Help Center</h3>
                <p className="text-sm text-muted-foreground mb-4">Court procedures and filing assistance</p>
                <button className="btn-primary text-sm" data-testid="button-contact-judiciary">
                  Get Help
                </button>
              </div>
            </div>
          </section>

          {/* Prisoner Resources Component */}
          <PrisonerResources />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
