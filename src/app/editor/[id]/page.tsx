"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useDocuments } from '@/hooks/useDocuments';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { PageSetupModal } from '@/components/editor/PageSetupModal';
import { TiptapToolbar } from '@/components/editor/TiptapToolbar';

export default function TextEditor() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { getDocument, updateDocument } = useDocuments();

  const [title, setTitle] = useState('Untitled Document');
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showPageSetup, setShowPageSetup] = useState(false);
  const [margins, setMargins] = useState({ top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 }); // cm

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
      TextStyle,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[1056px] dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      if (id && isLoaded) {
        updateDocument(id, { content: editor.getHTML() });
      }
    },
  });

  // Load document
  useEffect(() => {
    if (id && editor && !isLoaded) {
      const doc = getDocument(id);
      if (doc) {
        setTitle(doc.title);

        if (doc.content) {
          // Check if content is Draft.js JSON (legacy)
          try {
            const json = JSON.parse(doc.content);
            if (json.blocks) {
              // It's Draft.js, extract text as fallback
              const text = json.blocks.map((b: any) => b.text).join('\n');
              editor.commands.setContent(text);
            } else {
              // It's likely HTML or just a string
              editor.commands.setContent(doc.content);
            }
          } catch {
            // Not JSON, treat as HTML
            editor.commands.setContent(doc.content);
          }
        }
        setIsLoaded(true);
      } else {
        router.push('/');
      }
    }
  }, [id, getDocument, router, editor, isLoaded]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (id) {
      updateDocument(id, { title: newTitle });
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex flex-col dark:bg-background">
      <EditorHeader
        title={title}
        onTitleChange={handleTitleChange}
        pageCount={1}
        isSaving={false}
        onPrint={() => window.print()}
        onExport={async (format) => {
          if (format === 'pdf') {
            try {
              const html2pdf = (await import('html2pdf.js')).default;
              // Target the ProseMirror editor content
              const element = document.querySelector('.ProseMirror');

              if (element) {
                // Clone the element to modify styles for export
                const clone = element.cloneNode(true) as HTMLElement;

                // Remove prose class to prevent max-width constraints
                clone.classList.remove('prose', 'prose-sm', 'sm:prose', 'lg:prose-lg', 'xl:prose-2xl');

                // Reset padding/margin on the clone
                clone.style.padding = '0px';
                clone.style.margin = '0px';
                clone.style.maxWidth = 'none';
                clone.style.width = '100%';
                clone.style.height = 'auto';
                clone.style.boxShadow = 'none';
                clone.style.border = 'none';
                clone.style.overflow = 'visible';

                // Force light mode styles for PDF
                clone.style.backgroundColor = '#ffffff';
                clone.style.color = '#000000';
                clone.style.fontFamily = 'Arial, sans-serif'; // Enforce a standard font for PDF
                clone.style.fontSize = '12pt';
                clone.style.lineHeight = '1.5';

                // Force all text elements to be black and inherit font
                const allElements = clone.querySelectorAll('*');
                allElements.forEach((el) => {
                  if (el instanceof HTMLElement) {
                    el.style.color = '#000000';
                    el.style.backgroundColor = 'transparent';
                    el.style.fontFamily = 'inherit';
                  }
                });
                allElements.forEach((el) => {
                  if (el instanceof HTMLElement) {
                    el.style.color = '#000000';
                    el.style.backgroundColor = 'transparent';
                  }
                });

                // Create a container to hold the clone off-screen
                const container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.left = '-9999px';
                container.style.top = '0';
                container.style.width = '21.59cm'; // US Letter width
                container.appendChild(clone);
                document.body.appendChild(container);

                const opt: any = {
                  margin: [margins.top, margins.left, margins.bottom, margins.right],
                  filename: `${title}.pdf`,
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2, useCORS: true },
                  jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' }
                };

                await html2pdf().set(opt).from(clone).save();

                // Cleanup
                document.body.removeChild(container);
              }
            } catch (error) {
              console.error('PDF Export failed:', error);
              alert('Failed to export PDF. Please try again.');
            }
          } else if (format === 'docx') {
            try {
              const { asBlob } = await import('html-docx-js-typescript');
              const { saveAs } = await import('file-saver');

              const editorElement = document.querySelector('.ProseMirror');
              if (editorElement) {
                const htmlString = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="UTF-8">
                    <style>
                      body { font-family: Arial, sans-serif; }
                      p { margin-bottom: 10px; }
                    </style>
                  </head>
                  <body>
                    ${editorElement.innerHTML}
                  </body>
                  </html>
                `;

                const blob = await asBlob(htmlString);
                saveAs(blob as Blob, `${title}.docx`);
              }
            } catch (error) {
              console.error('Export failed:', error);
              alert('Failed to export document. Please try again.');
            }
          }
        }}
        zoom={zoom}
        onZoomChange={setZoom}
        onPageSetup={() => setShowPageSetup(true)}
      />

      <TiptapToolbar editor={editor} />

      <PageSetupModal
        isOpen={showPageSetup}
        onClose={() => setShowPageSetup(false)}
        margins={margins}
        onSave={setMargins}
      />

      <div className="flex-1 pb-16 print:pb-0 print:bg-white overflow-auto relative bg-[#F8F9FA] dark:bg-background">
        <div
          className="mt-6 bg-white dark:bg-card shadow-lg max-w-5xl mx-auto mb-12 border min-h-[1056px] print:shadow-none print:border-none print:m-0 print:max-w-none dark:text-foreground transition-all duration-200"
          style={{
            paddingTop: `${margins.top}cm`,
            paddingBottom: `${margins.bottom}cm`,
            paddingLeft: `${margins.left}cm`,
            paddingRight: `${margins.right}cm`,
            zoom: zoom,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      <style jsx global>{`
        /* Tiptap specific styles */
        .ProseMirror {
          min-height: 100%;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* List styles */
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror li {
          margin-bottom: 0.5em;
        }
        .ProseMirror li p {
          margin: 0;
        }
        
        /* Print styles */
        @media print {
          @page {
            margin: 0;
          }
          
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }

          /* Reset zoom transform */
          div[style*="zoom"] {
            zoom: 1 !important;
          }

          /* Hide toolbar and header */
          nav, header, aside, .border-b {
            display: none !important;
          }

          .ProseMirror {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: ${margins.top}cm ${margins.right}cm ${margins.bottom}cm ${margins.left}cm !important;
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
        }
        /* Fix for pasted black text in dark mode */
        .dark .ProseMirror span[style*="color: #000000"],
        .dark .ProseMirror span[style*="color: black"],
        .dark .ProseMirror span[style*="color: rgb(0, 0, 0)"] {
          color: inherit !important;
        }
      `}</style>
    </div>
  );
}
