"use client";
import { useState } from "react";
export function Avatar({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  return (
    <span className="avatar shrink-0 overflow-hidden" aria-hidden="true">
      {image && failed !== image ? (
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(image)}
        />
      ) : (
        name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase()
      )}
    </span>
  );
}
