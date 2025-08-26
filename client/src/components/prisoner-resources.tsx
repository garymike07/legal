import { useState } from "react";
import { EXTERNAL_LINKS } from "@/lib/constants";

export default function PrisonerResources() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const legalProcedures = [
    {
      id: "appeal-filing",
      title: "Filing an Appeal",
      description: "Step-by-step guide to filing an appeal against conviction or sentence",
      steps: [
        "Obtain certified copies of judgment and proceedings from the trial court",
        "Prepare Notice of Appeal within 14 days of conviction/sentence",
        "File the Notice of Appeal at the appropriate appellate court",
        "Pay prescribed court fees or apply for fee waiver",
        "Serve copies of the Notice of Appeal to the prosecution",
        "Prepare and file detailed grounds of appeal within prescribed time",
        "Apply for certified copies of court records for the appeal"
      ],
      timeLimit: "14 days from conviction/sentence for High Court appeals, 30 days for Court of Appeal",
      icon: "fas fa-gavel"
    },
    {
      id: "bail-application",
      title: "Applying for Bail",
      description: "How to apply for bail pending trial or appeal",
      steps: [
        "Prepare bail application with supporting affidavit",
        "Include details of surety/security offered",
        "File application at the court handling your case",
        "Serve copies to the prosecution",
        "Attend bail hearing and present your case",
        "If granted, comply with all bail conditions"
      ],
      timeLimit: "Can be applied for at any time during proceedings",
      icon: "fas fa-unlock"
    },
    {
      id: "legal-aid-application",
      title: "Applying for Legal Aid",
      description: "How to get free legal representation through NLAS",
      steps: [
        "Contact National Legal Aid Service (NLAS) office",
        "Complete legal aid application form",
        "Provide financial information and supporting documents",
        "Submit application for means test assessment",
        "Await assignment of legal aid lawyer",
        "Cooperate with assigned lawyer throughout proceedings"
      ],
      timeLimit: "Apply as early as possible in proceedings",
      icon: "fas fa-hands-helping"
    },
    {
      id: "complaint-procedure",
      title: "Filing Complaints About Treatment",
      description: "How to report violations of your rights while in custody",
      steps: [
        "Document the incident with dates, times, and witnesses",
        "Report to the officer in charge of the facility",
        "If unresolved, file complaint with Kenya National Commission on Human Rights",
        "Contact legal aid lawyer or human rights organization",
        "File complaint with relevant oversight body",
        "Keep copies of all documentation"
      ],
      timeLimit: "Report incidents as soon as possible",
      icon: "fas fa-exclamation-triangle"
    }
  ];

  const educationalResources = [
    {
      id: "constitution-basics",
      title: "Understanding Your Constitutional Rights",
      description: "Key constitutional provisions that protect your rights",
      topics: [
        "Article 25: Right to life and human dignity",
        "Article 29: Freedom and security of the person",
        "Article 48: Access to justice",
        "Article 50: Fair hearing rights",
        "Article 51: Rights of persons detained, held in custody or imprisoned"
      ],
      icon: "fas fa-book"
    },
    {
      id: "court-system",
      title: "Kenya's Court System",
      description: "Understanding how courts work and your role in proceedings",
      topics: [
        "Magistrate Courts vs. High Court jurisdiction",
        "Court of Appeal and Supreme Court roles",
        "How to address the court respectfully",
        "Understanding court procedures and timelines",
        "Your rights during court proceedings"
      ],
      icon: "fas fa-university"
    },
    {
      id: "legal-terminology",
      title: "Common Legal Terms",
      description: "Understanding legal language used in court and documents",
      topics: [
        "Accused vs. Defendant vs. Convict",
        "Bail, Bond, and Surety explained",
        "Plea bargaining and mitigation",
        "Sentence vs. Judgment vs. Order",
        "Appeal vs. Review vs. Revision"
      ],
      icon: "fas fa-language"
    }
  ];

  const emergencyContacts = [
    {
      name: "National Legal Aid Service (NLAS)",
      description: "Free legal aid for qualifying individuals",
      contact: "Contact through county offices nationwide",
      website: EXTERNAL_LINKS.nlas,
      icon: "fas fa-hands-helping",
      available: "24/7 through regional offices"
    },
    {
      name: "Kenya National Commission on Human Rights",
      description: "Report human rights violations and abuse",
      contact: "Complaints hotline and regional offices",
      website: "https://www.knchr.org/",
      icon: "fas fa-shield-alt",
      available: "Office hours with emergency provisions"
    },
    {
      name: "Law Society of Kenya",
      description: "Professional body for lawyers, referral services",
      contact: "Nairobi headquarters and branches",
      website: "https://www.lsk.or.ke/",
      icon: "fas fa-balance-scale",
      available: "Office hours, urgent matters accommodated"
    },
    {
      name: "Judiciary Help Desk",
      description: "Court procedures and filing assistance",
      contact: "Available at all court stations",
      website: "https://www.judiciary.go.ke/",
      icon: "fas fa-info-circle",
      available: "During court hours"
    }
  ];

  return (
    <section className="mt-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Additional Resources & Education</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive guides, educational materials, and step-by-step procedures 
          to help you navigate the legal system effectively.
        </p>
      </div>

      {/* Legal Procedures Guide */}
      <div className="mb-20">
        <h3 className="text-2xl font-bold mb-8 text-center">Legal Procedures Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {legalProcedures.map((procedure) => (
            <div 
              key={procedure.id} 
              className="neu-card p-6"
              data-testid={`procedure-${procedure.id}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <i className={`${procedure.icon} text-primary text-xl`}></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{procedure.title}</h4>
                  <p className="text-sm text-muted-foreground">{procedure.description}</p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                <div className="text-sm font-medium text-accent mb-1">⏰ Time Limit:</div>
                <div className="text-sm">{procedure.timeLimit}</div>
              </div>

              <button
                onClick={() => toggleSection(procedure.id)}
                className="w-full text-left p-3 bg-secondary/30 hover:bg-secondary/50 rounded-lg transition-colors mb-4"
                data-testid={`toggle-procedure-${procedure.id}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">View Step-by-Step Guide</span>
                  <i className={`fas fa-chevron-${expandedSection === procedure.id ? 'up' : 'down'}`}></i>
                </div>
              </button>

              {expandedSection === procedure.id && (
                <div className="space-y-3" data-testid={`steps-${procedure.id}`}>
                  <h5 className="font-medium">Steps to Follow:</h5>
                  <ol className="space-y-2">
                    {procedure.steps.map((step, index) => (
                      <li 
                        key={index} 
                        className="flex items-start gap-3 text-sm"
                        data-testid={`step-${procedure.id}-${index}`}
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Educational Resources */}
      <div className="mb-20">
        <h3 className="text-2xl font-bold mb-8 text-center">Educational Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationalResources.map((resource) => (
            <div 
              key={resource.id} 
              className="neu-card p-6"
              data-testid={`education-${resource.id}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <i className={`${resource.icon} text-accent text-lg`}></i>
                </div>
                <h4 className="text-lg font-semibold">{resource.title}</h4>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Key Topics:</h5>
                <ul className="space-y-1">
                  {resource.topics.map((topic, index) => (
                    <li 
                      key={index} 
                      className="text-sm flex items-center gap-2"
                      data-testid={`topic-${resource.id}-${index}`}
                    >
                      <i className="fas fa-check text-accent text-xs"></i>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="w-full mt-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors text-sm font-medium"
                data-testid={`learn-more-${resource.id}`}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Directory */}
      <div className="mb-20">
        <h3 className="text-2xl font-bold mb-8 text-center">Emergency Contacts & Organizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emergencyContacts.map((contact, index) => (
            <div 
              key={index} 
              className="neu-card p-6"
              data-testid={`emergency-contact-${index}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`${contact.icon} text-destructive text-xl`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{contact.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Contact:</strong> {contact.contact}
                    </div>
                    <div>
                      <strong>Available:</strong> {contact.available}
                    </div>
                    {contact.website && (
                      <div>
                        <a 
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          data-testid={`contact-website-${index}`}
                        >
                          Visit Website →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Self-Help Legal Library */}
      <div className="glass-panel p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Self-Help Legal Library</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access templates, forms, and guides for common legal procedures. 
            While these resources are helpful, professional legal advice is always recommended.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-file-alt text-primary text-2xl"></i>
            </div>
            <h4 className="font-semibold mb-2">Legal Forms</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Download and complete common legal forms for appeals, bail applications, and complaints.
            </p>
            <a 
              href="/documents"
              className="btn-primary text-sm"
              data-testid="button-legal-forms"
            >
              Access Forms
            </a>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-question-circle text-accent text-2xl"></i>
            </div>
            <h4 className="font-semibold mb-2">Ask Questions</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get answers from legal experts and community members in our Q&A forum.
            </p>
            <a 
              href="/forum"
              className="btn-accent text-sm"
              data-testid="button-ask-questions"
            >
              Ask Question
            </a>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-search text-primary text-2xl"></i>
            </div>
            <h4 className="font-semibold mb-2">Legal Research</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Search case law, statutes, and legal precedents relevant to your situation.
            </p>
            <a 
              href={EXTERNAL_LINKS.kenyaLaw}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
              data-testid="button-legal-research"
            >
              Research Laws
            </a>
          </div>
        </div>

        <div className="mt-8 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-start gap-3">
            <i className="fas fa-exclamation-triangle text-destructive mt-1"></i>
            <div>
              <h5 className="font-semibold text-destructive mb-2">Important Disclaimer</h5>
              <p className="text-sm text-muted-foreground">
                The information provided here is for educational purposes only and does not constitute legal advice. 
                Laws can be complex and situations vary. It is strongly recommended to consult with a qualified 
                lawyer for advice specific to your case. Contact NLAS for free legal aid if you qualify.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
