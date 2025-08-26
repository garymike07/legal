import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CONSTITUTION_CHAPTERS } from "@/lib/constants";
import { generateLegalSummary } from "@/lib/openai";

interface ConstitutionExplorerProps {
  selectedChapter: any;
  onChapterSelect: (chapter: any) => void;
}

export default function ConstitutionExplorer({ selectedChapter, onChapterSelect }: ConstitutionExplorerProps) {
  const [selectedArticle, setSelectedArticle] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleArticleSelect = async (article: string) => {
    setSelectedArticle(article);
    setSummary("");
    
    // Generate AI summary for the article
    setSummaryLoading(true);
    try {
      const articleText = `Constitution of Kenya 2010, ${selectedChapter.title}, Article ${article}`;
      const generatedSummary = await generateLegalSummary(articleText);
      setSummary(generatedSummary);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Unable to generate summary at this time.");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Interactive Constitution Explorer</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Navigate through the chapters and articles of Kenya's Constitution with AI-powered summaries 
          and plain-language explanations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chapter Navigation */}
        <div className="neu-card p-6">
          <h3 className="text-lg font-semibold mb-4">Constitution Chapters</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {CONSTITUTION_CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => onChapterSelect(chapter)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedChapter.id === chapter.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                data-testid={`chapter-${chapter.id}`}
              >
                <div className="text-sm font-medium mb-1">
                  {chapter.title.split(":")[0]}
                </div>
                <div className="text-xs opacity-80">
                  {chapter.title.split(":")[1]?.trim()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Article Selection */}
        <div className="neu-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedChapter.title.split(":")[0]}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedChapter.title.split(":")[1]?.trim()}
          </p>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedChapter.articles.map((article: string) => (
              <button
                key={article}
                onClick={() => handleArticleSelect(article)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedArticle === article 
                    ? "bg-accent text-accent-foreground" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                data-testid={`article-${article}`}
              >
                <div className="font-medium">Article {article}</div>
                <div className="text-xs opacity-80">
                  {article === "25" && "Right to life"}
                  {article === "28" && "Human dignity"}
                  {article === "47" && "Fair administrative action"}
                  {article === "50" && "Fair hearing"}
                  {!["25", "28", "47", "50"].includes(article) && "Constitutional provision"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Article Content & AI Summary */}
        <div className="neu-card p-6">
          <h3 className="text-lg font-semibold mb-4">Article Details</h3>
          
          {selectedArticle ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">
                  Article {selectedArticle}
                </h4>
                <p className="text-sm">
                  {selectedArticle === "25" && "Every person has the right to life."}
                  {selectedArticle === "28" && "Every person has inherent dignity and the right to have that dignity respected and protected."}
                  {selectedArticle === "47" && "Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair."}
                  {selectedArticle === "50" && "Every person has the right to have any dispute that can be resolved by the application of law decided in a fair and public hearing before a court or, if appropriate, another independent and impartial tribunal or body."}
                  {!["25", "28", "47", "50"].includes(selectedArticle) && `Constitutional provision from ${selectedChapter.title.split(":")[0]}.`}
                </p>
              </div>
              
              <div className="glass-panel p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-robot text-accent"></i>
                  AI-Powered Summary
                </h4>
                
                {summaryLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                    Generating summary...
                  </div>
                ) : summary ? (
                  <p className="text-sm text-muted-foreground">{summary}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Select an article to see an AI-generated plain-language summary.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Related Resources</h4>
                <div className="space-y-1">
                  <a 
                    href="https://new.kenyalaw.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-primary hover:underline"
                    data-testid="related-case-law"
                  >
                    → View related case law
                  </a>
                  <a 
                    href="https://new.kenyalaw.org/legislation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-primary hover:underline"
                    data-testid="related-legislation"
                  >
                    → Find implementing legislation
                  </a>
                  <button 
                    onClick={() => window.open("/forum", "_blank")}
                    className="block text-xs text-accent hover:underline text-left"
                    data-testid="ask-question"
                  >
                    → Ask a question about this article
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-book-open text-muted-foreground text-3xl mb-3"></i>
              <p className="text-muted-foreground">
                Select an article from the chapter to view its content and AI-generated summary.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
