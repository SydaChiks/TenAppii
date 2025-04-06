import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";

const AdminProfileScreen = ({ navigation }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const { refreshUserRole } = useUser();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-100",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    headerBackground: isDark ? "bg-blue-800" : "bg-blue-500",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-gray-800",
    subtextColor: isDark ? "text-gray-400" : "text-gray-600",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    dividerColor: isDark ? "bg-gray-700" : "bg-gray-200",
    iconBackground: isDark ? "bg-blue-900" : "bg-blue-100",
    iconColor: isDark ? "#90caf9" : "#3498db",
    editButtonBg: isDark ? "bg-blue-700" : "bg-blue-400",
    profileImageBg: isDark ? "bg-blue-900" : "bg-blue-100",
    emergencyBg: isDark ? "bg-red-900" : "bg-red-50",
    emergencyText: isDark ? "text-red-300" : "text-red-600",
    emergencyIcon: isDark ? "#ef9a9a" : "#ef4444",
    propertyIconBg: isDark ? "bg-blue-900" : "bg-blue-100",
    propertyIcon: isDark ? "#90caf9" : "#3498db",
    activityIconBg: isDark ? "bg-gray-700" : "bg-gray-100",
    activityIcon: isDark ? "#b0bec5" : "#6b7280",
    reportsIconBg: isDark ? "bg-purple-900" : "bg-purple-100",
    reportsIcon: isDark ? "#ba68c8" : "#9c27b0",
    staffIconBg: isDark ? "bg-green-900" : "bg-green-100",
    staffIcon: isDark ? "#81c784" : "#2ecc71",
    settingsIconBg: isDark ? "bg-blue-900" : "bg-blue-100",
    settingsIcon: isDark ? "#90caf9" : "#3498db",
    notificationsIconBg: isDark ? "bg-orange-900" : "bg-orange-100",
    notificationsIcon: isDark ? "#ffb74d" : "#e67e22",
    darkModeIconBg: isDark ? "bg-gray-700" : "bg-gray-100",
    darkModeIcon: isDark ? "#b0bec5" : "#4b5563",
    helpIconBg: isDark ? "bg-teal-900" : "bg-teal-100",
    helpIcon: isDark ? "#4db6ac" : "#009688",
    logoutIconBg: isDark ? "bg-red-900" : "bg-red-100",
    logoutIcon: isDark ? "#ef9a9a" : "#ef4444",
    switchTrack: isDark
      ? { false: "#4b5563", true: "#1e3a8a" }
      : { false: "#e5e7eb", true: "#dbeafe" },
    emergencySwitchTrack: isDark
      ? { false: "#4b5563", true: "#7f1d1d" }
      : { false: "#e5e7eb", true: "#fee2e2" },
    switchThumb: isDark
      ? notificationsEnabled
        ? "#3b82f6"
        : "#9ca3af"
      : notificationsEnabled
      ? "#3b82f6"
      : "#ffffff",
    emergencySwitchThumb: isDark
      ? emergencyMode
        ? "#ef4444"
        : "#9ca3af"
      : emergencyMode
      ? "#ef4444"
      : "#ffffff",
    chevronColor: isDark ? "#777" : "#999",
    shadowColor: isDark ? "shadow-gray-900" : "shadow-gray-300",
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = () => {
    setTimeout(() => {
      setAdminData({
        fullName: "Sarah Williams",
        email: "sarah.admin@example.com",
        profileImage: "https://dummyjson.com/image/150",
        role: "Property Administrator",
        propertiesManaged: 8,
        tenantsManaged: 42,
        maintenanceStaff: 5,
        properties: [
          { id: 1, name: "Sunset Apartments", location: "123 Main St" },
          { id: 2, name: "Pineview Complex", location: "456 Oak Ave" },
        ],
        recentActivities: [
          { id: 1, action: "Approved lease renewal", time: "2 hours ago" },
          { id: 2, action: "Processed payment", time: "Yesterday" },
          { id: 3, action: "Assigned maintenance", time: "2 days ago" },
        ],
      });
      setLoading(false);
    }, 1000);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("currentUser");
              await refreshUserRole();
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Logout Error", "An unexpected error occurred");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditAdminProfile", { adminData });
  };

  const handleViewProperties = () => {
    navigation.navigate("AdminProperties");
  };

  const handleViewStaff = () => {
    navigation.navigate("AdminStaffManagement");
  };

  const toggleEmergencyMode = () => {
    if (!emergencyMode) {
      Alert.alert(
        "Enable Emergency Mode?",
        "This will notify all staff and tenants of an emergency situation.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Enable",
            style: "destructive",
            onPress: () => setEmergencyMode(true),
          },
        ]
      );
    } else {
      setEmergencyMode(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 ${styles.background}`}>
        <View style={tw`flex items-center justify-center h-full`}>
          <Text style={tw`${styles.subtextColor}`}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={styles.statusBarStyle}
        backgroundColor={styles.statusBarColor}
      />

      {/* Header with blue background */}
      <View style={tw`${styles.headerBackground} p-6 pt-4 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-3xl font-bold text-white`}>Admin Profile</Text>
          <TouchableOpacity
            style={tw`p-2 ${styles.editButtonBg} rounded-full`}
            onPress={handleEditProfile}
          >
            <Ionicons name="pencil-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={tw`flex-1 px-4 -mt-10`}>
        {/* Profile Card */}
        <View
          style={tw`${styles.cardBackground} rounded-xl p-6 flex items-center mb-6 shadow-lg`}
        >
          <View style={tw`${styles.profileImageBg} p-2 rounded-full mb-2`}>
            <Image
              source={{ uri: adminData.profileImage }}
              style={tw`w-24 h-24 rounded-full`}
            />
          </View>

          <Text style={tw`text-xl font-bold ${styles.textColor} mt-2`}>
            {adminData.fullName}
          </Text>
          <Text style={tw`text-base ${styles.subtextColor} mb-1`}>
            {adminData.role}
          </Text>
          <Text style={tw`text-sm ${styles.subtextColor} mb-4`}>
            {adminData.email}
          </Text>

          {/* Admin Stats */}
          <View style={tw`w-full border-t ${styles.borderColor} my-2 pt-4`}>
            <View style={tw`flex-row justify-around w-full`}>
              <View style={tw`flex items-center`}>
                <Text style={tw`${styles.subtextColor} text-xs`}>
                  Properties
                </Text>
                <Text style={tw`text-lg font-bold ${styles.textColor}`}>
                  {adminData.propertiesManaged}
                </Text>
              </View>

              <View style={tw`h-12 w-px ${styles.dividerColor}`}></View>

              <View style={tw`flex items-center`}>
                <Text style={tw`${styles.subtextColor} text-xs`}>Tenants</Text>
                <Text style={tw`text-lg font-bold ${styles.textColor}`}>
                  {adminData.tenantsManaged}
                </Text>
              </View>

              <View style={tw`h-12 w-px ${styles.dividerColor}`}></View>

              <View style={tw`flex items-center`}>
                <Text style={tw`${styles.subtextColor} text-xs`}>Staff</Text>
                <Text style={tw`text-lg font-bold ${styles.textColor}`}>
                  {adminData.maintenanceStaff}
                </Text>
              </View>
            </View>
          </View>

          {/* Emergency Mode Toggle */}
          <View
            style={tw`flex-row items-center mt-4 ${styles.emergencyBg} rounded-full px-4 py-2`}
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={emergencyMode ? styles.emergencyIcon : styles.subtextColor}
            />
            <Text
              style={tw`ml-2 ${
                emergencyMode
                  ? `${styles.emergencyText} font-bold`
                  : styles.textColor
              }`}
            >
              Emergency Mode
            </Text>
            <Switch
              value={emergencyMode}
              onValueChange={toggleEmergencyMode}
              trackColor={styles.emergencySwitchTrack}
              thumbColor={styles.emergencySwitchThumb}
              style={tw`ml-2`}
            />
          </View>
        </View>

        {/* Managed Properties Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-xl font-bold ${styles.textColor}`}>
              Managed Properties
            </Text>
            <TouchableOpacity onPress={handleViewProperties}>
              <Text style={tw`text-blue-500 font-medium`}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`${styles.cardBackground} rounded-xl p-4 shadow-sm`}>
            {adminData.properties.map((property) => (
              <TouchableOpacity
                key={property.id}
                style={tw`flex-row items-center py-3 border-b ${styles.borderColor}`}
                onPress={() =>
                  navigation.navigate("PropertyDetails", {
                    propertyId: property.id,
                  })
                }
              >
                <View
                  style={tw`p-2 mr-3 ${styles.propertyIconBg} rounded-full`}
                >
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={styles.propertyIcon}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {property.name}
                  </Text>
                  <Text style={tw`${styles.subtextColor} text-xs`}>
                    {property.location}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={styles.chevronColor}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={tw`flex-row items-center justify-center mt-3`}
              onPress={handleViewProperties}
            >
              <Text style={tw`text-blue-500 font-medium`}>
                View All Properties
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
            Recent Activities
          </Text>

          <View style={tw`${styles.cardBackground} rounded-xl p-4 shadow-sm`}>
            {adminData.recentActivities.map((activity) => (
              <View
                key={activity.id}
                style={tw`flex-row items-center py-3 border-b ${styles.borderColor}`}
              >
                <View
                  style={tw`p-2 mr-3 ${styles.activityIconBg} rounded-full`}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={styles.activityIcon}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {activity.action}
                  </Text>
                  <Text style={tw`${styles.subtextColor} text-xs`}>
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={tw`flex-row items-center justify-center mt-3`}
              onPress={() => navigation.navigate("AdminActivityLog")}
            >
              <Text style={tw`text-blue-500 font-medium`}>View Full Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin Tools Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
            Admin Tools
          </Text>

          <View style={tw`${styles.cardBackground} rounded-xl p-4 shadow-sm`}>
            <TouchableOpacity
              style={tw`flex-row items-center py-3 border-b ${styles.borderColor}`}
              onPress={() => navigation.navigate("AdminReports")}
            >
              <View style={tw`p-2 mr-3 ${styles.reportsIconBg} rounded-full`}>
                <Ionicons
                  name="stats-chart-outline"
                  size={20}
                  color={styles.reportsIcon}
                />
              </View>
              <Text style={tw`font-medium ${styles.textColor}`}>
                Generate Reports
              </Text>
              <View style={tw`flex-1`}></View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={styles.chevronColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center py-3 border-b ${styles.borderColor}`}
              onPress={handleViewStaff}
            >
              <View style={tw`p-2 mr-3 ${styles.staffIconBg} rounded-full`}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={styles.staffIcon}
                />
              </View>
              <Text style={tw`font-medium ${styles.textColor}`}>
                Manage Staff
              </Text>
              <View style={tw`flex-1`}></View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={styles.chevronColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center py-3`}
              onPress={() => navigation.navigate("AdminSettings")}
            >
              <View style={tw`p-2 mr-3 ${styles.settingsIconBg} rounded-full`}>
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={styles.settingsIcon}
                />
              </View>
              <Text style={tw`font-medium ${styles.textColor}`}>
                System Settings
              </Text>
              <View style={tw`flex-1`}></View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={styles.chevronColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
          Preferences
        </Text>

        {/* Notifications */}
        <View
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
        >
          <View style={tw`p-2 mr-3 ${styles.notificationsIconBg} rounded-full`}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={styles.notificationsIcon}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>Notifications</Text>
          <View style={tw`flex-1`}></View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={styles.switchTrack}
            thumbColor={styles.switchThumb}
          />
        </View>

        {/* Dark Mode */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() => navigation.navigate("AppearanceSettings")}
        >
          <View style={tw`p-2 mr-3 ${styles.darkModeIconBg} rounded-full`}>
            <Ionicons
              name="moon-outline"
              size={22}
              color={styles.darkModeIcon}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>Dark Mode</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={styles.chevronColor}
          />
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() => navigation.navigate("AdminSupport")}
        >
          <View style={tw`p-2 mr-3 ${styles.helpIconBg} rounded-full`}>
            <Ionicons
              name="help-buoy-outline"
              size={22}
              color={styles.helpIcon}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>Help & Support</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={styles.chevronColor}
          />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-8 shadow-sm`}
          onPress={handleLogout}
        >
          <View style={tw`p-2 mr-3 ${styles.logoutIconBg} rounded-full`}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color={styles.logoutIcon}
            />
          </View>
          <Text style={tw`text-base text-red-500`}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminProfileScreen;
