import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import Card from "../../components/Card";
import { useTheme } from "../../context/ThemeContext";

const MaintenanceJobsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === "dark";
  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-100",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    headerBackground: isDark ? "bg-blue-800" : "bg-blue-500",
    headerTextColor: isDark ? "text-blue-200" : "text-blue-100",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-black",
    subtextColor: isDark ? "text-gray-400" : "text-gray-500",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    modalBackground: isDark ? "bg-gray-800" : "bg-white",
    iconButtonBg: isDark ? "bg-blue-700" : "bg-blue-400",
    pendingStatus: isDark ? "bg-yellow-600" : "bg-yellow-500",
    inProgressStatus: isDark ? "bg-blue-600" : "bg-blue-500",
    completedStatus: isDark ? "bg-green-600" : "bg-green-500",
    activeTabBorder: isDark ? "border-blue-400" : "border-blue-500",
    activeTabText: isDark ? "text-blue-400" : "text-blue-500",
    inactiveTabText: isDark ? "text-gray-400" : "text-gray-500",
    emptyIconColor: isDark ? "#4b5563" : "#ddd",
    grayButton: isDark ? "bg-gray-700" : "bg-gray-200",
    grayButtonText: isDark ? "text-gray-200" : "text-gray-700",
  };

  // Mock data for maintenance requests
  const maintenanceRequests = [
    {
      id: "1",
      title: "Leaking Kitchen Faucet",
      description: "Water is leaking from under the sink when faucet is used",
      status: "Pending",
      priority: "High",
      date: "10 min ago",
      unit: "Apt 304",
      tenant: "Sarah Johnson",
      images: [
        "https://dummyjson.com/image/150",
        "https://dummyjson.com/image/150",
      ],
      category: "Plumbing",
      statusColor: styles.pendingStatus,
    },
    {
      id: "2",
      title: "Broken AC Unit",
      description: "AC not cooling properly in living room",
      status: "In Progress",
      priority: "Medium",
      date: "2 hours ago",
      unit: "Apt 205",
      tenant: "Michael Chen",
      images: ["https://dummyjson.com/image/150"],
      category: "HVAC",
      statusColor: styles.inProgressStatus,
    },
    {
      id: "3",
      title: "Clogged Bathroom Drain",
      description: "Water drains very slowly in master bathroom sink",
      status: "Completed",
      priority: "Low",
      date: "Yesterday",
      unit: "Apt 412",
      tenant: "David Wilson",
      images: ["https://dummyjson.com/image/150"],
      category: "Plumbing",
      statusColor: styles.completedStatus,
    },
    {
      id: "4",
      title: "Faulty Light Switch",
      description: "Bedroom light switch sparks when used",
      status: "Pending",
      priority: "High",
      date: "5 hours ago",
      unit: "Apt 108",
      tenant: "Emily Rodriguez",
      images: ["https://dummyjson.com/image/150"],
      category: "Electrical",
      statusColor: styles.pendingStatus,
    },
  ];

  const filteredRequests = maintenanceRequests.filter((request) => {
    if (activeTab === "pending") return request.status === "Pending";
    if (activeTab === "in-progress") return request.status === "In Progress";
    if (activeTab === "completed") return request.status === "Completed";
    return true;
  });

  const renderTabs = () => (
    <View style={tw`flex-row mb-4`}>
      <TouchableOpacity
        style={tw`flex-1 py-3 ${
          activeTab === "pending" ? `border-b-2 ${styles.activeTabBorder}` : ""
        }`}
        onPress={() => setActiveTab("pending")}
      >
        <Text
          style={tw`text-center font-semibold ${
            activeTab === "pending"
              ? styles.activeTabText
              : styles.inactiveTabText
          }`}
        >
          Pending
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`flex-1 py-3 ${
          activeTab === "in-progress"
            ? `border-b-2 ${styles.activeTabBorder}`
            : ""
        }`}
        onPress={() => setActiveTab("in-progress")}
      >
        <Text
          style={tw`text-center font-semibold ${
            activeTab === "in-progress"
              ? styles.activeTabText
              : styles.inactiveTabText
          }`}
        >
          In Progress
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`flex-1 py-3 ${
          activeTab === "completed"
            ? `border-b-2 ${styles.activeTabBorder}`
            : ""
        }`}
        onPress={() => setActiveTab("completed")}
      >
        <Text
          style={tw`text-center font-semibold ${
            activeTab === "completed"
              ? styles.activeTabText
              : styles.inactiveTabText
          }`}
        >
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRequestModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showRequestModal}
      onRequestClose={() => setShowRequestModal(false)}
    >
      <Pressable
        style={tw`flex-1 bg-black bg-opacity-50 justify-end`}
        onPress={() => setShowRequestModal(false)}
      >
        <View style={tw`${styles.modalBackground} rounded-t-3xl p-5 max-h-3/4`}>
          <View
            style={tw`w-16 h-1 ${styles.borderColor} rounded-full mx-auto mb-5`}
          />
          <ScrollView>
            <View style={tw`pb-6`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-xl font-bold ${styles.textColor}`}>
                  {selectedRequest?.title}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <View
                    style={tw`w-3 h-3 rounded-full ${selectedRequest?.statusColor} mr-2`}
                  />
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {selectedRequest?.status}
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row mb-3`}>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>
                    Category
                  </Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {selectedRequest?.category}
                  </Text>
                </View>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>
                    Priority
                  </Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {selectedRequest?.priority}
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row mb-3`}>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>Unit</Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {selectedRequest?.unit}
                  </Text>
                </View>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>Tenant</Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {selectedRequest?.tenant}
                  </Text>
                </View>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-sm ${styles.subtextColor} mb-1`}>
                  Description
                </Text>
                <Text style={tw`text-base ${styles.textColor}`}>
                  {selectedRequest?.description}
                </Text>
              </View>

              {selectedRequest?.images && selectedRequest.images.length > 0 && (
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm ${styles.subtextColor} mb-2`}>
                    Images
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {selectedRequest.images.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={tw`w-40 h-40 rounded-lg mr-3`}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={tw`flex-row justify-between mt-6`}>
                {selectedRequest?.status === "Pending" && (
                  <>
                    <TouchableOpacity
                      style={tw`bg-blue-500 py-3 px-6 rounded-full flex-1 mr-2 items-center`}
                      onPress={() => {
                        setShowRequestModal(false);
                      }}
                    >
                      <Text style={tw`text-white font-semibold`}>
                        Accept Job
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`${styles.grayButton} py-3 px-6 rounded-full flex-1 ml-2 items-center`}
                      onPress={() => setShowRequestModal(false)}
                    >
                      <Text style={tw`${styles.grayButtonText} font-semibold`}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {selectedRequest?.status === "In Progress" && (
                  <>
                    <TouchableOpacity
                      style={tw`bg-green-500 py-3 px-6 rounded-full flex-1 mr-2 items-center`}
                      onPress={() => {
                        setShowRequestModal(false);
                      }}
                    >
                      <Text style={tw`text-white font-semibold`}>
                        Mark Complete
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`${styles.grayButton} py-3 px-6 rounded-full flex-1 ml-2 items-center`}
                      onPress={() => {
                        navigation.navigate("Chat", {
                          conversation: {
                            id: "tenant-" + selectedRequest.id,
                            sender: selectedRequest.tenant,
                            messages: [
                              {
                                id: "1",
                                text: `Regarding my maintenance request: ${selectedRequest.title}`,
                                time: new Date().toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }),
                                isSent: false,
                              },
                            ],
                          },
                        });
                        setShowRequestModal(false);
                      }}
                    >
                      <Text style={tw`${styles.grayButtonText} font-semibold`}>
                        Message Tenant
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {selectedRequest?.status === "Completed" && (
                  <TouchableOpacity
                    style={tw`bg-blue-500 py-3 px-6 rounded-full flex-1 items-center`}
                    onPress={() => {
                      navigation.navigate("Chat", {
                        conversation: {
                          id: "tenant-" + selectedRequest.id,
                          sender: selectedRequest.tenant,
                          messages: [
                            {
                              id: "1",
                              text: `Regarding my completed request: ${selectedRequest.title}`,
                              time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              isSent: false,
                            },
                          ],
                        },
                      });
                      setShowRequestModal(false);
                    }}
                  >
                    <Text style={tw`text-white font-semibold`}>Follow Up</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={styles.statusBarStyle}
        backgroundColor={styles.statusBarColor}
      />

      {/* Header with blue background */}
      <View style={tw`${styles.headerBackground} p-6 pt-8 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`max-w-2/3`}>
            <Text style={tw`text-3xl font-bold text-white`}>
              Maintenance Jobs
            </Text>
            <Text style={tw`${styles.headerTextColor} mt-1`}>
              View and manage tenant maintenance requests
            </Text>
          </View>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`p-2 mr-2 ${styles.iconButtonBg} rounded-full`}
            >
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`p-2 ${styles.iconButtonBg} rounded-full`}
            >
              <Ionicons name="filter" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <View style={tw`flex-1`}>
        {/* Card with Fixed Tabs */}
        <View style={tw`px-4 -mt-10`}>
          <Card style={`mb-4 ${styles.cardBackground}`}>{renderTabs()}</Card>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-4 px-4`}
          showsVerticalScrollIndicator={false}
        >
          <Card style={`mb-4 ${styles.cardBackground}`}>
            {filteredRequests.length > 0 ? (
              <FlatList
                data={filteredRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`p-4 border-b ${styles.borderColor}`}
                    onPress={() => {
                      setSelectedRequest(item);
                      setShowRequestModal(true);
                    }}
                  >
                    <View
                      style={tw`flex-row justify-between items-center mb-2`}
                    >
                      <Text
                        style={tw`font-semibold text-lg ${styles.textColor}`}
                      >
                        {item.title}
                      </Text>
                      <View style={tw`flex-row items-center`}>
                        <View
                          style={tw`w-2 h-2 rounded-full ${item.statusColor} mr-2`}
                        />
                        <Text style={tw`text-xs ${styles.subtextColor}`}>
                          {item.status}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={tw`${styles.subtextColor} mb-2`}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                    <View style={tw`flex-row justify-between items-center`}>
                      <View style={tw`flex-row items-center`}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color={styles.subtextColor}
                          style={tw`mr-1`}
                        />
                        <Text style={tw`text-xs ${styles.subtextColor}`}>
                          {item.unit}
                        </Text>
                      </View>
                      <Text style={tw`text-xs ${styles.subtextColor}`}>
                        {item.date}
                      </Text>
                    </View>
                    {item.images && item.images.length > 0 && (
                      <View style={tw`mt-2`}>
                        <Image
                          source={{ uri: item.images[0] }}
                          style={tw`w-full h-32 rounded-lg`}
                          resizeMode="cover"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            ) : (
              <View style={tw`p-8 items-center justify-center`}>
                <Ionicons
                  name="checkmark-done-circle-outline"
                  size={48}
                  color={styles.emptyIconColor}
                  style={tw`mb-4`}
                />
                <Text style={tw`${styles.subtextColor} text-center`}>
                  No {activeTab} maintenance requests
                </Text>
              </View>
            )}
          </Card>
        </ScrollView>
      </View>

      {renderRequestModal()}
    </SafeAreaView>
  );
};

export default MaintenanceJobsScreen;
