export default function FeatureGrid() {
  return (
    <section className="py-20 px-4 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="gradient-text">Comprehensive Legal Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Serving citizens, legal professionals, and imprisoned individuals with accessible, 
            comprehensive legal resources and community support.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Constitution Explorer */}
          <div id="constitution" className="neu-card p-8 interactive" data-testid="feature-constitution">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-book-open text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Constitution Explorer</h3>
                <p className="text-sm text-muted-foreground">Interactive 2010 Constitution</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-search text-primary"></i>
                  <input 
                    type="text" 
                    placeholder="Search Constitution..." 
                    className="bg-transparent text-foreground placeholder-muted-foreground flex-1 outline-none"
                    data-testid="input-constitution-search"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors" data-testid="chapter-bill-of-rights">
                  <div className="text-sm font-medium">Chapter 4: Bill of Rights</div>
                  <div className="text-xs text-muted-foreground">Fundamental rights and freedoms</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors" data-testid="chapter-judiciary">
                  <div className="text-sm font-medium">Chapter 10: Judiciary</div>
                  <div className="text-xs text-muted-foreground">Judicial authority and independence</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors" data-testid="chapter-commissions">
                  <div className="text-sm font-medium">Chapter 15: Commissions</div>
                  <div className="text-xs text-muted-foreground">Independent offices and commissions</div>
                </div>
              </div>
              
              <a 
                href="https://new.kenyalaw.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors block text-center"
                data-testid="button-access-constitution"
              >
                Access Full Constitution
              </a>
            </div>
          </div>

          {/* Document Assembly */}
          <div id="documents" className="neu-card p-8 interactive" data-testid="feature-documents">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-accent text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Document Assembly</h3>
                <p className="text-sm text-muted-foreground">Generate legal documents</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-secondary/50 rounded-lg text-center cursor-pointer hover:bg-secondary transition-colors" data-testid="template-contracts">
                  <i className="fas fa-handshake text-accent mb-2"></i>
                  <div className="text-xs font-medium">Contracts</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg text-center cursor-pointer hover:bg-secondary transition-colors" data-testid="template-property">
                  <i className="fas fa-home text-accent mb-2"></i>
                  <div className="text-xs font-medium">Property</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg text-center cursor-pointer hover:bg-secondary transition-colors" data-testid="template-family">
                  <i className="fas fa-heart text-accent mb-2"></i>
                  <div className="text-xs font-medium">Family Law</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg text-center cursor-pointer hover:bg-secondary transition-colors" data-testid="template-business">
                  <i className="fas fa-briefcase text-accent mb-2"></i>
                  <div className="text-xs font-medium">Business</div>
                </div>
              </div>
              
              <div className="glass-panel p-4">
                <div className="text-sm font-medium mb-2">Step-by-Step Wizard</div>
                <div className="text-xs text-muted-foreground mb-3">Complete forms to generate PDF/DOCX documents</div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full w-1/3"></div>
                </div>
              </div>
              
              <button className="w-full py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors" data-testid="button-start-wizard">
                Start Document Wizard
              </button>
            </div>
          </div>

          {/* Legal Q&A Forum */}
          <div id="forum" className="neu-card p-8 interactive" data-testid="feature-forum">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-comments text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Legal Q&A Forum</h3>
                <p className="text-sm text-muted-foreground">Community & expert advice</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-secondary/50 rounded-lg" data-testid="forum-question-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
                      JK
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">Employment Rights Question</div>
                      <div className="text-xs text-muted-foreground">Can my employer terminate me without notice? Need urgent help...</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span><i className="fas fa-thumbs-up mr-1"></i>12</span>
                        <span><i className="fas fa-reply mr-1"></i>5 replies</span>
                        <span><i className="fas fa-clock mr-1"></i>2h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-secondary/50 rounded-lg" data-testid="forum-question-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-bold">
                      MW
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">Property Inheritance Query</div>
                      <div className="text-xs text-muted-foreground">How do inheritance laws work for widows in Kenya?</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span><i className="fas fa-thumbs-up mr-1"></i>24</span>
                        <span><i className="fas fa-reply mr-1"></i>8 replies</span>
                        <span><i className="fas fa-clock mr-1"></i>5h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" data-testid="button-ask-question">
                <i className="fas fa-plus mr-2"></i>Ask Your Question
              </button>
            </div>
          </div>

          {/* Lawyer Dashboard Preview */}
          <div id="lawyers" className="neu-card p-8 interactive" data-testid="feature-lawyers">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-tie text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Professional Dashboard</h3>
                <p className="text-sm text-muted-foreground">For legal practitioners</p>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
              alt="Professional dashboard interface with case management tools" 
              className="rounded-lg w-full h-32 object-cover mb-4" 
            />

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-secondary/50 rounded" data-testid="lawyer-stat-cases">
                  <div className="text-lg font-bold text-primary">24</div>
                  <div className="text-xs text-muted-foreground">Active Cases</div>
                </div>
                <div className="p-2 bg-secondary/50 rounded" data-testid="lawyer-stat-clients">
                  <div className="text-lg font-bold text-accent">156</div>
                  <div className="text-xs text-muted-foreground">Clients</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-2 bg-primary/20 text-primary rounded text-xs hover:bg-primary/30 transition-colors" data-testid="button-new-case">
                    New Case
                  </button>
                  <button className="p-2 bg-accent/20 text-accent rounded text-xs hover:bg-accent/30 transition-colors" data-testid="button-schedule">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Prisoner Rights Section */}
          <div id="rights" className="neu-card p-8 interactive" data-testid="feature-rights">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-accent text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Prisoner Rights</h3>
                <p className="text-sm text-muted-foreground">Know your legal rights</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="p-3 bg-secondary/50 rounded-lg" data-testid="rights-constitutional">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-book text-accent text-sm"></i>
                    <div className="text-sm font-medium">Constitutional Rights</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Understanding Articles 25-31</div>
                </div>
                
                <div className="p-3 bg-secondary/50 rounded-lg" data-testid="rights-appeal">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-gavel text-accent text-sm"></i>
                    <div className="text-sm font-medium">Appeal Process</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Step-by-step self-representation guide</div>
                </div>
                
                <div className="p-3 bg-secondary/50 rounded-lg" data-testid="rights-legal-aid">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-phone text-accent text-sm"></i>
                    <div className="text-sm font-medium">Legal Aid Access</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Connect with NLAS services</div>
                </div>
              </div>
              
              <a 
                href="https://www.nlas.go.ke/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors block text-center"
                data-testid="button-access-legal-aid"
              >
                Access Legal Aid
              </a>
            </div>
          </div>

          {/* National Legal Aid Service Integration */}
          <div className="neu-card p-8 interactive" data-testid="feature-nlas">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-hands-helping text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">NLAS Integration</h3>
                <p className="text-sm text-muted-foreground">National Legal Aid Service</p>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
              alt="Government office interface showing legal aid services" 
              className="rounded-lg w-full h-32 object-cover mb-4" 
            />

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Connect directly with government legal aid services under the Legal Aid Act 2016.
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-check text-accent"></i>
                  <span>Financial means testing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-check text-accent"></i>
                  <span>Court representation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-check text-accent"></i>
                  <span>Community legal clinics</span>
                </div>
              </div>
              
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" data-testid="button-apply-legal-aid">
                Apply for Legal Aid
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
