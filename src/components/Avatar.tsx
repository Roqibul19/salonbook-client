/* eslint-disable @next/next/no-img-element */

type AvatarProps = {
  name?: string | null;
  image?: string | null;
  size?: number;
};

export default function Avatar({ name, image, size = 36 }: AvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase() || "U";

  if (image) {
    return (
      <img
        src={image}
        alt={name || "User"}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className="rounded-full object-cover ring-2 ring-brand-100"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ring-2 ring-brand-100"
      style={{ width: size, height: size }}
    >
      {initial}
    </span>
  );
}
