import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";

export interface Image {
  asset: {
    _ref: string;
  };
  crop?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  mobile?: {
    asset: {
      _ref: string;
    };
    crop?: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  };
}

export interface ProjectType {
  id: number;
  title: string;
  category: string[];
  description: string;
  year: number;
}

export interface Project {
  slug: { current: string };
  title: string;
}

export type UrlFor = (
  imgRef: Image,
  options?: { quality?: number }
) => ImageUrlBuilder;

export type GetImageDimensions = (image: Image) => {
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
  img: Image,
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
  image: Image;
  maxWidth: number;
  minimumWidthStep?: number;
  customWidthSteps?: number[];
}) => {
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
};
