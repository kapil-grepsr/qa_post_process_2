"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COMPARE_API_URL, GET_COLUMNS_API_URL } from "@/core/config/app";

export function useCompareService() {
  const [filenames, setFilenames] = useState<string[]>(["", ""]);
  const [files, setFiles] = useState<(File | null)[]>([null, null]);
  const [baseFileIndex, setBaseFileIndex] = useState(0);
  const [primaryColumn, setPrimaryColumn] = useState("");
  const [columnsPerFile, setColumnsPerFile] = useState<(string[] | null)[]>([null, null]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!filenames[baseFileIndex]) {
      const firstValidIndex = filenames.findIndex((name) => name !== "");
      setBaseFileIndex(firstValidIndex === -1 ? 0 : firstValidIndex);
    }
  }, [filenames, baseFileIndex]);

  // Fetch columns for a file, update columnsPerFile state
  async function fetchColumnsForFile(file: File, index: number) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(GET_COLUMNS_API_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to fetch columns");
      const data = await res.json();
      setColumnsPerFile((prev) => {
        const updated = [...prev];
        updated[index] = data.columns;
        return updated;
      });
    } catch (error) {
      setColumnsPerFile((prev) => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
      console.error("Error fetching columns:", error);
    }
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
    if (file) {
      await fetchColumnsForFile(file, index);
    } else {
      // Clear columns if file removed
      setColumnsPerFile((prev) => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
    }
  };

  const addFile = () => {
    setFilenames((prev) => [...prev, ""]);
    setFiles((prev) => [...prev, null]);
    setColumnsPerFile((prev) => [...prev, null]);
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!primaryColumn.trim()) {
      alert("Please select or enter the primary column.");
      return;
    }

    const validFiles = files.filter((f) => f !== null);
    if (validFiles.length < 2) {
      alert("Please upload at least two CSV files.");
      return;
    }
    if (!files[baseFileIndex]) {
      alert("Please select a base file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    validFiles.forEach((file) => {
      if (file) formData.append(`files`, file);
    });
    formData.append("base_index", baseFileIndex.toString());
    formData.append("primary_column", primaryColumn.trim());

    try {
      const response = await fetch(COMPARE_API_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to compare CSVs");
      }
      const data = await response.json();

      localStorage.setItem("compareResults", JSON.stringify(data));

      const queryFiles = filenames
        .map((f, i) => f && `file${i}=${encodeURIComponent(f)}`)
        .filter(Boolean)
        .join("&");
      router.push(`/data-compare/result?${queryFiles}&base=${baseFileIndex}&primary=${encodeURIComponent(primaryColumn.trim())}`);
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Columns for the base file (or empty array)
  const baseFileColumns = columnsPerFile[baseFileIndex] ?? [];

  return {
    filenames,
    baseFileIndex,
    setBaseFileIndex,
    primaryColumn,
    setPrimaryColumn,
    onFileChange,
    addFile,
    handleCompare,
    loading,
    baseFileColumns,
  };
}
