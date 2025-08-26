import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { LEGAL_CATEGORIES } from "@/lib/constants";

interface ForumQuestionsProps {
  questions: any[];
  isLoading: boolean;
}

export default function ForumQuestions({ questions, isLoading }: ForumQuestionsProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const voteMutation = useMutation({
    mutationFn: async ({ questionId, type }: { questionId: string; type: 'up' | 'down' }) => {
      await apiRequest("POST", `/api/forum/questions/${questionId}/vote`, { type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/questions"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (questionId: string, type: 'up' | 'down') => {
    voteMutation.mutate({ questionId, type });
  };

  const toggleExpanded = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const getCategoryLabel = (categoryValue: string) => {
    return LEGAL_CATEGORIES.find(cat => cat.value === categoryValue)?.label || categoryValue;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'text-accent bg-accent/20';
      case 'closed': return 'text-muted-foreground bg-muted/20';
      default: return 'text-primary bg-primary/20';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="neu-card p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-comments text-muted-foreground text-6xl mb-6"></i>
        <h3 className="text-xl font-semibold mb-4">No Questions Found</h3>
        <p className="text-muted-foreground mb-8">
          Be the first to ask a question in this category!
        </p>
        <button className="btn-primary" data-testid="button-ask-first-question">
          <i className="fas fa-plus mr-2"></i>
          Ask the First Question
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recent Questions</h2>
        <div className="text-sm text-muted-foreground">
          {questions.length} question{questions.length !== 1 ? 's' : ''} found
        </div>
      </div>
      
      <div className="space-y-4">
        {questions.map((question) => (
          <div 
            key={question.id} 
            className="neu-card p-6 interactive"
            data-testid={`question-${question.id}`}
          >
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                {question.user?.profileImageUrl ? (
                  <img 
                    src={question.user.profileImageUrl} 
                    alt={question.user.firstName || question.user.email}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {(question.user?.firstName?.[0] || question.user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Question Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 
                      className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleExpanded(question.id)}
                      data-testid={`question-title-${question.id}`}
                    >
                      {question.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-muted-foreground">
                        by {question.user?.firstName || question.user?.email || 'Anonymous'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {getTimeAgo(question.createdAt)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(question.status)}`}>
                        {question.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                        {getCategoryLabel(question.category)}
                      </span>
                      {question.featured && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                          <i className="fas fa-star mr-1"></i>
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-muted-foreground">
                      <i className="fas fa-eye mr-1"></i>
                      {question.viewsCount} views
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <i className="fas fa-reply mr-1"></i>
                      {question.answersCount} answers
                    </span>
                  </div>
                </div>
                
                {/* Question Preview */}
                <div className="text-muted-foreground mb-4">
                  {expandedQuestion === question.id ? (
                    <p className="whitespace-pre-wrap">{question.content}</p>
                  ) : (
                    <p className="line-clamp-2">
                      {question.content.length > 150 
                        ? question.content.substring(0, 150) + "..."
                        : question.content
                      }
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(question.id, 'up')}
                      disabled={voteMutation.isPending}
                      className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                      data-testid={`upvote-${question.id}`}
                    >
                      <i className="fas fa-thumbs-up"></i>
                      {question.upvotes}
                    </button>
                    <button
                      onClick={() => handleVote(question.id, 'down')}
                      disabled={voteMutation.isPending}
                      className="flex items-center gap-1 text-sm hover:text-destructive transition-colors"
                      data-testid={`downvote-${question.id}`}
                    >
                      <i className="fas fa-thumbs-down"></i>
                      {question.downvotes}
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => toggleExpanded(question.id)}
                    className="text-sm text-primary hover:underline"
                    data-testid={`toggle-expand-${question.id}`}
                  >
                    {expandedQuestion === question.id ? "Show Less" : "Read More"}
                  </button>
                  
                  <button 
                    className="text-sm text-accent hover:underline"
                    data-testid={`answer-${question.id}`}
                  >
                    <i className="fas fa-reply mr-1"></i>
                    Answer
                  </button>
                  
                  <button 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`share-${question.id}`}
                  >
                    <i className="fas fa-share mr-1"></i>
                    Share
                  </button>
                </div>
              </div>
            </div>
            
            {/* Expanded Answer Section */}
            {expandedQuestion === question.id && question.answersCount > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold mb-4">Answers ({question.answersCount})</h4>
                <div className="text-center py-4 text-muted-foreground">
                  <i className="fas fa-comments text-2xl mb-2"></i>
                  <p>Answer loading functionality will be implemented here</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {questions.length >= 20 && (
        <div className="text-center pt-8">
          <button className="btn-secondary" data-testid="button-load-more">
            <i className="fas fa-chevron-down mr-2"></i>
            Load More Questions
          </button>
        </div>
      )}
    </div>
  );
}
