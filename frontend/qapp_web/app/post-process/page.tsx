"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoHome } from "@/components/ui/custom-ui/GoHome";

export default function PostProcessPage() {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Post Process</h1>

        <div className="flex w-full max-w-md gap-4">
          <Button
            onClick={() => router.push("/post-process/concat")}
            className="w-full px-6 py-3"
            variant="default"
          >
            Concat
          </Button>

          <Button
            onClick={() => router.push("/post-process/duplicates")}
            className="w-full px-6 py-3"
            variant="default"
          >
            Duplicates
          </Button>
        </div>
      </div>
      <GoHome isProcessing={true} position="footer" />
    </>
  );
}
