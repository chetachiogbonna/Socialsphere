import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function Loader({ className }: { className?: string }) {
  return (
    <div className="w-full">  
      <Loader2 size={30} className={cn("animate-spin text-blue", className)} />
    </div>
  );
}

export default Loader;