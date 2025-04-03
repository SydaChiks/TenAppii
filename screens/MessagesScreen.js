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
import { messages } from "../data/dummyData";

const MessagesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("conversations");

  const renderTabs = () => (
    <View style={tw`flex-row mb-4`}>
      <TouchableOpacity
        style={tw`flex-1 py-3 ${
          activeTab === "conversations" ? "border-b-2 border-blue-500" : ""
        }`}
        onPress={() => setActiveTab("conversations")}
      >
        <Text
          style={tw`text-center font-semibold ${
            activeTab === "conversations" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          Conversations
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`flex-1 py-3 ${
          activeTab === "groups" ? "border-b-2 border-blue-500" : ""
        }`}
        onPress={() => setActiveTab("groups")}
      >
        <Text
          style={tw`text-center font-semibold ${
            activeTab === "groups" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          Groups
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {/* Header with blue background */}
      <View style={tw`bg-blue-500 p-6 pt-8 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`max-w-2/3`}>
            <Text style={tw`text-3xl font-bold text-white`}>Messages</Text>
            <Text style={tw`text-blue-100 mt-1`}>
              Stay connected with management and neighbors
            </Text>
          </View>
          <View style={tw`flex-row`}>
            <TouchableOpacity style={tw`p-2 mr-2 bg-blue-400 rounded-full`}>
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`p-2 bg-blue-400 rounded-full`}>
              <Ionicons name="create-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <View style={tw`flex-1`}>
        {/* Card with Fixed Tabs */}
        <View style={tw`px-4 -mt-10`}>
          <Card style="mb-4">{renderTabs()}</Card>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-4 px-4`}
          showsVerticalScrollIndicator={false}
        >
          <Card style="mb-4">
            {activeTab === "conversations" ? (
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`p-4 border-b border-gray-100 flex-row items-center`}
                    onPress={() =>
                      navigation.navigate("Chat", { conversation: item })
                    }
                  >
                    <View
                      style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3`}
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
                        color="#3498db"
                      />
                      {item.unread > 0 && (
                        <View
                          style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center`}
                        >
                          <Text style={tw`text-white text-xs font-bold`}>
                            {item.unread}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={tw`flex-1`}>
                      <View style={tw`flex-row justify-between`}>
                        <Text style={tw`font-semibold text-lg`}>
                          {item.sender}
                        </Text>
                        <Text style={tw`text-gray-500 text-xs`}>
                          {item.messages[0].time}
                        </Text>
                      </View>
                      <Text style={tw`text-gray-600`} numberOfLines={1}>
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
                    style={tw`p-4 border-b border-gray-100 flex-row items-center`}
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
                      style={tw`w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3`}
                    >
                      <Ionicons name="people" size={24} color="#2ecc71" />
                    </View>
                    <View style={tw`flex-1`}>
                      <View style={tw`flex-row justify-between`}>
                        <Text style={tw`font-semibold text-lg`}>
                          {item.name}
                        </Text>
                      </View>
                      <Text style={tw`text-gray-500 text-xs`}>
                        {item.members}
                      </Text>
                      <Text style={tw`text-gray-600 mt-1`} numberOfLines={1}>
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
          <Text style={tw`text-xl font-bold mb-3`}>Quick Actions</Text>
          <View style={tw`flex-row mb-4`}>
            <Card style="flex-1 mr-2">
              <TouchableOpacity
                style={tw`items-center py-4`}
                onPress={() => navigation.navigate("MaintenanceRequest")}
              >
                <View style={tw`p-3 bg-orange-100 rounded-full mb-2`}>
                  <Ionicons
                    name="construct-outline"
                    size={24}
                    color="#e67e22"
                  />
                </View>
                <Text style={tw`font-medium`}>Maintenance Request</Text>
              </TouchableOpacity>
            </Card>
            <Card style="flex-1 ml-2">
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
                <View style={tw`p-3 bg-blue-100 rounded-full mb-2`}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color="#3498db"
                  />
                </View>
                <Text style={tw`font-medium`}>New Message</Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Maintenance Request Status */}
          <Text style={tw`text-xl font-bold mb-3`}>Maintenance Requests</Text>
          <Card style="mb-4">
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
                  style={tw`p-4 border-b border-gray-100 flex-row items-center`}
                  onPress={() =>
                    navigation.navigate("RequestDetails", { request: item })
                  }
                >
                  <View
                    style={tw`w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3`}
                  >
                    <Ionicons name="construct" size={20} color="#e67e22" />
                  </View>
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`font-semibold`}>{item.title}</Text>
                      <Text style={tw`text-gray-500 text-xs`}>{item.date}</Text>
                    </View>
                    <View style={tw`flex-row items-center mt-1`}>
                      <View
                        style={tw`w-2 h-2 rounded-full ${item.statusColor} mr-2`}
                      />
                      <Text style={tw`text-gray-600 text-sm`}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
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
