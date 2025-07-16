"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoHome } from "@/components/ui/custom-ui/GoHome";

export default function PostProcessPage() {
  const router = useRouter();

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Post Process</h1>

      <Button onClick={() => router.push("/post-process/concat")} className="px-6 py-3">
        Concat
      </Button>

      <Button onClick={() => router.push("/post-process/duplicates")} className="px-6 py-3">
        Duplicates
      </Button>
    </div>
    <GoHome isProcessing={true} position="footer" />
    </>
  );
}
