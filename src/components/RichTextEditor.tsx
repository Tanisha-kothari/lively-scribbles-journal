
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Image,
  Heading,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export function RichTextEditor({ value, onChange, onImageUpload }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Initialize editor content from props
  useEffect(() => {
    if (editorRef.current && value !== editorContent) {
      editorRef.current.innerHTML = value;
      setEditorContent(value);
    }
  }, [value, editorContent]);

  // Fix text direction issues when the editor mounts and ensure proper initialization
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      
      // Force LTR direction with multiple approaches
      editor.dir = "ltr";
      editor.style.direction = "ltr";
      editor.style.textAlign = "left";
      editor.setAttribute("data-text-direction", "ltr");
      
      // Create a MutationObserver to maintain LTR direction
      const observer = new MutationObserver(() => {
        if (editor.dir !== "ltr") {
          editor.dir = "ltr";
        }
        if (editor.style.direction !== "ltr") {
          editor.style.direction = "ltr";
        }
      });
      
      // Start observing the editor for changes
      observer.observe(editor, { 
        attributes: true, 
        childList: true,
        subtree: true,
        characterData: true
      });
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  const handleChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setEditorContent(content);
      onChange(content);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleChange();
    editorRef.current?.focus();
  }, [handleChange]);

  const handleBold = () => execCommand("bold");
  const handleItalic = () => execCommand("italic");
  const handleUnorderedList = () => execCommand("insertUnorderedList");
  const handleOrderedList = () => execCommand("insertOrderedList");
  
  const handleHeading = () => {
    execCommand("formatBlock", "<h2>");
  };

  const handleLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await onImageUpload(file);
        execCommand("insertImage", imageUrl);
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  return (
    <div className="border rounded-md shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleHeading}
          className="h-8 w-8 p-0"
          title="Heading"
        >
          <Heading className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnorderedList}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleOrderedList}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLink}
          className="h-8 w-8 p-0"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Insert Image"
            onClick={() => document.getElementById("imageUpload")?.click()}
          >
            <Image className="h-4 w-4" />
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </Button>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        dangerouslySetInnerHTML={{ __html: editorContent }}
        onInput={handleChange}
        className="p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none"
        style={{ 
          minHeight: "300px",
          direction: "ltr", 
          textAlign: "left",
          unicodeBidi: "isolate"
        }}
      />
    </div>
  );
}
