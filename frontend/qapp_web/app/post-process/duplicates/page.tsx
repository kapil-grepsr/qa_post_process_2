// app/duplicates/page.tsx
import React, { Suspense } from "react";
import DuplicatesService from "./DuplicatesService";

export default function DuplicatesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DuplicatesService />
    </Suspense>
  );
}
