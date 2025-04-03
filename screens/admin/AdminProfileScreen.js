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
import { useUser } from "../../context/UserContext";

const AdminProfileScreen = ({ navigation }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const { refreshUserRole } = useUser();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = () => {
    // Simulate fetching admin data
    setTimeout(() => {
      setAdminData({
        fullName: "Sarah Williams",
        email: "sarah.admin@example.com",
        profileImage: "/api/placeholder/150/150",
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
      <SafeAreaView style={tw`flex-1 bg-gray-100`}>
        <View style={tw`flex items-center justify-center h-full`}>
          <Text style={tw`text-gray-600`}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      {/* Header with blue background */}
      <View style={tw`bg-blue-500 p-6 pt-4 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-3xl font-bold text-white`}>Admin Profile</Text>
          <TouchableOpacity
            style={tw`p-2 bg-blue-400 rounded-full`}
            onPress={handleEditProfile}
          >
            <Ionicons name="pencil-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={tw`flex-1 px-4 -mt-10`}>
        {/* Profile Card */}
        <View
          style={tw`bg-white rounded-xl p-6 flex items-center mb-6 shadow-lg`}
        >
          <View style={tw`bg-blue-100 p-2 rounded-full mb-2`}>
            <Image
              source={{ uri: adminData.profileImage }}
              style={tw`w-24 h-24 rounded-full`}
            />
          </View>

          <Text style={tw`text-xl font-bold text-gray-800 mt-2`}>
            {adminData.fullName}
          </Text>
          <Text style={tw`text-base text-gray-600 mb-1`}>{adminData.role}</Text>
          <Text style={tw`text-sm text-gray-500 mb-4`}>{adminData.email}</Text>

          {/* Admin Stats */}
          <View style={tw`w-full border-t border-gray-200 my-2 pt-4`}>
            <View style={tw`flex-row justify-around w-full`}>
              <View style={tw`flex items-center`}>
                <Text style={tw`text-gray-500 text-xs`}>Properties</Text>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  {adminData.propertiesManaged}
                </Text>
              </View>

              <View style={tw`h-12 w-px bg-gray-200`}></View>

              <View style={tw`flex items-center`}>
                <Text style={tw`text-gray-500 text-xs`}>Tenants</Text>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  {adminData.tenantsManaged}
                </Text>
              </View>

              <View style={tw`h-12 w-px bg-gray-200`}></View>

              <View style={tw`flex items-center`}>
                <Text style={tw`text-gray-500 text-xs`}>Staff</Text>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  {adminData.maintenanceStaff}
                </Text>
              </View>
            </View>
          </View>

          {/* Emergency Mode Toggle */}
          <View
            style={tw`flex-row items-center mt-4 bg-red-50 rounded-full px-4 py-2`}
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={emergencyMode ? "#ef4444" : "#9ca3af"}
            />
            <Text
              style={tw`ml-2 ${
                emergencyMode ? "text-red-600 font-bold" : "text-gray-700"
              }`}
            >
              Emergency Mode
            </Text>
            <Switch
              value={emergencyMode}
              onValueChange={toggleEmergencyMode}
              trackColor={{ false: "#e5e7eb", true: "#fee2e2" }}
              thumbColor={emergencyMode ? "#ef4444" : "#ffffff"}
              style={tw`ml-2`}
            />
          </View>
        </View>

        {/* Managed Properties Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              Managed Properties
            </Text>
            <TouchableOpacity onPress={handleViewProperties}>
              <Text style={tw`text-blue-500 font-medium`}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
            {adminData.properties.map((property) => (
              <TouchableOpacity
                key={property.id}
                style={tw`flex-row items-center py-3 border-b border-gray-100`}
                onPress={() =>
                  navigation.navigate("PropertyDetails", {
                    propertyId: property.id,
                  })
                }
              >
                <View style={tw`p-2 mr-3 bg-blue-100 rounded-full`}>
                  <Ionicons name="business-outline" size={20} color="#3498db" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium text-gray-800`}>
                    {property.name}
                  </Text>
                  <Text style={tw`text-gray-500 text-xs`}>
                    {property.location}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
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
          <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>
            Recent Activities
          </Text>

          <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
            {adminData.recentActivities.map((activity) => (
              <View
                key={activity.id}
                style={tw`flex-row items-center py-3 border-b border-gray-100`}
              >
                <View style={tw`p-2 mr-3 bg-gray-100 rounded-full`}>
                  <Ionicons name="time-outline" size={18} color="#6b7280" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium text-gray-800`}>
                    {activity.action}
                  </Text>
                  <Text style={tw`text-gray-500 text-xs`}>{activity.time}</Text>
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
          <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>
            Admin Tools
          </Text>

          <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
            <TouchableOpacity
              style={tw`flex-row items-center py-3 border-b border-gray-100`}
              onPress={() => navigation.navigate("AdminReports")}
            >
              <View style={tw`p-2 mr-3 bg-purple-100 rounded-full`}>
                <Ionicons
                  name="stats-chart-outline"
                  size={20}
                  color="#9c27b0"
                />
              </View>
              <Text style={tw`font-medium text-gray-800`}>
                Generate Reports
              </Text>
              <View style={tw`flex-1`}></View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center py-3 border-b border-gray-100`}
              onPress={handleViewStaff}
            >
              <View style={tw`p-2 mr-3 bg-green-100 rounded-full`}>
                <Ionicons name="people-outline" size={20} color="#2ecc71" />
              </View>
              <Text style={tw`font-medium text-gray-800`}>Manage Staff</Text>
              <View style={tw`flex-1`}></View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center py-3`}
              onPress={() => navigation.navigate("AdminSettings")}
            >
              <View style={tw`p-2 mr-3 bg-blue-100 rounded-full`}>
                <Ionicons name="settings-outline" size={20} color="#3498db" />
              </View>
              <Text style={tw`font-medium text-gray-800`}>System Settings</Text>
              <View style={tw`flex-1`}></View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>
          Preferences
        </Text>

        {/* Notifications */}
        <View
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
        >
          <View style={tw`p-2 mr-3 bg-orange-100 rounded-full`}>
            <Ionicons name="notifications-outline" size={22} color="#e67e22" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Notifications</Text>
          <View style={tw`flex-1`}></View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#e5e7eb", true: "#dbeafe" }}
            thumbColor={notificationsEnabled ? "#3b82f6" : "#ffffff"}
          />
        </View>

        {/* Dark Mode */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() => navigation.navigate("AppearanceSettings")}
        >
          <View style={tw`p-2 mr-3 bg-gray-100 rounded-full`}>
            <Ionicons name="moon-outline" size={22} color="#4b5563" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Dark Mode</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() => navigation.navigate("AdminSupport")}
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
          onPress={handleLogout}
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

export default AdminProfileScreen;
