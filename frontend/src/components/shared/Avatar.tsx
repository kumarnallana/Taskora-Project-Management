export function Avatar({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  if (image) {
    return (
      <span className="avatar !p-0 overflow-hidden shrink-0 border border-line" aria-hidden="true">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // If image fails to load, hide image and fallback to initials
            e.currentTarget.style.display = "none";
          }}
        />
      </span>
    );
  }
  return (
    <span className="avatar shrink-0" aria-hidden="true">
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}
