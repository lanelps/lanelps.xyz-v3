import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";

export interface RawImage {
  alt?: string;
  asset: {
    _ref: string;
  };
  url?: string;
  crop?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  mobile?: {
    asset: {
      _ref: string;
    };
  };
}

export interface Image {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  aspectRatio: number;
  placeholder: string;
  mobile?:
    | {
        src: string;
        srcset: string;
        sizes: string;
        width: number;
        height: number;
        aspectRatio: number;
        placeholder: string;
      }
    | undefined;
}

export interface Video {
  public_id: string;
  width: number;
  height: number;
  url: string;
}

export interface Media {
  _key?: string | undefined;
  type: "image" | "video";
  image?: RawImage;
  video?: Video;
  layout: "full" | "center" | "left" | "right";
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: RawImage;
  favicon?: RawImage;
}

export interface Project {
  _id: string;
  slug: { current: string };
  title: string;
  description: string;
  date?: string;
  categories?: string[];
  collaborators?: string[];
  software?: string[];
  cover: Media;
  gallery: Media[];
  seo?: SEO;
}

export interface Experiment {
  title: string;
  type: "video" | "image" | "text";
  size: "small" | "medium" | "large" | "xlarge";
  src?: string | ImageMetadata;
  link?: string;
  text?: string;
}

export type UrlFor = (
  imgRef: RawImage,
  options?: { quality?: number }
) => ImageUrlBuilder;

export type GetImageDimensions = (image: RawImage) => {
  width: number;
  height: number;
  aspectRatio: number;
};

export type GetRetinaSizes = (
  baseSizes: number[],
  imageWidth: number,
  maxWidth: number,
  minimumWidthStep: number
) => number[];

export type ProcessImage = (
  img: RawImage,
  maxWidth: number
) => {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  aspectRatio: number;
  placeholder: string;
};

export type GetImageProps = (props: {
  image: RawImage;
  maxWidth: number;
  minimumWidthStep?: number;
  customWidthSteps?: number[];
}) => Image;

export interface MuxVideo {
  asset: {
    playbackId: string;
    assetId: string;
    filename: string;
  };
}
