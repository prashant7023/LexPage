import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, Printer, Download, FileText, Minus, Plus, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  pageCount: number;
  isSaving?: boolean;
  onPrint?: () => void;
  onExport?: (format?: 'pdf' | 'docx') => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onPageSetup?: () => void;
}

export function EditorHeader({
  title,
  onTitleChange,
  pageCount,
  isSaving = false,
  onPrint,
  onExport,
  zoom,
  onZoomChange,
  onPageSetup,
}: EditorHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onTitleChange(editedTitle.trim());
    } else {
      setEditedTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />

          {isEditing ? (
            <Input
              ref={inputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              className="h-7 text-sm font-medium w-64"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {title}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? (
            <span>Saving...</span>
          ) : (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Saved
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground mr-2">
          {pageCount} {pageCount === 1 ? 'page' : 'pages'}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5">
              <FileText className="h-4 w-4" />
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onPageSetup}>
              Page setup
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrint}>
              Print / Save as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Download</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => onExport && onExport('pdf')}>
                  PDF Document (.pdf)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport && onExport('docx')}>
                  Microsoft Word (.docx)
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 mr-2 bg-muted/50 rounded-md p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            disabled={zoom <= 0.5}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs w-12 text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
            disabled={zoom >= 2}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
