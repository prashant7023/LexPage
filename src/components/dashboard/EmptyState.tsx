import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateDocument: () => void;
}

export function EmptyState({ onCreateDocument }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-medium text-foreground mb-1">No documents yet</h2>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
        Create your first document to get started with real-time pagination
      </p>
      <Button onClick={onCreateDocument} size="sm">
        <Plus className="w-4 h-4 mr-2" />
        New Document
      </Button>
    </div>
  );
}
