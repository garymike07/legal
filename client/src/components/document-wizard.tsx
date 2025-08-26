import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { generateDocumentContent } from "@/lib/openai";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface DocumentWizardProps {
  template: any;
  onComplete: () => void;
  onCancel: () => void;
}

export default function DocumentWizard({ template, onComplete, onCancel }: DocumentWizardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const generateDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/generate-document", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/generated-documents"] });
      toast({
        title: "Success",
        description: "Document generated successfully!",
      });
      onComplete();
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
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    
    try {
      // Generate document content using AI
      const documentContent = await generateDocumentContent(template.name, formData);
      
      // Create the document record
      await generateDocumentMutation.mutateAsync({
        templateId: template.id,
        title: formData.documentTitle || `${template.name} - ${new Date().toLocaleDateString()}`,
        formData: {
          ...formData,
          generatedContent: documentContent,
        },
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Document Information</h3>
              <p className="text-muted-foreground mb-6">
                Provide basic information about your document.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentTitle">Document Title</Label>
                <Input
                  id="documentTitle"
                  placeholder="Enter a title for your document"
                  value={formData.documentTitle || ""}
                  onChange={(e) => updateFormData("documentTitle", e.target.value)}
                  data-testid="input-document-title"
                />
              </div>
              
              <div>
                <Label htmlFor="documentPurpose">Purpose/Description</Label>
                <Textarea
                  id="documentPurpose"
                  placeholder="Briefly describe the purpose of this document"
                  value={formData.documentPurpose || ""}
                  onChange={(e) => updateFormData("documentPurpose", e.target.value)}
                  data-testid="textarea-document-purpose"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Party Information</h3>
              <p className="text-muted-foreground mb-6">
                Enter details about the parties involved in this document.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">First Party</h4>
                <div>
                  <Label htmlFor="firstPartyName">Full Name</Label>
                  <Input
                    id="firstPartyName"
                    placeholder="Enter full legal name"
                    value={formData.firstPartyName || ""}
                    onChange={(e) => updateFormData("firstPartyName", e.target.value)}
                    data-testid="input-first-party-name"
                  />
                </div>
                <div>
                  <Label htmlFor="firstPartyAddress">Address</Label>
                  <Textarea
                    id="firstPartyAddress"
                    placeholder="Enter complete address"
                    value={formData.firstPartyAddress || ""}
                    onChange={(e) => updateFormData("firstPartyAddress", e.target.value)}
                    data-testid="textarea-first-party-address"
                  />
                </div>
                <div>
                  <Label htmlFor="firstPartyId">ID/Passport Number</Label>
                  <Input
                    id="firstPartyId"
                    placeholder="Enter ID or passport number"
                    value={formData.firstPartyId || ""}
                    onChange={(e) => updateFormData("firstPartyId", e.target.value)}
                    data-testid="input-first-party-id"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Second Party</h4>
                <div>
                  <Label htmlFor="secondPartyName">Full Name</Label>
                  <Input
                    id="secondPartyName"
                    placeholder="Enter full legal name"
                    value={formData.secondPartyName || ""}
                    onChange={(e) => updateFormData("secondPartyName", e.target.value)}
                    data-testid="input-second-party-name"
                  />
                </div>
                <div>
                  <Label htmlFor="secondPartyAddress">Address</Label>
                  <Textarea
                    id="secondPartyAddress"
                    placeholder="Enter complete address"
                    value={formData.secondPartyAddress || ""}
                    onChange={(e) => updateFormData("secondPartyAddress", e.target.value)}
                    data-testid="textarea-second-party-address"
                  />
                </div>
                <div>
                  <Label htmlFor="secondPartyId">ID/Passport Number</Label>
                  <Input
                    id="secondPartyId"
                    placeholder="Enter ID or passport number"
                    value={formData.secondPartyId || ""}
                    onChange={(e) => updateFormData("secondPartyId", e.target.value)}
                    data-testid="input-second-party-id"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Document Details</h3>
              <p className="text-muted-foreground mb-6">
                Provide specific details for your {template.name.toLowerCase()}.
              </p>
            </div>
            
            <div className="space-y-4">
              {template.category === 'business' && (
                <>
                  <div>
                    <Label htmlFor="serviceDescription">Service Description</Label>
                    <Textarea
                      id="serviceDescription"
                      placeholder="Describe the services to be provided"
                      value={formData.serviceDescription || ""}
                      onChange={(e) => updateFormData("serviceDescription", e.target.value)}
                      data-testid="textarea-service-description"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contractValue">Contract Value (KES)</Label>
                      <Input
                        id="contractValue"
                        type="number"
                        placeholder="Enter amount in KES"
                        value={formData.contractValue || ""}
                        onChange={(e) => updateFormData("contractValue", e.target.value)}
                        data-testid="input-contract-value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractDuration">Duration</Label>
                      <Input
                        id="contractDuration"
                        placeholder="e.g., 6 months, 1 year"
                        value={formData.contractDuration || ""}
                        onChange={(e) => updateFormData("contractDuration", e.target.value)}
                        data-testid="input-contract-duration"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {template.category === 'employment' && (
                <>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="Enter job title"
                      value={formData.jobTitle || ""}
                      onChange={(e) => updateFormData("jobTitle", e.target.value)}
                      data-testid="input-job-title"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary">Monthly Salary (KES)</Label>
                      <Input
                        id="salary"
                        type="number"
                        placeholder="Enter monthly salary"
                        value={formData.salary || ""}
                        onChange={(e) => updateFormData("salary", e.target.value)}
                        data-testid="input-salary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate || ""}
                        onChange={(e) => updateFormData("startDate", e.target.value)}
                        data-testid="input-start-date"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {template.category === 'property' && (
                <>
                  <div>
                    <Label htmlFor="propertyDescription">Property Description</Label>
                    <Textarea
                      id="propertyDescription"
                      placeholder="Detailed description of the property"
                      value={formData.propertyDescription || ""}
                      onChange={(e) => updateFormData("propertyDescription", e.target.value)}
                      data-testid="textarea-property-description"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyValue">Property Value (KES)</Label>
                      <Input
                        id="propertyValue"
                        type="number"
                        placeholder="Enter property value"
                        value={formData.propertyValue || ""}
                        onChange={(e) => updateFormData("propertyValue", e.target.value)}
                        data-testid="input-property-value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="titleDeedNumber">Title Deed Number</Label>
                      <Input
                        id="titleDeedNumber"
                        placeholder="Enter title deed number"
                        value={formData.titleDeedNumber || ""}
                        onChange={(e) => updateFormData("titleDeedNumber", e.target.value)}
                        data-testid="input-title-deed-number"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="additionalTerms">Additional Terms & Conditions</Label>
                <Textarea
                  id="additionalTerms"
                  placeholder="Any additional terms or special conditions"
                  value={formData.additionalTerms || ""}
                  onChange={(e) => updateFormData("additionalTerms", e.target.value)}
                  data-testid="textarea-additional-terms"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Review & Generate</h3>
              <p className="text-muted-foreground mb-6">
                Review your information and generate the document.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="neu-card p-4">
                <h4 className="font-medium mb-2">Document Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Title:</strong> {formData.documentTitle || "Untitled"}
                  </div>
                  <div>
                    <strong>Template:</strong> {template.name}
                  </div>
                  <div>
                    <strong>First Party:</strong> {formData.firstPartyName || "Not specified"}
                  </div>
                  <div>
                    <strong>Second Party:</strong> {formData.secondPartyName || "Not specified"}
                  </div>
                  {formData.contractValue && (
                    <div>
                      <strong>Value:</strong> KES {Number(formData.contractValue).toLocaleString()}
                    </div>
                  )}
                  {formData.salary && (
                    <div>
                      <strong>Salary:</strong> KES {Number(formData.salary).toLocaleString()}
                    </div>
                  )}
                  {formData.propertyValue && (
                    <div>
                      <strong>Property Value:</strong> KES {Number(formData.propertyValue).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-info-circle text-primary"></i>
                  <h4 className="font-medium">Document Generation</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your document will be generated using AI technology to ensure compliance with Kenyan law.
                  The document will be available in both PDF and DOCX formats for download.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="py-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">
              <span className="gradient-text">Document Wizard</span>
            </h1>
            <p className="text-muted-foreground mb-6">
              Generate your {template.name} using our step-by-step wizard
            </p>
            
            {/* Progress Bar */}
            <div className="glass-panel p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="mb-4" data-testid="wizard-progress" />
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className={currentStep >= 1 ? "text-primary" : "text-muted-foreground"}>
                  Document Info
                </div>
                <div className={currentStep >= 2 ? "text-primary" : "text-muted-foreground"}>
                  Parties
                </div>
                <div className={currentStep >= 3 ? "text-primary" : "text-muted-foreground"}>
                  Details
                </div>
                <div className={currentStep >= 4 ? "text-primary" : "text-muted-foreground"}>
                  Review
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="neu-card p-8 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <div>
              {currentStep > 1 ? (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  data-testid="button-previous"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Previous
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              )}
            </div>
            
            <div>
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext}
                  data-testid="button-next"
                >
                  Next
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={isGenerating || generateDocumentMutation.isPending}
                  className="btn-accent"
                  data-testid="button-generate"
                >
                  {isGenerating || generateDocumentMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      Generate Document
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
