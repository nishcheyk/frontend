// src/theme.ts

export const lightTheme = {
  colors: {
    background: "#fefefe",
    text: "#222",
    primary: "#ff0089",
    secondary: "#7928ca",
    accentBg: "#fff",
    accentBorder: "rgba(0,0,0,0.12)",
    textSecondary: "#555",
  },
};

export const darkTheme = {
  colors: {
    background: "#121212",
    text: "#eee",
    primary: "#ff0089",
    secondary: "#7928ca",
    accentBg: "#232323",
    accentBorder: "rgba(255,255,255,0.12)",
    textSecondary: "#bbb",
  },
};

// Export a type to use in styled.d.ts
export type ThemeType = typeof lightTheme;
