import { User } from "lucide-react";
import Header from "@/components/common/Header";

export default function AccountPage() {
  return (
    <>
      <Header title="My Account" />
      <div className="container flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-4">
        <User className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold font-headline">Account Profile</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Manage your profile, saved items, and settings here soon.
        </p>
      </div>
    </>
  );
}
