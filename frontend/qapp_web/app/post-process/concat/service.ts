import { CONCAT_API_URL } from "@/app/services/config";

// service.ts
export type FilesState = (File | null)[];

// Initialize files array with n nulls
export function initializeFiles(count: number): FilesState {
  return Array(count).fill(null);
}

// Add one null file to files array and increment count
export function addFile(fileCount: number, files: FilesState): { fileCount: number; files: FilesState } {
  return {
    fileCount: fileCount + 1,
    files: [...files, null],
  };
}

// Update file at a specific index
export function updateFile(files: FilesState, index: number, file: File | null): FilesState {
  const updated = [...files];
  updated[index] = file;
  return updated;
}

// Concatenate using backend FastAPI
export async function concatenateFiles(files: FilesState): Promise<string> {
  const formData = new FormData();

  // Filter out null files
  files.forEach((file) => {
    if (file) {
      formData.append('files', file);
    }
  });

  const res = await fetch(CONCAT_API_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to concatenate files");
  }

  const blob = await res.blob();
  console.log("Blob size:", blob.size);
  const url = URL.createObjectURL(blob);
  console.log("Download URL:", url);
  return URL.createObjectURL(blob); // this gives us a blob URL for download
}

// Navigate to check duplicates page

export function navigateToDuplicates(router: any, concatenatedFileUrl: string | null) {
  if (!concatenatedFileUrl) return;
  router.push(`/post-process/duplicates?file=${encodeURIComponent(concatenatedFileUrl)}`);
}

