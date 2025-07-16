"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GET_COLUMNS_API_URL, CHECK_DUPLICATES_API_URL } from "@/core/config/app";

export default function DuplicatesService() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [showColumns, setShowColumns] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState<string>("");
  const [duplicates, setDuplicates] = useState<any[] | null>(null); // null means not checked yet
  const [loading, setLoading] = useState(false);
  const [loadingColumns, setLoadingColumns] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setDuplicates(null); // reset on new file
      setSelectedPrimary("");
      setShowColumns(false);
      setColumns([]);

      setLoadingColumns(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch(GET_COLUMNS_API_URL, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          const error = await response.json();
          alert(`Error fetching columns: ${error.detail}`);
          setLoadingColumns(false);
          return;
        }
        const data = await response.json();
        setColumns(data.columns);
        setShowColumns(true);
      } catch (error) {
        alert("Failed to fetch columns from backend");
        console.error(error);
      }
      setLoadingColumns(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a CSV file.");
      return;
    }
    if (!selectedPrimary) {
      alert("Please select a primary column.");
      return;
    }

    setLoading(true);
    setDuplicates(null); // clear previous results

    const formData = new FormData();
    formData.append("file", file);
    formData.append("primary_column", selectedPrimary);

    try {
      const response = await fetch(CHECK_DUPLICATES_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      // If backend returns message and duplicates array, handle both
      if (data.duplicates && data.duplicates.length > 0) {
        setDuplicates(data.duplicates);
      } else {
        // no duplicates found
        setDuplicates([]);
      }
    } catch (error) {
      alert("Failed to check duplicates");
      console.error(error);
      setDuplicates([]);
    }

    setLoading(false);
  };

  // Handler for Show in dtale button
 // Handler for Show in dtale button
const handleShowInDtale = async () => {
  if (!file) {
    alert("Please upload a file first.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/dtale/open-in-dtale", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Error opening dtale: ${error.detail}`);
      return;
    }

    const data = await response.json();
    if (data.url) {
      // Open the dtale instance in a new tab
      window.open(data.url, "_blank");
    } else {
      alert("No URL returned from dtale.");
    }
  } catch (error) {
    alert("Failed to open dtale");
    console.error(error);
  }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Check Duplicates</h1>

      <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <label className="block mb-2 font-medium">Upload CSV File</label>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          onClick={() => setShowColumns(!showColumns)}
          disabled={loadingColumns || columns.length === 0}
          variant="outline"
          className="hover:bg-gray-100 transition-colors"
        >
          {loadingColumns ? "Loading columns..." : showColumns ? "Hide Columns" : "See Columns"}
        </Button>

        {showColumns && columns.length > 0 && (
          <div className="rounded-lg border p-4 space-y-2 shadow-sm max-h-40 overflow-auto">
            <h2 className="text-lg font-medium">Columns</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {columns.map((col) => (
                <li key={col}>{col}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Select Primary Column</h2>
        <Select
          value={selectedPrimary}
          onValueChange={(value) => {
            setSelectedPrimary(value);
            setDuplicates(null);
          }}
          disabled={columns.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a primary column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="hover:bg-primary/90 transition-colors">
        {loading ? "Checking..." : "Check for Duplicates"}
      </Button>

      {/* Result display */}
      {duplicates !== null && (
        duplicates.length > 0 ? (
          <div className="mt-6 border rounded p-4 overflow-auto max-h-64 bg-gray-50">
            <h2 className="text-lg font-medium mb-2">Duplicates Found ({duplicates.length})</h2>
            <pre className="text-xs">{JSON.stringify(duplicates, null, 2)}</pre>
            <Button className="mt-4" onClick={handleShowInDtale}>
              Show in dtale
            </Button>
          </div>
        ) : (
          !loading && (
            <p className="mt-6 text-center text-gray-500">No duplicates found.</p>
          )
        )
      )}
    </form>
  );
}
