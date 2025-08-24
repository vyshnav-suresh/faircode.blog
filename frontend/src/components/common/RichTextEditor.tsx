"use client";
import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"]
          ]
        }
      });
      quillRef.current.on("text-change", () => {
        if (onChange) {
          onChange(quillRef.current!.root.innerHTML);
        }
      });
    }
    // Set initial value
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
    // Cleanup
    return () => {
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef, value]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded shadow p-2">
      <div ref={editorRef} style={{ minHeight: 120 }} />
    </div>
  );
}
