"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  UploadSimpleIcon,
  FileTextIcon,
  XIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumeUpload({ onParsed }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (pdfFile) => {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      return res.json();
    },
    onSuccess: (result) => {
      toast.success("Resume parsed successfully!");
      onParsed({ ...result.data, rawText: result.rawText });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please drop a PDF file");
    }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-colors ${
          dragActive
            ? "border-gray-900 bg-gray-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <UploadSimpleIcon size={40} className="mb-3 text-gray-400" />
        <p className="text-sm font-medium text-gray-900">
          Drag and drop your resume PDF here
        </p>
        <p className="mt-1 text-xs text-gray-400">or</p>
        <label className="mt-3 cursor-pointer">
          <span className="text-sm font-medium text-gray-900 hover:underline">
            Browse files
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <p className="mt-3 text-xs text-gray-400">
          PDF only, max 8MB
        </p>
      </div>

      {/* File preview */}
      {file && (
        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="flex items-center gap-3">
            <FileTextIcon size={24} className="text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={removeFile}
              disabled={uploadMutation.isPending}
            >
              <XIcon size={14} />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleUpload}
          disabled={!file || uploadMutation.isPending}
          className="w-full rounded-full bg-black text-white hover:bg-gray-800"
        >
          {uploadMutation.isPending ? (
            <>
              <SpinnerGapIcon size={16} className="animate-spin" />
              Parsing resume...
            </>
          ) : (
            <>
              <UploadSimpleIcon size={16} />
              Upload & Parse
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
