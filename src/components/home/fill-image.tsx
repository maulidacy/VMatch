import Image from "next/image";

import type { ImageAsset } from "@/lib/home-content";

type FillImageProps = {
  image: ImageAsset;
  priority?: boolean;
  sizes?: string;
};

function isCloudinaryImage(src: string) {
  return src.startsWith("https://res.cloudinary.com");
}

export function FillImage({
  image,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: FillImageProps) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      unoptimized={isCloudinaryImage(image.src)}
      className={`h-full w-full object-cover ${image.className ?? ""}`}
    />
  );
}