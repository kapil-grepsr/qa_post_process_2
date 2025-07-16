"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoHome } from "@/components/ui/custom-ui/GoHome";

export default function DataComparePage() {
  const router = useRouter();

  return (
    <>
    
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Compare</h1>

        <Button onClick={() => router.push("/data-compare/compare")} className="px-6 py-3">
          Compare CSV Files
        </Button>
         <Button onClick={() => router.push("/data-compare/dtale")} className="px-6 py-3">
          Dtale
        </Button>
      </div>
      <GoHome isProcessing={true} position="footer" />
    </>
  );
}
