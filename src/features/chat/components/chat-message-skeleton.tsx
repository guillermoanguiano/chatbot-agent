import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatMessageSkeleton({
  direction = "left",
}: {
  direction?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex w-full relative",
        direction === "right" ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(direction === "left" && "flex", "")}>
        {/* {direction === "left" && (
          <Avatar>
            <Skeleton className="h-10 w-10 rounded-full" />
          </Avatar>
        )} */}
        <div
          className={cn(
            "relative rounded-3xl group",
            direction === "right"
              ? "bg-muted p-4"
              : "border-[0.5px] dark:border-none bg"
          )}
        >
          <div className="space-y-2 ">
            <Skeleton className="h-4 w-[250px] bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
