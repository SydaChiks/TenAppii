import React, { useEffect, useState } from "react";
import { Appearance } from "react-native";

// Create a ThemeContext with default values
export const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
  followSystem: true,
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const systemTheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");
  const [followSystem, setFollowSystem] = useState(true);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (followSystem) {
        setTheme(colorScheme || "light");
      }
    });

    return () => subscription.remove();
  }, [followSystem]);

  // Toggle theme function
  const toggleTheme = () => {
    // If currently following system, switch to manual mode and toggle
    if (followSystem) {
      setFollowSystem(false);
      setTheme(theme === "dark" ? "light" : "dark");
    } else {
      // If already in manual mode, just toggle
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // Toggle between manual and system mode
  const toggleFollowSystem = () => {
    if (!followSystem) {
      setFollowSystem(true);
      setTheme(systemTheme || "light");
    } else {
      setFollowSystem(false);
    }
  };

  // Context value with all theme-related states and functions
  const contextValue = {
    theme,
    toggleTheme,
    followSystem,
    toggleFollowSystem,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
