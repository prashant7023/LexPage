import { MoreHorizontal, FileText, Copy, Trash2, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Document } from '@/hooks/useDocuments';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface DocumentCardProps {
  document: Document;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRenameStart: (document: Document) => void;
}

export function DocumentCard({ document, onDuplicate, onDelete, onRenameStart }: DocumentCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/editor/${document.id}`);
  };

  return (
    <Card
      className="group cursor-pointer hover:border-primary/50 transition-colors"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-12 rounded border border-border bg-background flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm text-foreground truncate">
                {document.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Edited {formatDistanceToNow(document.updatedAt, { addSuffix: true })}
              </p>
              <p className="text-xs text-muted-foreground">
                {document.pageCount} {document.pageCount === 1 ? 'page' : 'pages'}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRenameStart(document); }}>
                <Pencil className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(document.id); }}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(document.id); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
