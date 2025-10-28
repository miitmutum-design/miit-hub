import { Map as MapIcon } from "lucide-react";
import Header from "@/components/common/Header";

export default function MapPage() {
  return (
    <>
      <Header title="Map View" />
      <div className="container flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-4">
        <MapIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold font-headline">Map View</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          An interactive map to explore local businesses will be available here soon.
        </p>
      </div>
    </>
  );
}
