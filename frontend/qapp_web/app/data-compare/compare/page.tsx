"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GoHome } from "@/components/ui/custom-ui/GoHome";
import { useCompareService } from "./useCompare";
import { InputFile } from "@/components/ui/custom-ui/InputFile";

export default function ComparePage() {
  const {
    filenames,
    baseFileIndex,
    setBaseFileIndex,
    isProcessing,
    onFileChange,
    addFile,
    handleCompare,
  } = useCompareService();

  return (
    <>
      <form onSubmit={handleCompare} className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-semibold">Compare CSV Files</h1>

        <div className="space-y-4">
          {filenames.map((filename, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 shadow-sm transition-shadow duration-200 ${
                baseFileIndex === i ? "border-blue-500 bg-blue-50" : "hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <InputFile
                  label={`CSV File ${i + 1}`}
                  onChange={(file) => onFileChange(i, file)}
                />
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    name="baseFile"
                    checked={baseFileIndex === i}
                    onChange={() => setBaseFileIndex(i)}
                    disabled={!filenames[i]}
                    className="accent-primary"
                  />
                  <span>Base file</span>
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {filename || "No file selected"}
              </p>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={addFile}
            type="button"
            variant="outline"
            className="hover:bg-gray-100 transition-colors"
          >
            + Upload More
          </Button>

          <Button type="submit" className="hover:bg-primary/80 transition-colors">
            Compare
          </Button>
        </div>
      </form>

      <GoHome isProcessing={isProcessing} position="footer" />
    </>
  );
}
