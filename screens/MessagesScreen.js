import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";
import { messages } from "../data/dummyData";

const MessagesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const { theme } = useTheme();

  const isDark = theme === "dark";
  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-100",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    headerBackground: isDark ? "bg-blue-800" : "bg-blue-500",
    headerSubtextColor: isDark ? "text-blue-200" : "text-blue-100",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-black",
    subtextColor: isDark ? "text-gray-400" : "text-gray-500",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    activeTabBorder: isDark ? "border-blue-400" : "border-blue-500",
    activeTabText: isDark ? "text-blue-400" : "text-blue-500",
    inactiveTabText: isDark ? "text-gray-400" : "text-gray-500",
    iconBackground: isDark ? "bg-blue-900" : "bg-blue-100",
    iconColor: isDark ? "#90caf9" : "#3498db",
    groupIconBackground: isDark ? "bg-green-900" : "bg-green-100",
    groupIconColor: isDark ? "#a5d6a7" : "#2ecc71",
    maintenanceIconBackground: isDark ? "bg-orange-900" : "bg-orange-100",
    maintenanceIconColor: isDark ? "#ffb74d" : "#e67e22",
    unreadBadge: isDark ? "bg-red-600" : "bg-red-500",
    chevronColor: isDark ? "#777" : "#999",
  };

  const renderTabs = () => (
    <View style={tw`flex-row mb-4`}>
      <TouchableOpacity
        style={tw`flex-1 py-3 ${
          activeTab === "conversations"
            ? `border-b-2 ${styles.activeTabBorder}`
            : ""
        }`}
        onPress={() => setActiveTab("conversations")}
      >
        <Text
          style={tw`text-center font-semibold ${
            activeTab === "conversations"
              ? styles.activeTabText
              : styles.inactiveTabText
          }`}
        >
          Conversations
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`flex-1 py-3 ${
          activeTab === "groups" ? `border-b-2 ${styles.activeTabBorder}` : ""
        }`}
        onPress={() => setActiveTab("groups")}
      >
        <Text
          style={tw`text-center font-semibold ${
            activeTab === "groups"
              ? styles.activeTabText
              : styles.inactiveTabText
          }`}
        >
          Groups
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={styles.statusBarStyle}
        backgroundColor={styles.statusBarColor}
      />

      {/* Header with blue background */}
      <View style={tw`${styles.headerBackground} p-4 pt-8 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`max-w-2/3`}>
            <Text style={tw`text-3xl font-bold text-white`}>Messages</Text>
            <Text style={tw`${styles.headerSubtextColor} mt-1`}>
              Stay connected with management and neighbors
            </Text>
          </View>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`p-2 mr-2 ${
                isDark ? "bg-blue-700" : "bg-blue-400"
              } rounded-full`}
            >
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`p-2 ${
                isDark ? "bg-blue-700" : "bg-blue-400"
              } rounded-full`}
            >
              <Ionicons name="create-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <View style={tw`flex-1`}>
        {/* Card with Fixed Tabs */}
        <View style={tw`px-2 -mt-10`}>
          <Card style={`mb-4 ${styles.cardBackground}`}>{renderTabs()}</Card>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-4 px-2`}
          showsVerticalScrollIndicator={false}
        >
          <Card style={`mb-4 ${styles.cardBackground}`}>
            {activeTab === "conversations" ? (
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`p-4 border-b ${styles.borderColor} flex-row items-center`}
                    onPress={() =>
                      navigation.navigate("Chat", { conversation: item })
                    }
                  >
                    <View
                      style={tw`w-12 h-12 ${styles.iconBackground} rounded-full items-center justify-center mr-3`}
                    >
                      <Ionicons
                        name={
                          item.sender === "Maintenance"
                            ? "construct"
                            : item.sender === "Building Manager"
                            ? "business"
                            : "person"
                        }
                        size={24}
                        color={styles.iconColor}
                      />
                      {item.unread > 0 && (
                        <View
                          style={tw`absolute -top-1 -right-1 ${styles.unreadBadge} rounded-full w-5 h-5 items-center justify-center`}
                        >
                          <Text style={tw`text-white text-xs font-bold`}>
                            {item.unread}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={tw`flex-1`}>
                      <View style={tw`flex-row justify-between`}>
                        <Text
                          style={tw`font-semibold text-lg ${styles.textColor}`}
                        >
                          {item.sender}
                        </Text>
                        <Text style={tw`text-xs ${styles.subtextColor}`}>
                          {item.messages[0].time}
                        </Text>
                      </View>
                      <Text
                        style={tw`${styles.subtextColor}`}
                        numberOfLines={1}
                      >
                        {item.messages[0].text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            ) : (
              <FlatList
                data={[
                  {
                    id: "1",
                    name: "Building Announcements",
                    members: "All residents",
                    lastMessage: "Water shut-off scheduled for Friday",
                  },
                  {
                    id: "2",
                    name: "Floor 3 Residents",
                    members: "12 people",
                    lastMessage: "Anyone interested in a floor meetup?",
                  },
                  {
                    id: "3",
                    name: "Maintenance Updates",
                    members: "All residents",
                    lastMessage: "Elevator maintenance complete",
                  },
                ]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`p-4 border-b ${styles.borderColor} flex-row items-center`}
                    onPress={() =>
                      navigation.navigate("Chat", {
                        conversation: {
                          id: item.id,
                          sender: item.name,
                          messages: [
                            {
                              id: "1",
                              text: item.lastMessage,
                              time: "10:30 AM",
                              isSent: false,
                            },
                          ],
                        },
                      })
                    }
                  >
                    <View
                      style={tw`w-12 h-12 ${styles.groupIconBackground} rounded-full items-center justify-center mr-3`}
                    >
                      <Ionicons
                        name="people"
                        size={24}
                        color={styles.groupIconColor}
                      />
                    </View>
                    <View style={tw`flex-1`}>
                      <View style={tw`flex-row justify-between`}>
                        <Text
                          style={tw`font-semibold text-lg ${styles.textColor}`}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <Text style={tw`text-xs ${styles.subtextColor}`}>
                        {item.members}
                      </Text>
                      <Text
                        style={tw`${styles.subtextColor} mt-1`}
                        numberOfLines={1}
                      >
                        {item.lastMessage}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            )}
          </Card>

          {/* Quick Actions */}
          <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
            Quick Actions
          </Text>
          <View style={tw`flex-row mb-4`}>
            <Card style={`flex-1 mr-2 ${styles.cardBackground}`}>
              <TouchableOpacity
                style={tw`items-center py-4`}
                onPress={() => navigation.navigate("MaintenanceRequest")}
              >
                <View
                  style={tw`p-3 ${styles.maintenanceIconBackground} rounded-full mb-2`}
                >
                  <Ionicons
                    name="construct-outline"
                    size={24}
                    color={styles.maintenanceIconColor}
                  />
                </View>
                <Text style={tw`font-medium ${styles.textColor}`}>
                  Maintenance Request
                </Text>
              </TouchableOpacity>
            </Card>
            <Card style={`flex-1 ml-2 ${styles.cardBackground}`}>
              <TouchableOpacity
                style={tw`items-center py-4`}
                onPress={() =>
                  navigation.navigate("Chat", {
                    conversation: {
                      id: "new",
                      sender: "New Message",
                      messages: [],
                    },
                  })
                }
              >
                <View
                  style={tw`p-3 ${styles.iconBackground} rounded-full mb-2`}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color={styles.iconColor}
                  />
                </View>
                <Text style={tw`font-medium ${styles.textColor}`}>
                  New Message
                </Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Maintenance Request Status */}
          <Text style={tw`text-xl font-bold mb-3 px-2 ${styles.textColor}`}>
            Maintenance Requests
          </Text>
          <Card style={`mb-4 ${styles.cardBackground}`}>
            <FlatList
              data={[
                {
                  id: "1",
                  title: "Leaking Faucet",
                  status: "In Progress",
                  date: "Mar 18",
                  statusColor: "bg-yellow-500",
                },
                {
                  id: "2",
                  title: "Broken AC",
                  status: "Scheduled",
                  date: "Mar 20",
                  statusColor: "bg-blue-500",
                },
                {
                  id: "3",
                  title: "Light Bulb Replacement",
                  status: "Completed",
                  date: "Mar 15",
                  statusColor: "bg-green-500",
                },
              ]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`p-4 border-b ${styles.borderColor} flex-row items-center`}
                  onPress={() =>
                    navigation.navigate("RequestDetails", { request: item })
                  }
                >
                  <View
                    style={tw`w-10 h-10 ${styles.maintenanceIconBackground} rounded-full items-center justify-center mr-3`}
                  >
                    <Ionicons
                      name="construct"
                      size={20}
                      color={styles.maintenanceIconColor}
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-semibold ${styles.textColor}`}>
                      {item.title}
                    </Text>
                    <View style={tw`flex-row items-center mt-1`}>
                      <View
                        style={tw`w-2 h-2 rounded-full ${item.statusColor} mr-2`}
                      />
                      <Text style={tw`text-sm ${styles.subtextColor}`}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-xs ${styles.subtextColor} mr-2`}>
                      {item.date}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={styles.chevronColor}
                    />
                  </View>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MessagesScreen;
