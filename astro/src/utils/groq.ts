export const image = `
    alt,
    asset {
        _ref,
    },
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
    public_id,
    width,
    height,
    "url": secure_url,
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
