"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { GoHome } from "@/components/ui/custom-ui/GoHome";
import { DTALE_API_URL } from "@/core/config/app";

const allMetrics = [
  { key: "totalCount", label: "Total Count" },
  { key: "fillRate", label: "Fill Rate (%)" },
  { key: "changePct", label: "Increase/Decrease (%)" },
  { key: "missingValues", label: "Missing Values" },
  { key: "columns", label: "Columns" },  // ← Added columns option here
];

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["totalCount", "fillRate"]);
  const [results, setResults] = useState<any>(null);
  const [columnsResults, setColumnsResults] = useState<Record<string, string[]> | null>(null);

  const filenames: string[] = [];
  for (let i = 0; i < 10; i++) {
    const file = searchParams.get(`file${i}`);
    if (file) filenames.push(file);
  }
  const baseFileIndex = Number(searchParams.get("base")) || 0;

  useEffect(() => {
    const storedResults = localStorage.getItem("compareResults");
    const storedColumns = localStorage.getItem("columnsResults");
    if (storedResults) setResults(JSON.parse(storedResults));
    if (storedColumns) setColumnsResults(JSON.parse(storedColumns));
  }, []);

  const onMetricToggle = (metricKey: string) => {
    setSelectedMetrics((current) =>
      current.includes(metricKey)
        ? current.filter((m) => m !== metricKey)
        : [...current, metricKey]
    );
  };

  const getMetricValue = (fileResult: any, metric: string) => {
    if (!fileResult) return "-";
    switch (metric) {
      case "totalCount":
        return `${fileResult.totalCount.rows} rows, ${fileResult.totalCount.columns} columns`;
      case "fillRate":
        return `${fileResult.fillRate}%`;
      case "changePct":
        return fileResult.changePct != null ? `${fileResult.changePct}%` : "-";
      case "missingValues":
        return "-";
      case "columns":
        // We won't call this here because columns are rendered as a list separately
        return "-";
      default:
        return "-";
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-semibold">Comparison Metrics</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              📊 Select Metrics
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Metrics to Show</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allMetrics.map((metric) => (
              <DropdownMenuCheckboxItem
                key={metric.key}
                checked={selectedMetrics.includes(metric.key)}
                onCheckedChange={() => onMetricToggle(metric.key)}
              >
                {metric.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedMetrics.length === 0 ? (
          <p className="text-gray-500 mt-4">Select metrics to display the table.</p>
        ) : results ? (
          <table className="w-full border border-gray-300 border-collapse mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Filename</th>
                {selectedMetrics.map((metricKey) => {
                  const metric = allMetrics.find((m) => m.key === metricKey);
                  return (
                    <th
                      key={metricKey}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {metric?.label}
                    </th>
                  );
                })}
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filenames.map((file, idx) => {
                const fileResult = results?.results.find((r: any) => r.filename === file);
                return (
                  <tr
                    key={file}
                    className={`hover:bg-gray-50 ${
                      idx === baseFileIndex ? "bg-blue-100 font-semibold" : ""
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-2">{file}</td>
                    {selectedMetrics.map((metricKey) => {
                      if (metricKey === "columns") {
                        return (
                          <td key="columns" className="border border-gray-300 px-4 py-2 text-xs text-gray-600 max-w-xs break-words">
                            {columnsResults?.[file]?.length
                              ? columnsResults[file].join(", ")
                              : "-"}
                          </td>
                        );
                      }
                      return (
                        <td key={metricKey} className="border border-gray-300 px-4 py-2">
                          {getMetricValue(fileResult, metricKey)}
                        </td>
                      );
                    })}
                    <td className="border border-gray-300 px-4 py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          if (!fileResult?.fileId) return;
                          const response = await fetch(
                            `${DTALE_API_URL}/open-cached?file_id=${encodeURIComponent(fileResult.fileId)}`
                          );
                          const data = await response.json();
                          window.open(data.dtale_url, "_blank");
                        }}
                      >
                        Open in D-Tale
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">No results available. Please try comparing again.</p>
        )}
      </div>
      <GoHome isProcessing={true} position="footer" />
    </>
  );
}
