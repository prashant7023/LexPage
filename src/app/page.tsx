"use client";

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { DocumentCard } from '@/components/dashboard/DocumentCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDocuments } from '@/hooks/useDocuments';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { documents, isLoading, createDocument, deleteDocument, duplicateDocument, updateDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');

  // Rename Dialog State
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [docToRename, setDocToRename] = useState<{ id: string, title: string } | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  const router = useRouter();

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    setNewDocTitle('');
    setIsCreateDialogOpen(true);
  };

  const confirmCreateDocument = () => {
    const title = newDocTitle.trim() || 'Untitled Document';
    const newDoc = createDocument(title);
    setIsCreateDialogOpen(false);
    router.push(`/editor/${newDoc.id}`);
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      confirmCreateDocument();
    }
  };

  const handleRenameStart = (doc: { id: string, title: string }) => {
    setDocToRename(doc);
    setRenameTitle(doc.title);
    setIsRenameDialogOpen(true);
  };

  const confirmRename = () => {
    if (docToRename && renameTitle.trim()) {
      updateDocument(docToRename.id, { title: renameTitle.trim() });
      setIsRenameDialogOpen(false);
      setDocToRename(null);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      confirmRename();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <Button onClick={handleCreateClick} size="sm" className="h-8">
          <Plus className="w-4 h-4 mr-1.5" />
          New
        </Button>
      </Header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {documents.length === 0 ? (
          <EmptyState onCreateDocument={handleCreateClick} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold text-foreground">Documents</h1>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDuplicate={duplicateDocument}
                  onDelete={deleteDocument}
                  onRenameStart={handleRenameStart}
                />
              ))}
            </div>

            {filteredDocuments.length === 0 && searchQuery && (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No documents matching &quot;{searchQuery}&quot;
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Document Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                placeholder="Untitled Document"
                onKeyDown={handleCreateKeyDown}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCreateDocument}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Document Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rename-name">Document Name</Label>
              <Input
                id="rename-name"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                placeholder="Document Name"
                onKeyDown={handleRenameKeyDown}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
