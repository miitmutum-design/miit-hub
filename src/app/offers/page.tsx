import { Ticket } from "lucide-react";
import Header from "@/components/common/Header";

export default function OffersPage() {
  return (
    <>
      <Header title="Offers" />
      <div className="container flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-4">
        <Ticket className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold font-headline">Offers & Events</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Browse local deals, special offers, and community events here soon.
        </p>
      </div>
    </>
  );
}
