"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAnyFileSelected } from "@/core/lib/utils";
import { COMPARE_API_URL, GET_COLUMNS_API_URL } from "@/core/config/app";

export function useCompareService() {
  const [filenames, setFilenames] = useState<string[]>(["", ""]);
  const [files, setFiles] = useState<(File | null)[]>([null, null]);
  const [baseFileIndex, setBaseFileIndex] = useState(0);
  const [columnsPerFile, setColumnsPerFile] = useState<(string[] | null)[]>([null, null]); // ➡️ Store columns per file
  const router = useRouter();

  const isProcessing = isAnyFileSelected(filenames);

  useEffect(() => {
    if (!filenames[baseFileIndex]) {
      const firstValidIndex = filenames.findIndex((name) => name !== "");
      setBaseFileIndex(firstValidIndex === -1 ? 0 : firstValidIndex);
    }
  }, [filenames, baseFileIndex]);

  async function fetchColumnsForFile(file: File): Promise<string[]> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(GET_COLUMNS_API_URL, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to fetch columns");
    const data = await res.json();
    return data.columns;
  }

  const onFileChange = async (index: number, file: File | null) => {
    setFilenames((prev) => {
      const updated = [...prev];
      updated[index] = file ? file.name : "";
      return updated;
    });
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const addFile = () => {
    setFilenames((prev) => [...prev, ""]);
    setFiles((prev) => [...prev, null]);
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();

    const validFiles = files.filter((f) => f !== null);
    if (validFiles.length < 2) {
      alert("Please upload at least two CSV files.");
      return;
    }
    if (!files[baseFileIndex]) {
      alert("Please select a base file.");
      return;
    }

    const formData = new FormData();
    validFiles.forEach((file, i) => {
      if (file) formData.append(`files`, file);
    });
    formData.append("base_index", baseFileIndex.toString());

    try {
      const response = await fetch(COMPARE_API_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to compare CSVs");
      const data = await response.json();

        // 👉 Fetch columns for each file
      const columnsResults: Record<string, string[]> = {};
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        if (file) {
          try {
            const columns = await fetchColumnsForFile(file);
            columnsResults[file.name] = columns;
          } catch (error) {
            console.error(`Failed to fetch columns for ${file.name}`, error);
          }
        }
      }

      localStorage.setItem("compareResults", JSON.stringify(data));
      localStorage.setItem("columnsResults", JSON.stringify(columnsResults));

      const queryFiles = filenames
        .map((f, i) => f && `file${i}=${encodeURIComponent(f)}`)
        .filter(Boolean)
        .join("&");
      router.push(`/data-compare/result?${queryFiles}&base=${baseFileIndex}`);
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return {
    filenames,
    baseFileIndex,
    setBaseFileIndex,
    isProcessing,
    onFileChange,
    addFile,
    handleCompare,
    fetchColumnsForFile,
    columnsPerFile,
  };
}
