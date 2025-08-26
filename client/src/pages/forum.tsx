import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ForumQuestions from "@/components/forum-questions";
import { LEGAL_CATEGORIES, QUESTION_STATUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const questionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
});

export default function Forum() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

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

  const { data: questions, isLoading: questionsLoading } = useQuery<any[]>({
    queryKey: ["/api/forum/questions", selectedCategory, selectedStatus],
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/forum/questions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/questions"] });
      setIsAskDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Your question has been posted successfully.",
      });
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
        description: "Failed to post question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createQuestionMutation.mutate(data);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          {/* Header Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">Legal Q&A Forum</span><br />
              <span className="text-foreground">Community Support</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get answers from legal experts and community members. Ask questions, 
              share knowledge, and help others navigate Kenya's legal landscape.
            </p>
            
            <Dialog open={isAskDialogOpen} onOpenChange={setIsAskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary text-lg px-8 py-4" data-testid="button-ask-question">
                  <i className="fas fa-plus mr-2"></i>
                  Ask a Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ask a Legal Question</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Briefly describe your legal question..." 
                              {...field}
                              data-testid="input-question-title"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-question-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LEGAL_CATEGORIES.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide detailed information about your situation, relevant facts, and what specific advice you're seeking..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="textarea-question-content"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAskDialogOpen(false)}
                        data-testid="button-cancel-question"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createQuestionMutation.isPending}
                        data-testid="button-submit-question"
                      >
                        {createQuestionMutation.isPending ? "Posting..." : "Post Question"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </section>

          {/* Filters */}
          <section className="mb-12">
            <div className="glass-panel p-6 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Filter by Category</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`p-2 rounded text-sm transition-colors ${
                        selectedCategory === "" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                      data-testid="filter-category-all"
                    >
                      All Categories
                    </button>
                    {LEGAL_CATEGORIES.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`p-2 rounded text-sm transition-colors ${
                          selectedCategory === category.value 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary/50 hover:bg-secondary"
                        }`}
                        data-testid={`filter-category-${category.value}`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Filter by Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedStatus("")}
                      className={`p-2 rounded text-sm transition-colors ${
                        selectedStatus === "" 
                          ? "bg-accent text-accent-foreground" 
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                      data-testid="filter-status-all"
                    >
                      All Status
                    </button>
                    {QUESTION_STATUSES.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => setSelectedStatus(status.value)}
                        className={`p-2 rounded text-sm transition-colors ${
                          selectedStatus === status.value 
                            ? "bg-accent text-accent-foreground" 
                            : "bg-secondary/50 hover:bg-secondary"
                        }`}
                        data-testid={`filter-status-${status.value}`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Questions List */}
          <ForumQuestions 
            questions={questions || []}
            isLoading={questionsLoading}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
