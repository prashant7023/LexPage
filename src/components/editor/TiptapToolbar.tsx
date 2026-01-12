"use client";

import { type Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

interface TiptapToolbarProps {
    editor: Editor | null;
}

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
    if (!editor) {
        return null;
    }

    return (
        <div className="border-b border-border bg-background p-2 flex flex-wrap gap-1 sticky top-0 z-50 items-center">
            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Toggle bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Toggle italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    aria-label="Toggle underline"
                >
                    <Underline className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    aria-label="Toggle strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    aria-label="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    aria-label="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    aria-label="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    aria-label="Align left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    aria-label="Align center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                    aria-label="Align right"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'justify' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
                    aria-label="Align justify"
                >
                    <AlignJustify className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Bullet list"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Ordered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    aria-label="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    aria-label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    aria-label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Toggle>
            </div>
        </div>
    );
}
