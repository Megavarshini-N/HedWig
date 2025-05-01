
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export function Loader({
  size = "md",
  text,
  fullScreen = false,
  className,
  ...props
}: LoaderProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50" : "",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("text-primary animate-spin mb-2", sizeMap[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function SkeletonLoader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted/50", className)} {...props} />
  );
}

export function CardSkeleton() {
  return (
    <div className="event-card">
      <div className="h-40 skeleton rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 skeleton rounded-md" />
        <div className="space-y-2">
          <div className="h-3 w-1/2 skeleton rounded-md" />
          <div className="h-3 w-2/3 skeleton rounded-md" />
          <div className="h-3 w-1/2 skeleton rounded-md" />
        </div>
        <div className="h-8 w-full skeleton rounded-md mt-2" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full skeleton" />
        <div className="space-y-2">
          <div className="h-4 w-32 skeleton rounded-md" />
          <div className="h-3 w-24 skeleton rounded-md" />
        </div>
      </div>
      <div className="h-32 w-full skeleton rounded-xl" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-20 w-full skeleton rounded-lg" />
        <div className="h-20 w-full skeleton rounded-lg" />
      </div>
    </div>
  );
}
