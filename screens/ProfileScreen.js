import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useUser } from "../context/UserContext";

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { refreshUserRole } = useUser();

  useEffect(() => {
    // Simulate fetching user data
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    // Dummy user data
    setTimeout(() => {
      setUserData({
        fullName: "John Doe",
        email: "john.doe@example.com",
        profileImage: "/api/placeholder/150/150",
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
              // Clear current user from AsyncStorage
              await AsyncStorage.removeItem("currentUser");
              await refreshUserRole(); // Refresh user role in context
              // First navigate to Login
              navigation.navigate("Login");

              // Then reset the navigation stack after a short delay
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
    navigation.navigate("EditProfileScreen", { userData: userData });
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
      <SafeAreaView style={tw`flex-1 bg-gray-100`}>
        <View style={tw`flex items-center justify-center h-full`}>
          <Text style={tw`text-gray-600`}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      {/* Header with blue background, similar to HomeScreen */}
      <View style={tw`bg-blue-500 p-6 pt-4 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-3xl font-bold text-white`}>Profile</Text>
          <TouchableOpacity
            style={tw`p-2 bg-blue-400 rounded-full`}
            onPress={handleEditProfile}
          >
            <Ionicons name="pencil-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={tw`flex-1 px-4 -mt-10`}>
        {/* Profile Card - Elevated like the Current Residence card */}
        <View
          style={tw`bg-white rounded-xl p-6 flex items-center mb-6 shadow-lg`}
        >
          <View style={tw`bg-blue-100 p-2 rounded-full mb-2`}>
            <Image
              source={{ uri: userData.profileImage }}
              style={tw`w-24 h-24 rounded-full`}
            />
          </View>

          <Text style={tw`text-xl font-bold text-gray-800 mt-2`}>
            {userData.fullName}
          </Text>
          <Text style={tw`text-base text-gray-600 mb-4`}>{userData.email}</Text>

          <View style={tw`w-full border-t border-gray-200 my-2 pt-4`}>
            <View style={tw`flex-row justify-around w-full`}>
              <View style={tw`flex items-center`}>
                <Text style={tw`text-gray-500 text-xs`}>Tenancy</Text>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  {userData.tenancyMonths} Months
                </Text>
              </View>

              <View style={tw`h-12 w-px bg-gray-200`}></View>

              <View style={tw`flex items-center`}>
                <Text style={tw`text-gray-500 text-xs`}>Unit</Text>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  {userData.unitNumber}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lease Management - New Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>
            Lease Management
          </Text>

          {/* Lease Renewal Info Card */}
          <View style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`p-2 mr-3 bg-blue-100 rounded-full`}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#3498db"
                />
              </View>
              <View>
                <Text style={tw`font-semibold text-gray-800`}>
                  Current Lease
                </Text>
                <Text style={tw`text-gray-500 text-sm`}>
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
          <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
            <Text style={tw`font-semibold mb-2 text-gray-800`}>
              Recent Documents
            </Text>

            {userData.leaseDocuments.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={tw`flex-row items-center py-3 border-b border-gray-100`}
                onPress={() => Alert.alert("Document", `Opening ${doc.name}`)}
              >
                <View style={tw`p-2 mr-3 bg-blue-50 rounded-full`}>
                  <Ionicons name="document-outline" size={18} color="#3498db" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium text-gray-800`}>{doc.name}</Text>
                  <Text style={tw`text-gray-500 text-xs`}>
                    {new Date(doc.date).toLocaleDateString()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
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
        <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>
          Account Settings
        </Text>

        {/* Settings */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() =>
            Alert.alert(
              "Settings",
              "This would navigate to the Settings screen."
            )
          }
        >
          <View style={tw`p-2 mr-3 bg-gray-100 rounded-full`}>
            <Ionicons name="settings-outline" size={22} color="#3498db" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Settings</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Notifications */}
        <View
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
        >
          <View style={tw`p-2 mr-3 bg-orange-100 rounded-full`}>
            <Ionicons name="notifications-outline" size={22} color="#e67e22" />
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
            <Text style={tw`text-base text-gray-800`}>Notifications</Text>
          </TouchableOpacity>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            trackColor={{ false: "#e5e7eb", true: "#dbeafe" }}
            thumbColor={notificationsEnabled ? "#3b82f6" : "#ffffff"}
          />
        </View>

        {/* Privacy & Security */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() =>
            Alert.alert(
              "Privacy",
              "This would navigate to the Privacy & Security screen."
            )
          }
        >
          <View style={tw`p-2 mr-3 bg-green-100 rounded-full`}>
            <Ionicons name="shield-outline" size={22} color="#2ecc71" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Privacy & Security</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Payment Methods */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() =>
            Alert.alert(
              "Payment Methods",
              "This would navigate to the Payment Methods screen."
            )
          }
        >
          <View style={tw`p-2 mr-3 bg-purple-100 rounded-full`}>
            <Ionicons name="card-outline" size={22} color="#9c27b0" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Payment Methods</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() =>
            Alert.alert(
              "Help",
              "This would navigate to the Help & Support screen."
            )
          }
        >
          <View style={tw`p-2 mr-3 bg-teal-100 rounded-full`}>
            <Ionicons name="help-buoy-outline" size={22} color="#009688" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Help & Support</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-8 shadow-sm`}
          onPress={() => handleLogout(navigation)}
        >
          <View style={tw`p-2 mr-3 bg-red-100 rounded-full`}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          </View>
          <Text style={tw`text-base text-red-500`}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
