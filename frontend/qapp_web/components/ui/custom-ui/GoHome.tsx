"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog";

export function GoHome({
  position = "footer",
  isProcessing = false
}: { position?: "navbar" | "footer"; isProcessing?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleGoHome = () => {
    router.push("/");  // redirect to home
  };

  return (
    <div className={
      position === "navbar"
        ? "w-full border-b p-4 flex justify-between items-center bg-white shadow-sm"
        : "fixed bottom-0 w-full border-t bg-white shadow flex justify-center items-center h-20"
    }>
      {isProcessing ? (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="hover:bg-gray-100 transition-colors">
              🏠 Go to Home
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                There is still a file under processing. Are you sure you want to go to the homepage?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleGoHome}>
                Yes, Go to Home
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Link href="/">
          <Button variant="outline" className="hover:bg-gray-100 transition-colors">
            🏠 Go to Home
          </Button>
        </Link>
      )}
    </div>
  );
}
