"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoHome } from "@/components/ui/custom-ui/GoHome";

export default function DataComparePage() {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Data Compare
        </h1>

        <div className="flex w-full max-w-md gap-4">
          <Button
            onClick={() => router.push("/data-compare/compare")}
            className="w-full px-6 py-3"
            variant="default"
          >
            Compare CSV Files
          </Button>

          <Button
            onClick={() => router.push("/data-compare/dtale")}
            className="w-full px-6 py-3"
            variant="default"
          >
            Dtale
          </Button>
        </div>
      </div>
      <GoHome isProcessing={true} position="footer" />
    </>
  );
}
