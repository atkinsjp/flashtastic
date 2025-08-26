import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flag, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ContentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "ai_question" | "ai_response" | "flashcard";
  contentText: string;
  contentId?: string;
}

export function ContentReportModal({
  isOpen,
  onClose,
  contentType,
  contentText,
  contentId
}: ContentReportModalProps) {
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reportMutation = useMutation({
    mutationFn: async (data: {
      contentType: string;
      contentText: string;
      contentId?: string;
      reportReason: string;
      reportDetails?: string;
    }) => {
      const response = await apiRequest("POST", "/api/content-reports", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for reporting this content. Our team will review it.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content-reports"] });
      onClose();
      // Reset form
      setReportReason("");
      setReportDetails("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!reportReason) {
      toast({
        title: "Reason Required",
        description: "Please select a reason for reporting this content.",
        variant: "destructive",
      });
      return;
    }

    reportMutation.mutate({
      contentType,
      contentText,
      contentId,
      reportReason,
      reportDetails: reportDetails.trim() || undefined,
    });
  };

  const reportReasons = [
    { value: "inappropriate", label: "Inappropriate content" },
    { value: "inaccurate", label: "Inaccurate information" },
    { value: "offensive", label: "Offensive language" },
    { value: "spam", label: "Spam or promotional" },
    { value: "harmful", label: "Harmful or unsafe" },
    { value: "copyright", label: "Copyright violation" },
    { value: "other", label: "Other reason" },
  ];

  const getContentTypeLabel = () => {
    switch (contentType) {
      case "ai_question": return "AI-generated question";
      case "ai_response": return "AI response";
      case "flashcard": return "Flash card";
      default: return "content";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="content-report-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            Report Content
          </DialogTitle>
          <DialogDescription>
            Help us keep FlashTastic safe by reporting {getContentTypeLabel()} that violates our guidelines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg border">
            <Label className="text-sm font-medium text-muted-foreground">Content being reported:</Label>
            <p className="text-sm mt-1 line-clamp-3">{contentText}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-reason">Reason for reporting *</Label>
            <Select value={reportReason} onValueChange={setReportReason}>
              <SelectTrigger data-testid="select-report-reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-details">Additional details (optional)</Label>
            <Textarea
              id="report-details"
              placeholder="Provide more context about why you're reporting this content..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              rows={3}
              data-testid="textarea-report-details"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              False reports may result in account restrictions. Only report content that genuinely violates our guidelines.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-report">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={reportMutation.isPending || !reportReason}
            data-testid="button-submit-report"
          >
            {reportMutation.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}