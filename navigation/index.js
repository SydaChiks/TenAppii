import {
  ChatScreen,
  EditProfileScreen,
  // Messaging Screens
  GroupMessagesScreen,
  // Tenant Screens
  HomeScreen,
  LoginScreen,
  MaintenanceRequestScreen,
  MessagesScreen,
  NewsScreen,
  PaymentsScreen,
  ProfileScreen,
  RequestDetailsScreen,
  SignupScreen,
} from "../screens";

import {
  EditMaintenanceProfileScreen,
  MaintenanceChatScreen,
  MaintenanceDashboardScreen,
  MaintenanceJobsScreen,
  MaintenanceNewsScreen,
  MaintenanceProfileScreen,
} from "../screens/maintenance";

import {
  AdminDashboardScreen,
  AdminLeaseManagementScreen,
  AdminPaymentsScreen,
  AdminProfileScreen,
} from "../screens/admin";

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { UserProvider, useUser } from "../context/UserContext";

// Create navigators
const RootStack = createStackNavigator();
const MainBottomTab = createBottomTabNavigator();
const MessagesStack = createStackNavigator();

const getThemeStyles = (isDark) => ({
  // Existing styles
  background: isDark ? "bg-gray-900" : "bg-gray-50",
  text: isDark ? "text-white" : "text-gray-800",
  secondaryText: isDark ? "text-gray-300" : "text-gray-600",
  cardBackground: isDark ? "bg-gray-800" : "bg-white",
  headerBackground: isDark ? "bg-blue-900" : "bg-blue-500",
  searchBackground: isDark ? "bg-gray-700" : "bg-blue-400",
  searchPlaceholder: isDark ? "text-gray-300" : "text-white",
  filterButton: isDark ? "bg-gray-700" : "bg-gray-200",
  filterText: isDark ? "text-white" : "text-gray-800",
  activeFilterBackground: isDark ? "bg-blue-800" : "bg-blue-500",

  // Additional theme-specific styles
  inputBackground: isDark ? "bg-gray-700" : "bg-gray-100",
  inputText: isDark ? "text-white" : "text-gray-900",
  borderColor: isDark ? "border-gray-600" : "border-gray-300",
  shadowColor: isDark ? "shadow-gray-900" : "shadow-gray-300",
  accentBackground: isDark ? "bg-blue-900" : "bg-blue-100",
  accentText: isDark ? "text-blue-300" : "text-blue-700",

  // Bottom Navigation Specific Themes
  bottomNavBackground: isDark ? "bg-gray-800" : "bg-white",
  bottomNavBorder: isDark ? "border-gray-700" : "border-gray-200",
  bottomNavActiveIcon: isDark ? "text-blue-400" : "text-blue-600",
  bottomNavInactiveIcon: isDark ? "text-gray-500" : "text-gray-600",
});

// Loading Screen Component
const LoadingScreen = () => (
  <SafeAreaView style={tw`flex-1 items-center justify-center`}>
    <View style={tw`flex-col h-screen`}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={tw`mt-4 text-base`}>Loading...</Text>
    </View>
  </SafeAreaView>
);

// Messages Navigator (shared across roles)
const MessagesNavigator = () => (
  <MessagesStack.Navigator screenOptions={{ headerShown: false }}>
    <MessagesStack.Screen name="MessagesList" component={MessagesScreen} />
    <MessagesStack.Screen
      name="GroupMessages"
      component={GroupMessagesScreen}
    />
    <MessagesStack.Screen name="Chat" component={ChatScreen} />
  </MessagesStack.Navigator>
);

