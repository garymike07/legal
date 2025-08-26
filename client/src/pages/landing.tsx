import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeatureGrid from "@/components/feature-grid";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <FeatureGrid />
        
        {/* Legal Resources Section */}
        <section className="py-20 px-4 lg:px-8 bg-secondary/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="gradient-text">Official Legal Resources</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Direct access to Kenya's official legal databases and government resources
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Kenya Law Database */}
              <div className="neu-card p-6 text-center interactive" data-testid="resource-kenya-law">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-database text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Kenya Law Database</h3>
                <p className="text-sm text-muted-foreground mb-4">275,000+ judicial decisions since 1930</p>
                <a 
                  href="https://new.kenyalaw.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  data-testid="link-kenya-law"
                >
                  Access Database
                </a>
              </div>

              {/* Constitution 2010 */}
              <div className="neu-card p-6 text-center interactive" data-testid="resource-constitution">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-scroll text-accent text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Constitution 2010</h3>
                <p className="text-sm text-muted-foreground mb-4">Official constitutional text</p>
                <a 
                  href="http://parliament.go.ke/sites/default/files/2023-03/The_Constitution_of_Kenya_2010.pdf" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                  data-testid="link-constitution"
                >
                  Download PDF
                </a>
              </div>

              {/* Laws of Kenya */}
              <div className="neu-card p-6 text-center interactive" data-testid="resource-laws">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-book text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Laws of Kenya</h3>
                <p className="text-sm text-muted-foreground mb-4">500+ chapters of current laws</p>
                <a 
                  href="https://new.kenyalaw.org/legislation/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  data-testid="link-laws"
                >
                  Browse Laws
                </a>
              </div>

              {/* Case Law */}
              <div className="neu-card p-6 text-center interactive" data-testid="resource-cases">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-balance-scale text-accent text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Case Law</h3>
                <p className="text-sm text-muted-foreground mb-4">Searchable judicial decisions</p>
                <a 
                  href="https://new.kenyalaw.org/judgments/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                  data-testid="link-cases"
                >
                  Search Cases
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="py-20 px-4 lg:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  <span className="gradient-text">Mobile Legal Access</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Access legal resources anywhere with our Progressive Web App. 
                  Offline constitution access, document generation, and legal assistance.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-mobile-alt text-primary"></i>
                    <span>Offline Constitution access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-download text-primary"></i>
                    <span>Download legal documents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-search text-primary"></i>
                    <span>Advanced legal search</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-comments text-primary"></i>
                    <span>Community Q&A forums</span>
                  </div>
                </div>
                
                <button 
                  className="neu-card px-8 py-4 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all interactive"
                  data-testid="button-install-pwa"
                >
                  <i className="fas fa-download mr-2"></i>
                  Install PWA
                </button>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Mobile legal app interface showing constitution access and legal resources" 
                  className="rounded-2xl neu-card p-4 w-full h-auto" 
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Floating Action Button for Quick Help */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="neu-card w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform interactive floating"
          data-testid="button-quick-help"
        >
          <i className="fas fa-question-circle text-xl"></i>
        </button>
      </div>
    </div>
  );
}
