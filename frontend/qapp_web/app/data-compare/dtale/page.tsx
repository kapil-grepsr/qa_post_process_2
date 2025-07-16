"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { openInDtale } from "./useDtale";
import { DTALE_API_URL } from "@/core/config/app";
import { GoHome } from "@/components/ui/custom-ui/GoHome";
import { isAnyFileSelected } from "@/core/lib/utils";
import { InputFile } from "@/components/ui/custom-ui/InputFile";


export default function MultiCsvWithDtale() {
  const [files, setFiles] = useState<(File | null)[]>([null]);
  const [filenames, setFilenames] = useState<string[]>([""]);
  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]);


  const isProcessing = isAnyFileSelected(filenames);

  const onFileChange = (index: number, file: File | null) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = file;
      return newFiles;
    });

    setFilenames((prev) => {
      const newNames = [...prev];
      newNames[index] = file ? file.name : "";
      return newNames;
    });
  };

  const addFile = () => {
    setFiles((prev) => [...prev, null]);
    setFilenames((prev) => [...prev, ""]);
  };

  const handleOpenInDtale = async (index: number) => {
    const file = files[index];
    if (!file) {
      alert("Please upload a CSV file first.");
      return;
    }

    setLoadingIndexes((prev) => [...prev, index]);
    await openInDtale(file, `${DTALE_API_URL}/open-in-dtale`);
    setLoadingIndexes((prev) => prev.filter((i) => i !== index));
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-semibold">Open in dtale</h1>

        <div className="space-y-4">
          {filenames.map((filename, i) => (
            <div
              key={i}
              className="rounded-xl border p-4 shadow-sm flex items-center justify-between space-x-4"
            >
              <InputFile label={`CSV File ${i + 1}`} onChange={(file) => onFileChange(i, file)} />
              <p className="text-sm text-gray-600">{filename || "No file selected"}</p>
              <Button
                onClick={() => handleOpenInDtale(i)}
                disabled={!files[i] || loadingIndexes.includes(i)}
                className="whitespace-nowrap"
              >
                {loadingIndexes.includes(i) ? "Opening dtale..." : "Open in dtale"}
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={addFile}
          type="button"
          variant="outline"
          className="hover:bg-gray-100 transition-colors"
        >
          + Upload More
        </Button>
      </div>

      {/* Add GoHome here */}
      <GoHome isProcessing={isProcessing} position="footer" />
    </>
  );
}