// Main Bottom Tab Navigator with role-based screen configuration
const MainBottomTabNavigator = ({ userRole }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeStyles = getThemeStyles(isDark);

  const themeColors = {
    activeColor: isDark ? "#3B82F6" : "#2563EB", // Blue shades for active state
    inactiveColor: isDark ? "#6B7280" : "#4B5563", // Gray shades for inactive state
  };
  console.log("Current role in tab navigator:", userRole);
  // Define screen configurations for different roles
  const roleScreenConfigs = {
    tenant: {
      Home: HomeScreen,
      News: NewsScreen,
      Payments: PaymentsScreen,
      Messages: MessagesNavigator,
      Profile: ProfileScreen,
    },
    maintenance: {
      Dashboard: MaintenanceDashboardScreen,
      Jobs: MaintenanceJobsScreen,
      News: MaintenanceNewsScreen,
      Messages: MaintenanceChatScreen,
      Profile: MaintenanceProfileScreen,
    },
    propertyOwner: {
      Dashboard: AdminDashboardScreen,
      Properties: AdminLeaseManagementScreen,
      Finances: AdminPaymentsScreen,
      Messages: MessagesNavigator,
      Profile: AdminProfileScreen,
    },
  };

  // Icon configurations for different tabs
  const iconMap = {
    tenant: {
      Home: ["home", "home-outline"],
      News: ["newspaper", "newspaper-outline"],
      Payments: ["card", "card-outline"],
      Messages: ["chatbubble", "chatbubble-outline"],
      Profile: ["person", "person-outline"],
    },
    maintenance: {
      Dashboard: ["grid", "grid-outline"],
      Jobs: ["build", "build-outline"],
      Schedule: ["calendar", "calendar-outline"],
      Messages: ["chatbubble", "chatbubble-outline"],
      Profile: ["person", "person-outline"],
      News: ["newspaper", "newspaper-outline"],
    },
    propertyOwner: {
      Dashboard: ["business", "business-outline"],
      Properties: ["home", "home-outline"],
      Finances: ["cash", "cash-outline"],
      Messages: ["chatbubble", "chatbubble-outline"],
      Profile: ["person", "person-outline"],
    },
  };

  return (
    <MainBottomTab.Navigator
      key={userRole}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const [focusedIcon, unfocusedIcon] = iconMap[userRole][route.name];
          const iconName = focused ? focusedIcon : unfocusedIcon;

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={
                focused ? themeColors.activeColor : themeColors.inactiveColor
              }
            />
          );
        },
        tabBarStyle: [
          tw`${themeStyles.bottomNavBackground} ${themeStyles.bottomNavBorder}`,
          {
            borderTopWidth: 1,
            borderTopColor: isDark ? "#374151" : "#E5E7EB",
          },
        ],
        tabBarActiveTintColor: themeColors.activeColor,
        tabBarInactiveTintColor: themeColors.inactiveColor,
        headerShown: false,
      })}
    >
      {Object.entries(roleScreenConfigs[userRole]).map(([name, component]) => (
        <MainBottomTab.Screen key={name} name={name} component={component} />
      ))}
    </MainBottomTab.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { userRole, isLoading } = useUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator
      key={userRole || "guest"}
      initialRouteName={userRole ? "MainApp" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {/* Authentication Screens */}
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Signup" component={SignupScreen} />

      {/* Main App Screen with Dynamic Tab Navigator */}
      <RootStack.Screen name="MainApp" options={{ gestureEnabled: false }}>
        {() =>
          userRole ? <MainBottomTabNavigator userRole={userRole} /> : null
        }
      </RootStack.Screen>

      {/* Additional Screens */}
      <RootStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
      <RootStack.Screen
        name="MaintenanceRequest"
        component={MaintenanceRequestScreen}
        options={{ title: "Maintenance Request" }}
      />

      <RootStack.Screen
        name="RequestDetails"
        component={RequestDetailsScreen}
        options={{ title: "Request Details" }}
      />

      <RootStack.Screen
        name="EditMaintenanceProfile"
        component={EditMaintenanceProfileScreen}
        options={{ title: "Edit Profile" }}
      />
    </RootStack.Navigator>
  );
};
// Main App Navigator
const AppNavigator = () => (
  <ThemeProvider>
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  </ThemeProvider>
);

export default AppNavigator;
