import { Cloudinary } from "@cloudinary/url-gen";
import {
  quality,
  format,
} from "@cloudinary/transformation-builder-sdk/actions/delivery";
import { limitFit } from "@cloudinary/transformation-builder-sdk/actions/resize";

import type { GenerateCloudinaryVideoURL } from "../types";

const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;

const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
  url: {
    secure: true,
  },
});

const defaultOptions = {
  width: 960,
  quality: "auto:best",
};

export const generateCloudinaryVideoURL: GenerateCloudinaryVideoURL = (
  publicId,
  options
) => {
  options = { ...defaultOptions, ...options };

  let myVideo = cld?.video(publicId);

  if (options?.width) {
    myVideo = myVideo.resize(limitFit().width(options.width));
  }
  if (options?.quality) {
    myVideo = myVideo.delivery(quality(options.quality));
  }
  if (options?.format) {
    myVideo = myVideo.delivery(format(options.format));
  }

  return myVideo?.toURL();
};
