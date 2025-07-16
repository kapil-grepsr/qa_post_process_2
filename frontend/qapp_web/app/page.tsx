import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800">Welcome Data Post Processing Tool</h1>

      <Link href={"/post-process"}>
      <Button className="px-6 py-3" variant="default">
        Post Process
      </Button>

      </Link>


        <Link href={"/data-compare"}>
        <Button  className="px-6 py-3" variant="default">
          Data Compare
        </Button>
      </Link>
    </div>
  );
}
