"use client";

import { useState } from "react";
import { isAnyFileSelected } from "@/core/lib/utils";
import { DTALE_API_URL } from "@/core/config/app";

// 🧩 Custom hook
export function useDtaleService() {
  const [files, setFiles] = useState<(File | null)[]>([null]);
  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]);

  const isProcessing = isAnyFileSelected(files);

  const onFileChange = (index: number, file: File | null) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const addFile = () => {
    setFiles((prev) => [...prev, null]);
  };

  const handleOpenInDtale = async (index: number) => {
    const file = files[index];
    if (!file) {
      alert("Please upload a CSV file first.");
      return;
    }

    setLoadingIndexes((prev) => [...prev, index]);
    await openInDtale(file, DTALE_API_URL);
    setLoadingIndexes((prev) => prev.filter((i) => i !== index));
  };

  return {
    files,
    loadingIndexes,
    isProcessing,
    onFileChange,
    addFile,
    handleOpenInDtale,
  };
}

export async function openInDtale(file: File, endpoint: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Error opening dtale: ${error.detail}`);
      return;
    }

    const data = await response.json();
    const url = data.dtale_url || data.url;

    if (url) {
      window.open(url, "_blank");
    } else {
      alert("No URL returned from dtale.");
    }
  } catch (error) {
    alert("Failed to open dtale");
    console.error(error);
  }
}
