import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserRole = async () => {
    try {
      setIsLoading(true);
      const currentUser = await AsyncStorage.getItem("currentUser");
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        setUserRole(parsedUser.role);
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserRole();
  }, []);

  return (
    <UserContext.Provider value={{ userRole, isLoading, refreshUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
