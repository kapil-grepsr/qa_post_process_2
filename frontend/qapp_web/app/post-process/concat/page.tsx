"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InputFile } from "@/components/ui/custom-ui/InputFile";
import { Button } from "@/components/ui/button";
import { GoHome } from "@/components/ui/custom-ui/GoHome";

import {
  initializeFiles,
  addFile,
  updateFile,
  navigateToDuplicates,
} from "./service";
import { CONCAT_API_URL } from "@/app/services/config";

export default function ConcatPage() {
  const [fileCount, setFileCount] = useState(2);
  const [files, setFiles] = useState<(File | null)[]>(initializeFiles(2));
  const [concatenatedFileUrl, setConcatenatedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddFile = () => {
    const result = addFile(fileCount, files);
    setFileCount(result.fileCount);
    setFiles(result.files);
  };

  const handleFileChange = (index: number, file: File | null) => {
    setFiles((prev) => updateFile(prev, index, file));
  };

  // New: Send files to backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setConcatenatedFileUrl(null);

    try {
      // Validate minimum files selected
      const selectedFiles = files.filter((f) => f !== null) as File[];
      if (selectedFiles.length < 2) {
        setError("Please upload at least two CSV files.");
        setLoading(false);
        return;
      }

      // Prepare form data
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Call your FastAPI backend (adjust URL as needed)
      const response = await fetch(CONCAT_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Try to parse error message from backend
        const errorData = await response.json();
        setError(errorData.detail || "Failed to concatenate files.");
        setLoading(false);
        return;
      }

      // Get CSV blob from response
      const blob = await response.blob();

      // Create a local URL for download
      const url = URL.createObjectURL(blob);
      setConcatenatedFileUrl(url);
    } catch (err) {
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const goToCheckDuplicates = () => {
    navigateToDuplicates(router, concatenatedFileUrl);
  };

  const isProcessing = loading;

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-semibold">Concatenate CSV Files</h1>

        <div className="space-y-4">
          {Array.from({ length: fileCount }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <InputFile
                label={`CSV File ${i + 1}`}
                onChange={(file) => handleFileChange(i, file)}
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}

        <div className="flex space-x-4">
          <Button
            onClick={handleAddFile}
            type="button"
            variant="outline"
            className="hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            + Upload More
          </Button>

          <Button
            type="submit"
            className="hover:bg-primary/90 transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : "Concatenate"}
          </Button>
        </div>

        {concatenatedFileUrl && (
          <div className="pt-4 space-y-2">
              <Button
                      onClick={() => {
                      const a = document.createElement('a');
                      a.href = concatenatedFileUrl;
                      a.download = 'concatenated.csv';
                      a.click();
                    }}
                  >
                    Download Concatenated File
              </Button>


            <Button
              type="button"
              onClick={goToCheckDuplicates}
              variant="secondary"
              className="hover:bg-yellow-100 transition-colors"
            >
              Do you want to check duplicates?
            </Button>
          </div>
        )}
      </form>

      <GoHome isProcessing={isProcessing} position="footer" />
    </>
  );
}
