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

const MaintenanceProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState(true);
  const { refreshUserRole } = useUser();

  useEffect(() => {
    // Simulate fetching maintenance user data
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    // Dummy maintenance user data
    setTimeout(() => {
      setUserData({
        fullName: "Michael Rodriguez",
        email: "michael.maintenance@example.com",
        profileImage: "/api/placeholder/150/150",
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

  const handleEditProfile = () => {
    navigation.navigate("EditMaintenanceProfile", { userData });
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
          <Text style={tw`text-3xl font-bold text-white`}>My Profile</Text>
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
              source={{ uri: userData.profileImage }}
              style={tw`w-24 h-24 rounded-full`}
            />
          </View>

          <Text style={tw`text-xl font-bold text-gray-800 mt-2`}>
            {userData.fullName}
          </Text>
          <Text style={tw`text-base text-gray-600 mb-1`}>{userData.role}</Text>
          <Text style={tw`text-sm text-gray-500 mb-4`}>
            {userData.specialization}
          </Text>

          {/* Rating and Jobs */}
          <View style={tw`flex-row items-center mb-3`}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={tw`text-gray-700 ml-1 mr-3`}>
              {userData.rating} ({userData.completedJobs} jobs)
            </Text>
            <Ionicons name="briefcase-outline" size={16} color="#4b5563" />
            <Text style={tw`text-gray-700 ml-1`}>
              {userData.yearsOfExperience} years experience
            </Text>
          </View>

          {/* Availability Toggle */}
          <View
            style={tw`flex-row items-center bg-blue-50 rounded-full px-4 py-2`}
          >
            <Text style={tw`text-gray-700 mr-2`}>
              {availabilityStatus ? "Available" : "Unavailable"}
            </Text>
            <Switch
              value={availabilityStatus}
              onValueChange={setAvailabilityStatus}
              trackColor={{ false: "#e5e7eb", true: "#dbeafe" }}
              thumbColor={availabilityStatus ? "#3b82f6" : "#ffffff"}
            />
          </View>
        </View>

        {/* Current Jobs Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              Current Jobs
            </Text>
            <TouchableOpacity onPress={handleViewJobs}>
              <Text style={tw`text-blue-500 font-medium`}>View All</Text>
            </TouchableOpacity>
          </View>

          {userData.currentJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm`}
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
                  <Text style={tw`font-semibold text-gray-800`}>
                    {job.title}
                  </Text>
                  <Text style={tw`text-gray-500 text-sm`}>{job.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            </TouchableOpacity>
          ))}

          {userData.currentJobs.length === 0 && (
            <View style={tw`bg-white rounded-xl p-6 items-center shadow-sm`}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={40}
                color="#d1d5db"
              />
              <Text style={tw`text-gray-500 mt-2`}>No active jobs</Text>
            </View>
          )}
        </View>

        {/* Tools Inventory Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              Tools Inventory
            </Text>
            <TouchableOpacity onPress={handleViewTools}>
              <Text style={tw`text-blue-500 font-medium`}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
            {userData.tools.map((tool) => (
              <View
                key={tool.id}
                style={tw`flex-row items-center py-3 border-b border-gray-100`}
              >
                <View
                  style={tw`p-2 mr-3 ${
                    tool.status === "Available"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                  } rounded-full`}
                >
                  <Ionicons
                    name="hammer-outline"
                    size={20}
                    color={tool.status === "Available" ? "#2ecc71" : "#e67e22"}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium text-gray-800`}>{tool.name}</Text>
                  <Text style={tw`text-gray-500 text-xs`}>{tool.status}</Text>
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
          <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>
            Certifications
          </Text>

          <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
            {userData.certifications.map((cert, index) => (
              <View
                key={index}
                style={tw`flex-row items-center py-3 border-b border-gray-100`}
              >
                <View style={tw`p-2 mr-3 bg-blue-100 rounded-full`}>
                  <Ionicons name="ribbon-outline" size={20} color="#3498db" />
                </View>
                <Text style={tw`font-medium text-gray-800`}>{cert}</Text>
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
          <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>
            Service Areas
          </Text>

          <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
            <View style={tw`flex-row flex-wrap`}>
              {userData.serviceAreas.map((area, index) => (
                <View
                  key={index}
                  style={tw`bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2`}
                >
                  <Text style={tw`text-blue-700 text-sm`}>{area}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>Settings</Text>

        {/* Notifications */}
        <View
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
        >
          <View style={tw`p-2 mr-3 bg-orange-100 rounded-full`}>
            <Ionicons name="notifications-outline" size={22} color="#e67e22" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Job Notifications</Text>
          <View style={tw`flex-1`}></View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#e5e7eb", true: "#dbeafe" }}
            thumbColor={notificationsEnabled ? "#3b82f6" : "#ffffff"}
          />
        </View>

        {/* Work Schedule */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() => Alert.alert("Schedule", "Edit work schedule")}
        >
          <View style={tw`p-2 mr-3 bg-purple-100 rounded-full`}>
            <Ionicons name="calendar-outline" size={22} color="#9c27b0" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Work Schedule</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mb-3 shadow-sm`}
          onPress={() => Alert.alert("Help", "Contact support")}
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

export default MaintenanceProfileScreen;
