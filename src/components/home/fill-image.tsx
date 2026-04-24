import Image from "next/image";

import type { ImageAsset } from "@/lib/home-content";

type FillImageProps = {
  image: ImageAsset;
  priority?: boolean;
  sizes?: string;
};

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
      className={`h-full w-full object-cover ${image.className ?? ""}`}
    />
  );
}
