import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 lg:px-8 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="gradient-text">Legal Justice</span><br />
                <span className="text-foreground">For All Kenyans</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Access Kenya's Constitution 2010, legal documents, expert advice, and community support. 
                Empowering citizens, lawyers, and imprisoned individuals with comprehensive legal resources.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#constitution"
                className="neu-card px-8 py-4 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all interactive text-center"
                data-testid="button-explore-constitution"
              >
                <i className="fas fa-book-open mr-2"></i>
                Explore Constitution
              </a>
              <a
                href="#forum"
                className="neu-card px-8 py-4 bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-all interactive text-center"
                data-testid="button-ask-question"
              >
                <i className="fas fa-question-circle mr-2"></i>
                Ask Legal Question
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="stat-cases">275K+</div>
                <div className="text-sm text-muted-foreground">Legal Cases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent" data-testid="stat-laws">500+</div>
                <div className="text-sm text-muted-foreground">Laws Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="stat-users">10K+</div>
                <div className="text-sm text-muted-foreground">Users Helped</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="neu-card p-8 floating">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Professional legal consultation with digital interface" 
                className="rounded-xl w-full h-auto" 
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 glass-panel p-4 w-24 h-24 flex items-center justify-center">
              <i className="fas fa-gavel text-primary text-2xl"></i>
            </div>
            <div className="absolute -bottom-4 -left-4 glass-panel p-4 w-24 h-24 flex items-center justify-center">
              <i className="fas fa-balance-scale text-accent text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
