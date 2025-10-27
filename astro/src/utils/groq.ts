export const image = `
    alt,
    asset {
        _ref,
    },
    "url": asset->url,
    crop {
        left,
        right,
        top,
        bottom,
    },
    hotspot {
        x,
        y,
        height,
        width,
    },
    mobile {
        asset {
            _ref,
        },
    },
`;

export const video = `
     asset -> {
        playbackId,
        assetId,
        filename,
      },
`;

export const media = `
    type,
    image {
        ${image}
    },
    video {
        ${video}
    },
    layout,
`;

export const seoSettings = `
    title,
    description,
    keywords,
    favicon {
        ${image}
    },
    image {
        ${image}
    },
`;

export const seoPage = `
    title,
    description,
    keywords,
    image {
        ${image}
    },
`;
