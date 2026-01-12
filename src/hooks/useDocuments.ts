import { useState, useEffect, useCallback } from 'react';

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  pageCount: number;
}

const STORAGE_KEY = 'lexpage-documents';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getStoredDocuments(): Document[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const docs = JSON.parse(stored);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return docs.map((doc: any) => ({
      ...doc,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    }));
  } catch {
    return [];
  }
}

function saveDocuments(docs: Document[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with localStorage on mount and when other tabs change storage
  useEffect(() => {
    setDocuments(getStoredDocuments());
    setIsLoading(false);

    const handleStorageChange = () => {
      setDocuments(getStoredDocuments());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const createDocument = useCallback((title: string = 'Untitled Document'): Document => {
    const newDoc: Document = {
      id: generateId(),
      title,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      pageCount: 1,
    };
    const currentDocs = getStoredDocuments();
    const updated = [newDoc, ...currentDocs];
    saveDocuments(updated);
    setDocuments(updated);
    return newDoc;
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Omit<Document, 'id' | 'createdAt'>>) => {
    const currentDocs = getStoredDocuments();
    const updated = currentDocs.map(doc =>
      doc.id === id
        ? { ...doc, ...updates, updatedAt: new Date() }
        : doc
    );
    saveDocuments(updated);
    setDocuments(updated);
  }, []);

  const deleteDocument = useCallback((id: string) => {
    const currentDocs = getStoredDocuments();
    const updated = currentDocs.filter(doc => doc.id !== id);
    saveDocuments(updated);
    setDocuments(updated);
  }, []);

  const duplicateDocument = useCallback((id: string): Document | null => {
    const currentDocs = getStoredDocuments();
    const original = currentDocs.find(doc => doc.id === id);
    if (!original) return null;

    const newDoc: Document = {
      ...original,
      id: generateId(),
      title: `${original.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [newDoc, ...currentDocs];
    saveDocuments(updated);
    setDocuments(updated);
    return newDoc;
  }, []);

  const getDocument = useCallback((id: string): Document | undefined => {
    // Always get fresh from localStorage
    const currentDocs = getStoredDocuments();
    return currentDocs.find(doc => doc.id === id);
  }, []);

  return {
    documents,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    duplicateDocument,
    getDocument,
  };
}
