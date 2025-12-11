import { mode } from "@chakra-ui/theme-tools";
export const globalStyles = {
  colors: {
    brand: {
      100: "#E9E3FF",
      200: "#422AFB",
      300: "#422AFB",
      400: "#7551FF",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#11047A",
    },
    brandScheme: {
      100: "#E9E3FF",
      200: "#7551FF",
      300: "#7551FF",
      400: "#7551FF",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#02044A",
    },
    brandTabs: {
      100: "#E9E3FF",
      200: "#422AFB",
      300: "#422AFB",
      400: "#422AFB",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#02044A",
    },
    secondaryGray: {
      100: "#E0E5F2",
      200: "#E1E9F8",
      300: "#F4F7FE",
      400: "#E9EDF7",
      500: "#8F9BBA",
      600: "#A3AED0",
      700: "#707EAE",
      800: "#707EAE",
      900: "#1B2559",
    },
    red: {
      100: "#FEEFEE",
      500: "#EE5D50",
      600: "#E31A1A",
    },
    blue: {
      50: "#EFF4FB",
      500: "#3965FF",
    },
    orange: {
      100: "#FFF6DA",
      500: "#FFB547",
    },
    green: {
      100: "#E6FAF5",
      500: "#01B574",
    },
    navy: {
      50: "#e5e5e5", // Very light gray for headings on dark bg
      100: "#cfcfcf", // Light gray for subtext
      200: "#b3b3b3", // Muted body text
      300: "#999999", // Disabled text or muted UI
      400: "#7f7f7f", // Secondary border/labels
      500: "#666666", // Primary border, active elements
      600: "#333333", // Neutral surface, cards
      700: "#1f1f1f", // Sidebar, modal bg
      800: "#141414", // Main app background
      900: "#0a0a0a", // Deep black for headers/footers or extreme contrast
    },

    gray: {
      100: "#FAFCFE",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        overflowX: "hidden",
        bg: mode("secondaryGray.300", "navy.800")(props),
        fontFamily: "DM Sans",
        letterSpacing: "-0.5px",
      },
      ".pac-container": {
        zIndex: "2147483647 !important",
        position: "absolute !important",
      },
      input: {
        color: "gray.700",
      },
      td: {
        border: "none",
      },
      html: {
        fontFamily: "DM Sans",
      },
    }),
  },
};
export default globalStyles;
