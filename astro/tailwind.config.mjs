/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import textStrokePlugin from "./src/utils/tailwindcss/plugins/text-stroke.ts";

const createTailWindGrid = (size = 12) => {
  const gridSpan = { "span-full": `1 / -1` };
  const gridColumns = { full: `-1` };

  Array(size)
    .fill(null)
    .forEach((_, index) => {
      const itemIndex = index + 1;
      gridSpan[`span-${itemIndex}`] = `span ${itemIndex} / span ${itemIndex}`;
      gridColumns[itemIndex] = `${itemIndex}`;
    });

  return { gridSpan, gridColumns };
};

const spacing = (length = 200, base = 0.25, increment = 0.5) => {
  const spacing = {
    0: `0`,
    "1/2": `${100 / 2}%`,
    "1/3": `${100 / 3}%`,
    "2/3": `${(100 / 3) * 2}%`,
    "1/4": `${100 / 4}%`,
    "3/4": `${(100 / 4) * 3}%`,
    "1/6": `${100 / 6}%`,
    "5/6": `${(100 / 6) * 5}%`,
    "1/8": `${100 / 8}%`,
    "1/10": `${100 / 10}%`,
    full: "100%",
  };

  Array(length)
    .fill(null)
    .forEach((_, index) => {
      const newIndex = index * increment;
      const value = base * newIndex;
      spacing[newIndex] = `${value}rem`;
    });

  return spacing;
};

const { gridSpan, gridColumns } = createTailWindGrid();

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      "xxl-d": `1920px`,
      "xl-d": `1728px`,
      "lg-d": `1512px`,
      "md-d": `1440px`,
      "sm-d": `1280px`,
      //
      "lg-t": `1024px`,
      "md-t": `834px`,
      "sm-t": `744px`,
      //
      "lg-m": `428px`,
      "md-m": `414px`,
      "sm-m": `360px`,
      "xs-m": `320px`,
    },
    gridColumn: gridSpan,
    gridColumnStart: gridColumns,
    gridColumnEnd: gridColumns,
    spacing: spacing(),
    extend: {
      fontFamily: {
        main: ["Helvetica Neue", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "deep-purple": {
          DEFAULT: "#141420",
          invert: "#EBEBDF",
        },
        "off-white": {
          DEFAULT: "#F6F6F6",
          invert: "#090909",
        },
        "light-grey": {
          DEFAULT: "#D6D6D6",
          invert: "#292929",
        },
        grey: {
          DEFAULT: "#B1B1B1",
          invert: "#4E4E4E",
        },
        "dark-grey": {
          DEFAULT: "#1C1C1C",
          invert: "#E3E3E3",
        },
        blue: {
          DEFAULT: "#0019FF",
          invert: "#D6BD29",
        },
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      keyframes: {
        "logo-load-initial": {
          "0%": {
            color: "#d6bd29",
          },
          "66.66%": {
            color: "#d6bd29",
          },
          "100%": {
            color: "#4e4e4e",
          },
        },
        "logo-load": {
          "0%": {
            color: "#d6bd29",
            opacity: 1,
          },
          "33.33%": {
            opacity: 1,
          },
          "66.66%": {
            opacity: 0,
          },
        },
      },
      animation: {
        "logo-load-initial": "logo-load-initial 3s forwards",
        "logo-load": "logo-load 3s forwards",
      },
    },
  },
  plugins: [textStrokePlugin],
};
