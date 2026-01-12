import { useState, useCallback, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { PAGE_CONFIG } from '@/lib/constants';

export interface PageBreak {
  pageNumber: number;
  startOffset: number;
  endOffset: number;
}

export function usePagination(editor: Editor | null) {
  const [pageCount, setPageCount] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const measureContainerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const calculatePagination = useCallback(() => {
    if (!editor || !measureContainerRef.current) return;

    setIsCalculating(true);

    // Get the editor's content container
    const editorElement = editor.view.dom as HTMLElement;
    if (!editorElement) {
      setIsCalculating(false);
      return;
    }

    // Clone content for measurement
    const measureContainer = measureContainerRef.current;
    measureContainer.innerHTML = '';
    measureContainer.style.width = `${PAGE_CONFIG.CONTENT_WIDTH_PX}px`;
    measureContainer.style.position = 'absolute';
    measureContainer.style.visibility = 'hidden';
    measureContainer.style.left = '-9999px';

    // Clone the editor content
    const clone = editorElement.cloneNode(true) as HTMLElement;
    clone.style.width = `${PAGE_CONFIG.CONTENT_WIDTH_PX}px`;
    measureContainer.appendChild(clone);

    // Measure total height
    const totalHeight = clone.scrollHeight;
    const contentHeightPerPage = PAGE_CONFIG.CONTENT_HEIGHT_PX;

    // Calculate pages
    const calculatedPages = Math.max(1, Math.ceil(totalHeight / contentHeightPerPage));
    
    setPageCount(calculatedPages);
    setIsCalculating(false);

    return calculatedPages;
  }, [editor]);

  // Debounced pagination calculation
  const debouncedCalculate = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      calculatePagination();
    });
  }, [calculatePagination]);

  // Listen to editor updates
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      debouncedCalculate();
    };

    editor.on('update', handleUpdate);
    editor.on('create', handleUpdate);

    // Initial calculation
    setTimeout(debouncedCalculate, 100);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('create', handleUpdate);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [editor, debouncedCalculate]);

  return {
    pageCount,
    isCalculating,
    measureContainerRef,
    recalculate: debouncedCalculate,
  };
}
