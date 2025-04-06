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

const MaintenanceProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState(true);
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
    availabilityBg: isDark ? "bg-blue-900" : "bg-blue-50",
    jobCardBg: isDark ? "bg-gray-700" : "bg-white",
    toolAvailableBg: isDark ? "bg-green-900" : "bg-green-100",
    toolAvailableIcon: isDark ? "#81c784" : "#2ecc71",
    toolInUseBg: isDark ? "bg-yellow-900" : "bg-yellow-100",
    toolInUseIcon: isDark ? "#ffb74d" : "#e67e22",
    certificationBg: isDark ? "bg-blue-900" : "bg-blue-100",
    certificationIcon: isDark ? "#90caf9" : "#3498db",
    serviceAreaBg: isDark ? "bg-blue-900" : "bg-blue-50",
    serviceAreaText: isDark ? "text-blue-200" : "text-blue-700",
    notificationsIconBg: isDark ? "bg-orange-900" : "bg-orange-100",
    notificationsIconColor: isDark ? "#ffb74d" : "#e67e22",
    scheduleIconBg: isDark ? "bg-purple-900" : "bg-purple-100",
    scheduleIconColor: isDark ? "#ba68c8" : "#9c27b0",
    helpIconBg: isDark ? "bg-teal-900" : "bg-teal-100",
    helpIconColor: isDark ? "#4db6ac" : "#009688",
    logoutIconBg: isDark ? "bg-red-900" : "bg-red-100",
    logoutIconColor: isDark ? "#ef9a9a" : "#ef4444",
    switchTrack: isDark
      ? { false: "#4b5563", true: "#1e3a8a" }
      : { false: "#e5e7eb", true: "#dbeafe" },
    switchThumb: isDark
      ? notificationsEnabled
        ? "#3b82f6"
        : "#9ca3af"
      : notificationsEnabled
      ? "#3b82f6"
      : "#ffffff",
    chevronColor: isDark ? "#777" : "#999",
    shadowColor: isDark ? "shadow-gray-900" : "shadow-gray-300",
  };

  const handleEditProfile = () => {
    navigation.navigate("EditMaintenanceProfile", { userData: userData });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    setTimeout(() => {
      setUserData({
        fullName: "Michael Rodriguez",
        email: "michael.maintenance@example.com",
        profileImage: "https://dummyjson.com/image/150",
        role: "Maintenance Technician",
        specialization: "HVAC and Electrical Systems",
        yearsOfExperience: 7,
        certifications: ["HVAC Certified", "Electrical License"],
        serviceAreas: ["Residential", "Commercial"],
        completedJobs: 142,
        rating: 4.8,
        currentJobs: [
          { id: 1, title: "AC Repair - Apt 305", status: "In Progress" },
          { id: 2, title: "Plumbing - Apt 412", status: "Scheduled" },
        ],
        tools: [
          { id: 1, name: "Multimeter", status: "Available" },
          { id: 2, name: "Pipe Wrench", status: "In Use" },
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

  const handleViewJobs = () => {
    navigation.navigate("MaintenanceJobs");
  };

  const handleViewTools = () => {
    Alert.alert("Tools Inventory", "This would show your tools inventory");
  };

  const handleViewCertifications = () => {
    Alert.alert(
      "Certifications",
      "This would show your professional certifications"
    );
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
          <Text style={tw`text-3xl font-bold text-white`}>My Profile</Text>
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
              source={{ uri: userData.profileImage }}
              style={tw`w-24 h-24 rounded-full`}
            />
          </View>

          <Text style={tw`text-xl font-bold ${styles.textColor} mt-2`}>
            {userData.fullName}
          </Text>
          <Text style={tw`text-base ${styles.subtextColor} mb-1`}>
            {userData.role}
          </Text>
          <Text style={tw`text-sm ${styles.subtextColor} mb-4`}>
            {userData.specialization}
          </Text>

          {/* Rating and Jobs */}
          <View style={tw`flex-row items-center mb-3`}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={tw`${styles.textColor} ml-1 mr-3`}>
              {userData.rating} ({userData.completedJobs} jobs)
            </Text>
            <Ionicons
              name="briefcase-outline"
              size={16}
              color={isDark ? "#9ca3af" : "#4b5563"}
            />
            <Text style={tw`${styles.textColor} ml-1`}>
              {userData.yearsOfExperience} years experience
            </Text>
          </View>

          {/* Availability Toggle */}
          <View
            style={tw`flex-row items-center ${styles.availabilityBg} rounded-full px-4 py-2`}
          >
            <Text style={tw`${styles.textColor} mr-2`}>
              {availabilityStatus ? "Available" : "Unavailable"}
            </Text>
            <Switch
              value={availabilityStatus}
              onValueChange={setAvailabilityStatus}
              trackColor={styles.switchTrack}
              thumbColor={
                availabilityStatus ? "#3b82f6" : isDark ? "#9ca3af" : "#ffffff"
              }
            />
          </View>
        </View>

        {/* Current Jobs Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-xl font-bold ${styles.textColor}`}>
              Current Jobs
            </Text>
            <TouchableOpacity onPress={handleViewJobs}>
              <Text style={tw`text-blue-500 font-medium`}>View All</Text>
            </TouchableOpacity>
          </View>

          {userData.currentJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={tw`${styles.jobCardBg} rounded-xl p-4 mb-3 shadow-sm`}
              onPress={() =>
                navigation.navigate("RequestDetails", { requestId: job.id })
              }
            >
              <View style={tw`flex-row items-center`}>
                <View
                  style={tw`p-2 mr-3 ${
                    job.status === "In Progress"
                      ? "bg-yellow-100"
                      : "bg-blue-100"
                  } rounded-full`}
                >
                  <Ionicons
                    name="construct-outline"
                    size={22}
                    color={job.status === "In Progress" ? "#e67e22" : "#3498db"}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-semibold ${styles.textColor}`}>
                    {job.title}
                  </Text>
                  <Text style={tw`${styles.subtextColor} text-sm`}>
                    {job.status}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={styles.chevronColor}
                />
              </View>
            </TouchableOpacity>
          ))}

          {userData.currentJobs.length === 0 && (
            <View
              style={tw`${styles.cardBackground} rounded-xl p-6 items-center shadow-sm`}
            >
              <Ionicons
                name="checkmark-done-circle-outline"
                size={40}
                color={styles.subtextColor}
              />
              <Text style={tw`${styles.subtextColor} mt-2`}>
                No active jobs
              </Text>
            </View>
          )}
        </View>

        {/* Tools Inventory Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-xl font-bold ${styles.textColor}`}>
              Tools Inventory
            </Text>
            <TouchableOpacity onPress={handleViewTools}>
              <Text style={tw`text-blue-500 font-medium`}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`${styles.cardBackground} rounded-xl p-4 shadow-sm`}>
            {userData.tools.map((tool) => (
              <View
                key={tool.id}
                style={tw`flex-row items-center py-3 border-b ${styles.borderColor}`}
              >
                <View
                  style={tw`p-2 mr-3 ${
                    tool.status === "Available"
                      ? styles.toolAvailableBg
                      : styles.toolInUseBg
                  } rounded-full`}
                >
                  <Ionicons
                    name="hammer-outline"
                    size={20}
                    color={
                      tool.status === "Available"
                        ? styles.toolAvailableIcon
                        : styles.toolInUseIcon
                    }
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {tool.name}
                  </Text>
                  <Text style={tw`${styles.subtextColor} text-xs`}>
                    {tool.status}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={tw`flex-row items-center justify-center mt-3`}
              onPress={handleViewTools}
            >
              <Text style={tw`text-blue-500 font-medium`}>View All Tools</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Certifications Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
            Certifications
          </Text>

          <View style={tw`${styles.cardBackground} rounded-xl p-4 shadow-sm`}>
            {userData.certifications.map((cert, index) => (
              <View
                key={index}
                style={tw`flex-row items-center py-3 border-b ${styles.borderColor}`}
              >
                <View
                  style={tw`p-2 mr-3 ${styles.certificationBg} rounded-full`}
                >
                  <Ionicons
                    name="ribbon-outline"
                    size={20}
                    color={styles.certificationIcon}
                  />
                </View>
                <Text style={tw`font-medium ${styles.textColor}`}>{cert}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={tw`flex-row items-center justify-center mt-3`}
              onPress={handleViewCertifications}
            >
              <Text style={tw`text-blue-500 font-medium`}>
                View All Certifications
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Areas Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
            Service Areas
          </Text>

          <View style={tw`${styles.cardBackground} rounded-xl p-4 shadow-sm`}>
            <View style={tw`flex-row flex-wrap`}>
              {userData.serviceAreas.map((area, index) => (
                <View
                  key={index}
                  style={tw`${styles.serviceAreaBg} px-3 py-1 rounded-full mr-2 mb-2`}
                >
                  <Text style={tw`${styles.serviceAreaText} text-sm`}>
                    {area}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
          Settings
        </Text>

        {/* Notifications */}
        <View
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
        >
          <View style={tw`p-2 mr-3 ${styles.notificationsIconBg} rounded-full`}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={styles.notificationsIconColor}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>
            Job Notifications
          </Text>
          <View style={tw`flex-1`}></View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={styles.switchTrack}
            thumbColor={styles.switchThumb}
          />
        </View>

        {/* Work Schedule */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() => Alert.alert("Schedule", "Edit work schedule")}
        >
          <View style={tw`p-2 mr-3 ${styles.scheduleIconBg} rounded-full`}>
            <Ionicons
              name="calendar-outline"
              size={22}
              color={styles.scheduleIconColor}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>Work Schedule</Text>
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
          onPress={() => Alert.alert("Help", "Contact support")}
        >
          <View style={tw`p-2 mr-3 ${styles.helpIconBg} rounded-full`}>
            <Ionicons
              name="help-buoy-outline"
              size={22}
              color={styles.helpIconColor}
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
              color={styles.logoutIconColor}
            />
          </View>
          <Text style={tw`text-base text-red-500`}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MaintenanceProfileScreen;
