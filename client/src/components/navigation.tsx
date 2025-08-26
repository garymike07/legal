import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-border/50">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 neu-card flex items-center justify-center">
              <i className="fas fa-scales-balanced text-primary text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Kenya Legal Aid</h1>
              <p className="text-xs text-muted-foreground">Constitutional Resources</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <a 
                  href="/constitution" 
                  className="text-foreground hover:text-primary transition-colors"
                  data-testid="nav-constitution"
                >
                  Constitution
                </a>
                <a 
                  href="/documents" 
                  className="text-foreground hover:text-primary transition-colors"
                  data-testid="nav-documents"
                >
                  Documents
                </a>
                <a 
                  href="/forum" 
                  className="text-foreground hover:text-primary transition-colors"
                  data-testid="nav-forum"
                >
                  Q&A Forum
                </a>
                {user?.role === 'lawyer' && (
                  <a 
                    href="/lawyer-dashboard" 
                    className="text-foreground hover:text-primary transition-colors"
                    data-testid="nav-lawyers"
                  >
                    Dashboard
                  </a>
                )}
                <a 
                  href="/prisoner-rights" 
                  className="text-foreground hover:text-primary transition-colors"
                  data-testid="nav-rights"
                >
                  Rights
                </a>
              </>
            ) : (
              <>
                <a href="#constitution" className="text-foreground hover:text-primary transition-colors">Constitution</a>
                <a href="#documents" className="text-foreground hover:text-primary transition-colors">Documents</a>
                <a href="#forum" className="text-foreground hover:text-primary transition-colors">Q&A Forum</a>
                <a href="#lawyers" className="text-foreground hover:text-primary transition-colors">Lawyers</a>
                <a href="#rights" className="text-foreground hover:text-primary transition-colors">Rights</a>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm font-medium hidden sm:block">
                  {user?.firstName || user?.email}
                </span>
                <a 
                  href="/api/logout"
                  className="neu-card px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors"
                  data-testid="button-logout"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a
                href="/api/login"
                className="neu-card px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                data-testid="button-login"
              >
                Login
              </a>
            )}
            
            <button 
              className="md:hidden neu-card p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <a 
                    href="/constitution" 
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Constitution
                  </a>
                  <a 
                    href="/documents" 
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Documents
                  </a>
                  <a 
                    href="/forum" 
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Q&A Forum
                  </a>
                  {user?.role === 'lawyer' && (
                    <a 
                      href="/lawyer-dashboard" 
                      className="text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                  )}
                  <a 
                    href="/prisoner-rights" 
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Rights
                  </a>
                </>
              ) : (
                <>
                  <a href="#constitution" className="text-foreground hover:text-primary transition-colors py-2">Constitution</a>
                  <a href="#documents" className="text-foreground hover:text-primary transition-colors py-2">Documents</a>
                  <a href="#forum" className="text-foreground hover:text-primary transition-colors py-2">Q&A Forum</a>
                  <a href="#lawyers" className="text-foreground hover:text-primary transition-colors py-2">Lawyers</a>
                  <a href="#rights" className="text-foreground hover:text-primary transition-colors py-2">Rights</a>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
