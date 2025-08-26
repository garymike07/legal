import { EXTERNAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border py-16 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 neu-card flex items-center justify-center">
                <i className="fas fa-scales-balanced text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text">Kenya Legal Aid</h3>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Democratizing access to legal resources and constitutional knowledge for all Kenyans.
            </p>
            <div className="text-xs text-muted-foreground">
              © 2025 Kenya Legal Aid Platform. Supporting access to justice under the Constitution of Kenya 2010.
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Legal Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="/constitution" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-constitution"
                >
                  Constitution 2010
                </a>
              </li>
              <li>
                <a 
                  href={EXTERNAL_LINKS.kenyaLaw} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-testid="footer-kenya-law"
                >
                  Kenya Law Database
                </a>
              </li>
              <li>
                <a 
                  href="/documents" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-documents"
                >
                  Legal Documents
                </a>
              </li>
              <li>
                <a 
                  href={EXTERNAL_LINKS.nlas} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-testid="footer-legal-aid"
                >
                  Legal Aid Services
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="/forum" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-forum"
                >
                  Q&A Forum
                </a>
              </li>
              <li>
                <a 
                  href="/lawyer-dashboard" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-lawyers"
                >
                  Find Lawyers
                </a>
              </li>
              <li>
                <a 
                  href="/prisoner-rights" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-rights"
                >
                  Know Your Rights
                </a>
              </li>
              <li>
                <a 
                  href="/constitution" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-education"
                >
                  Legal Education
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact & Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="/forum" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-help"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href={EXTERNAL_LINKS.nlas} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-testid="footer-emergency"
                >
                  Emergency Legal Aid
                </a>
              </li>
              <li>
                <a 
                  href="/forum" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-report"
                >
                  Report Issues
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-privacy"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            Built with constitutional principles of access to justice and equality before the law.
          </div>
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="social-twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="social-facebook"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="social-linkedin"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
