import { MessageCircle } from "lucide-react";
import Header from "@/components/common/Header";

export default function ChatPage() {
  return (
    <>
      <Header title="Chat" />
      <div className="container flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-4">
        <MessageCircle className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold font-headline">Direct Messaging</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          A secure channel to connect with local businesses directly will be implemented soon.
        </p>
      </div>
    </>
  );
}
