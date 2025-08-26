import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { LEGAL_CATEGORIES, CASE_STATUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const caseSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientContact: z.string().optional(),
  title: z.string().min(5, "Case title must be at least 5 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  courtName: z.string().optional(),
  caseNumber: z.string().optional(),
  nextHearing: z.string().optional(),
  notes: z.string().optional(),
});

export default function LawyerCaseManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      clientName: "",
      clientContact: "",
      title: "",
      description: "",
      category: "",
      courtName: "",
      caseNumber: "",
      nextHearing: "",
      notes: "",
    },
  });

  const { data: cases, isLoading: casesLoading } = useQuery({
    queryKey: ["/api/cases", selectedStatus],
  });

  const createCaseMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/cases", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Case created successfully.",
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
        description: "Failed to create case. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCaseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/cases/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setIsEditDialogOpen(false);
      setSelectedCase(null);
      toast({
        title: "Success",
        description: "Case updated successfully.",
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
        description: "Failed to update case. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    if (selectedCase) {
      updateCaseMutation.mutate({ id: selectedCase.id, data });
    } else {
      createCaseMutation.mutate(data);
    }
  };

  const openEditDialog = (case_: any) => {
    setSelectedCase(case_);
    form.reset({
      clientName: case_.clientName || "",
      clientContact: case_.clientContact || "",
      title: case_.title || "",
      description: case_.description || "",
      category: case_.category || "",
      courtName: case_.courtName || "",
      caseNumber: case_.caseNumber || "",
      nextHearing: case_.nextHearing ? new Date(case_.nextHearing).toISOString().split('T')[0] : "",
      notes: case_.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const getCategoryLabel = (categoryValue: string) => {
    return LEGAL_CATEGORIES.find(cat => cat.value === categoryValue)?.label || categoryValue;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-accent bg-accent/20';
      case 'pending': return 'text-primary bg-primary/20';
      case 'closed': return 'text-muted-foreground bg-muted/20';
      case 'appealed': return 'text-destructive bg-destructive/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Case Management</h2>
          <p className="text-muted-foreground">Manage your legal cases and client matters</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary" data-testid="button-create-case">
              <i className="fas fa-plus mr-2"></i>
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter client's full name" 
                            {...field}
                            data-testid="input-client-name"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Contact</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Phone or email" 
                            {...field}
                            data-testid="input-client-contact"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief description of the case" 
                          {...field}
                          data-testid="input-case-title"
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
                      <FormLabel>Legal Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-case-category">
                            <SelectValue placeholder="Select legal category" />
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the case, background, and current status..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-case-description"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="courtName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Court Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., High Court of Kenya" 
                            {...field}
                            data-testid="input-court-name"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="caseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Court assigned case number" 
                            {...field}
                            data-testid="input-case-number"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="nextHearing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Hearing Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                          data-testid="input-next-hearing"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes, reminders, or important details..."
                          {...field}
                          data-testid="textarea-case-notes"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-case"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createCaseMutation.isPending}
                    data-testid="button-submit-case"
                  >
                    {createCaseMutation.isPending ? "Creating..." : "Create Case"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Filter */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus("")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedStatus === "" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/50 hover:bg-secondary"
            }`}
            data-testid="filter-status-all"
          >
            All Cases
          </button>
          {CASE_STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedStatus === status.value 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
              data-testid={`filter-status-${status.value}`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {casesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="neu-card p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cases && cases.length > 0 ? (
          cases.map((case_: any) => (
            <div 
              key={case_.id} 
              className="neu-card p-6 interactive"
              data-testid={`case-${case_.id}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{case_.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(case_.status)}`}>
                      {case_.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                    <div>
                      <strong>Client:</strong> {case_.clientName}
                    </div>
                    <div>
                      <strong>Category:</strong> {getCategoryLabel(case_.category)}
                    </div>
                    {case_.courtName && (
                      <div>
                        <strong>Court:</strong> {case_.courtName}
                      </div>
                    )}
                    {case_.caseNumber && (
                      <div>
                        <strong>Case #:</strong> {case_.caseNumber}
                      </div>
                    )}
                    {case_.nextHearing && (
                      <div>
                        <strong>Next Hearing:</strong> {formatDate(case_.nextHearing)}
                      </div>
                    )}
                    <div>
                      <strong>Created:</strong> {formatDate(case_.createdAt)}
                    </div>
                  </div>
                  
                  {case_.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {case_.description.length > 150 
                        ? case_.description.substring(0, 150) + "..."
                        : case_.description
                      }
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(case_)}
                    data-testid={`button-edit-${case_.id}`}
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-view-${case_.id}`}
                  >
                    <i className="fas fa-eye mr-1"></i>
                    View
                  </Button>
                </div>
              </div>
              
              {case_.notes && (
                <div className="border-t border-border pt-3">
                  <div className="text-xs text-muted-foreground mb-1">Notes:</div>
                  <div className="text-sm bg-secondary/30 p-2 rounded">
                    {case_.notes}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <i className="fas fa-folder-open text-muted-foreground text-6xl mb-6"></i>
            <h3 className="text-xl font-semibold mb-4">No Cases Found</h3>
            <p className="text-muted-foreground mb-8">
              {selectedStatus 
                ? `No cases with status "${selectedStatus}" found.`
                : "You haven't created any cases yet. Start by creating your first case."
              }
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="btn-primary"
              data-testid="button-create-first-case"
            >
              <i className="fas fa-plus mr-2"></i>
              Create Your First Case
            </Button>
          </div>
        )}
      </div>

      {/* Edit Case Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Case</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter client's full name" 
                          {...field}
                          data-testid="input-edit-client-name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Contact</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Phone or email" 
                          {...field}
                          data-testid="input-edit-client-contact"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of the case" 
                        {...field}
                        data-testid="input-edit-case-title"
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
                    <FormLabel>Legal Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-case-category">
                          <SelectValue placeholder="Select legal category" />
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the case, background, and current status..."
                        className="min-h-[100px]"
                        {...field}
                        data-testid="textarea-edit-case-description"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="courtName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., High Court of Kenya" 
                          {...field}
                          data-testid="input-edit-court-name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="caseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Court assigned case number" 
                          {...field}
                          data-testid="input-edit-case-number"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="nextHearing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Hearing Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        data-testid="input-edit-next-hearing"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes, reminders, or important details..."
                        {...field}
                        data-testid="textarea-edit-case-notes"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCase(null);
                  }}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateCaseMutation.isPending}
                  data-testid="button-update-case"
                >
                  {updateCaseMutation.isPending ? "Updating..." : "Update Case"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
