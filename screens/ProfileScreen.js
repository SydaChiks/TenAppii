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
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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
    textColor: isDark ? "text-white" : "text-black",
    subtextColor: isDark ? "text-gray-400" : "text-gray-500",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    dividerColor: isDark ? "bg-gray-700" : "bg-gray-200",
    iconBackground: isDark ? "bg-blue-900" : "bg-blue-100",
    iconColor: isDark ? "#90caf9" : "#3498db",
    editButtonBg: isDark ? "bg-blue-700" : "bg-blue-400",
    profileImageBg: isDark ? "bg-blue-900" : "bg-blue-100",
    settingsIconBg: isDark ? "bg-gray-700" : "bg-gray-100",
    notificationsIconBg: isDark ? "bg-orange-900" : "bg-orange-100",
    notificationsIconColor: isDark ? "#ffb74d" : "#e67e22",
    privacyIconBg: isDark ? "bg-green-900" : "bg-green-100",
    privacyIconColor: isDark ? "#81c784" : "#2ecc71",
    paymentIconBg: isDark ? "bg-purple-900" : "bg-purple-100",
    paymentIconColor: isDark ? "#ba68c8" : "#9c27b0",
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    setTimeout(() => {
      setUserData({
        fullName: "John Doe",
        email: "john.doe@example.com",
        profileImage: "https://dummyjson.com/image/150",
        tenancyMonths: 12,
        unitNumber: "301",
        leaseRenewalDate: "2025-06-30",
        leaseDocuments: [
          { id: 1, name: "Lease Agreement 2024-2025", date: "2024-07-01" },
          { id: 2, name: "Lease Addendum - Parking", date: "2024-07-15" },
          { id: 3, name: "Pet Policy Amendment", date: "2024-08-22" },
        ],
      });
      setLoading(false);
    }, 1000);
  };

  const handleLogout = async (navigation) => {
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
              navigation.navigate("Login");
              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              }, 100);
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert(
                "Logout Error",
                "An unexpected error occurred during logout"
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { userData: userData });
  };

  const handleViewLeaseDocuments = () => {
    Alert.alert(
      "Lease Documents",
      "This would navigate to the Lease Documents screen."
    );
  };

  const handleRenewLease = () => {
    Alert.alert(
      "Lease Renewal",
      "Your lease is eligible for renewal. Would you like to start the renewal process?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Start Renewal",
          onPress: () => {
            Alert.alert(
              "Success",
              "Your lease renewal request has been submitted. A property manager will contact you shortly."
            );
          },
        },
      ],
      { cancelable: true }
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
          <Text style={tw`text-3xl font-bold text-white`}>Profile</Text>
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

          <Text style={tw`text-xl font-bold mt-2 ${styles.textColor}`}>
            {userData.fullName}
          </Text>
          <Text style={tw`text-base ${styles.subtextColor} mb-4`}>
            {userData.email}
          </Text>

          <View style={tw`w-full border-t ${styles.borderColor} my-2 pt-4`}>
            <View style={tw`flex-row justify-around w-full`}>
              <View style={tw`flex items-center`}>
                <Text style={tw`text-xs ${styles.subtextColor}`}>Tenancy</Text>
                <Text style={tw`text-lg font-bold ${styles.textColor}`}>
                  {userData.tenancyMonths} Months
                </Text>
              </View>

              <View style={tw`h-12 w-px ${styles.dividerColor}`}></View>

              <View style={tw`flex items-center`}>
                <Text style={tw`text-xs ${styles.subtextColor}`}>Unit</Text>
                <Text style={tw`text-lg font-bold ${styles.textColor}`}>
                  {userData.unitNumber}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lease Management */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
            Lease Management
          </Text>

          {/* Lease Renewal Info Card */}
          <View
            style={tw`${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
          >
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`p-2 mr-3 ${styles.iconBackground} rounded-full`}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color={styles.iconColor}
                />
              </View>
              <View>
                <Text style={tw`font-semibold ${styles.textColor}`}>
                  Current Lease
                </Text>
                <Text style={tw`text-sm ${styles.subtextColor}`}>
                  Expires on{" "}
                  {new Date(userData.leaseRenewalDate).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row mt-2`}>
              <TouchableOpacity
                style={tw`flex-1 bg-blue-500 py-2 rounded-lg mr-2 items-center`}
                onPress={handleViewLeaseDocuments}
              >
                <Text style={tw`text-white font-medium`}>View Documents</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 bg-green-500 py-2 rounded-lg items-center`}
                onPress={handleRenewLease}
              >
                <Text style={tw`text-white font-medium`}>Renew Lease</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Lease Documents */}
          <View style={tw`${styles.cardBackground} rounded-xl p-4 shadow-sm`}>
            <Text style={tw`font-semibold mb-2 ${styles.textColor}`}>
              Recent Documents
            </Text>

            {userData.leaseDocuments.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={tw`flex-row items-center py-3 border-b ${styles.borderColor}`}
                onPress={() => Alert.alert("Document", `Opening ${doc.name}`)}
              >
                <View
                  style={tw`p-2 mr-3 ${styles.iconBackground} rounded-full`}
                >
                  <Ionicons
                    name="document-outline"
                    size={18}
                    color={styles.iconColor}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {doc.name}
                  </Text>
                  <Text style={tw`text-xs ${styles.subtextColor}`}>
                    {new Date(doc.date).toLocaleDateString()}
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
              onPress={handleViewLeaseDocuments}
            >
              <Text style={tw`text-blue-500 font-medium`}>
                View All Documents
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
          Account Settings
        </Text>

        {/* Settings */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() =>
            Alert.alert(
              "Settings",
              "This would navigate to the Settings screen."
            )
          }
        >
          <View style={tw`p-2 mr-3 ${styles.settingsIconBg} rounded-full`}>
            <Ionicons
              name="settings-outline"
              size={22}
              color={styles.iconColor}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>Settings</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={styles.chevronColor}
          />
        </TouchableOpacity>

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
          <TouchableOpacity
            style={tw`flex-1`}
            onPress={() =>
              Alert.alert(
                "Notifications",
                "This would navigate to the Notifications screen."
              )
            }
          >
            <Text style={tw`text-base ${styles.textColor}`}>Notifications</Text>
          </TouchableOpacity>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            trackColor={styles.switchTrack}
            thumbColor={styles.switchThumb}
          />
        </View>

        {/* Privacy & Security */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() =>
            Alert.alert(
              "Privacy",
              "This would navigate to the Privacy & Security screen."
            )
          }
        >
          <View style={tw`p-2 mr-3 ${styles.privacyIconBg} rounded-full`}>
            <Ionicons
              name="shield-outline"
              size={22}
              color={styles.privacyIconColor}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>
            Privacy & Security
          </Text>
          <View style={tw`flex-1`}></View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={styles.chevronColor}
          />
        </TouchableOpacity>

        {/* Payment Methods */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.cardBackground} rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() =>
            Alert.alert(
              "Payment Methods",
              "This would navigate to the Payment Methods screen."
            )
          }
        >
          <View style={tw`p-2 mr-3 ${styles.paymentIconBg} rounded-full`}>
            <Ionicons
              name="card-outline"
              size={22}
              color={styles.paymentIconColor}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>Payment Methods</Text>
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
          onPress={() =>
            Alert.alert(
              "Help",
              "This would navigate to the Help & Support screen."
            )
          }
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
          onPress={() => handleLogout(navigation)}
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

export default ProfileScreen;
