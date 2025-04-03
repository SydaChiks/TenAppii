import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import Card from "../../components/Card";

const MaintenanceChatScreen = ({ route, navigation }) => {
  const { chatType, chatData } = route.params; // 'group' or 'direct'
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(chatData.messages || []);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const flatListRef = useRef(null);

  // Mock maintenance team members
  const maintenanceTeam = [
    { id: "1", name: "John Smith", role: "Plumber", online: true },
    { id: "2", name: "Maria Garcia", role: "Electrician", online: false },
    { id: "3", name: "David Kim", role: "HVAC Technician", online: true },
    { id: "4", name: "Sarah Johnson", role: "Supervisor", online: true },
  ];

  useEffect(() => {
    navigation.setOptions({
      title: chatData.name,
      headerRight: () => (
        <View style={tw`flex-row items-center`}>
          {chatType === "group" && (
            <TouchableOpacity
              onPress={() => setShowMembersModal(true)}
              style={tw`p-2 mr-1`}
            >
              <Ionicons name="people" size={24} color="#3498db" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setShowInfoPanel(true)}
            style={tw`p-2`}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#3498db"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, chatData, chatType]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: String(Date.now()),
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: true,
      sender: "You", // For group chats
    };

    setChatMessages([newMessage, ...chatMessages]);
    setMessage("");

    // Simulate reply after a short delay
    setTimeout(() => {
      const replyMessage = {
        id: String(Date.now() + 1),
        text:
          chatType === "group"
            ? "I'll take care of this issue. Can someone check the inventory for spare parts?"
            : "Thank you for your message. We'll address your request as soon as possible.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSent: false,
        sender: chatType === "group" ? "Maria Garcia" : chatData.name,
      };
      setChatMessages([replyMessage, newMessage, ...chatMessages]);
    }, 1500);
  };

  const renderMessage = ({ item }) => {
    return (
      <View
        style={tw`my-1 mx-3 max-w-3/4 ${
          item.isSent
            ? "self-end bg-blue-500 rounded-tl-xl rounded-bl-xl rounded-tr-xl"
            : "self-start bg-gray-200 rounded-tr-xl rounded-br-xl rounded-tl-xl"
        }`}
      >
        <View style={tw`p-3`}>
          {chatType === "group" && !item.isSent && (
            <Text
              style={tw`text-xs font-semibold ${
                item.isSent ? "text-blue-100" : "text-gray-700"
              } mb-1`}
            >
              {item.sender}
            </Text>
          )}
          <Text
            style={tw`text-base ${item.isSent ? "text-white" : "text-black"}`}
          >
            {item.text}
          </Text>
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={tw`w-full h-48 rounded-lg mt-2`}
              resizeMode="cover"
            />
          )}
        </View>
        <Text
          style={tw`text-xs ${
            item.isSent ? "text-blue-100 self-end" : "text-gray-500"
          } px-3 pb-1`}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  const renderAttachmentOptions = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAttachmentOptions}
      onRequestClose={() => setShowAttachmentOptions(false)}
    >
      <Pressable
        style={tw`flex-1 bg-black bg-opacity-50`}
        onPress={() => setShowAttachmentOptions(false)}
      >
        <View style={tw`absolute bottom-0 w-full bg-white rounded-t-3xl`}>
          <View style={tw`w-16 h-1 bg-gray-300 rounded-full mx-auto my-3`} />
          <Text style={tw`text-xl font-bold text-center mb-4`}>
            Add Attachment
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`px-4 pb-8`}
          >
            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                setShowAttachmentOptions(false);
                const photoMessage = {
                  id: String(Date.now()),
                  text: "Attached maintenance photo",
                  image: "/api/placeholder/300/200",
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isSent: true,
                  sender: "You",
                };
                setChatMessages([photoMessage, ...chatMessages]);
              }}
            >
              <View
                style={tw`w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-2`}
              >
                <Ionicons name="camera" size={30} color="#3498db" />
              </View>
              <Text style={tw`text-sm font-medium`}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                setShowAttachmentOptions(false);
              }}
            >
              <View
                style={tw`w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-2`}
              >
                <Ionicons name="image" size={30} color="#9c27b0" />
              </View>
              <Text style={tw`text-sm font-medium`}>Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                setShowAttachmentOptions(false);
              }}
            >
              <View
                style={tw`w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-2`}
              >
                <Ionicons name="document" size={30} color="#e67e22" />
              </View>
              <Text style={tw`text-sm font-medium`}>Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                navigation.navigate("MaintenanceJobs");
                setShowAttachmentOptions(false);
              }}
            >
              <View
                style={tw`w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-2`}
              >
                <Ionicons name="construct" size={30} color="#e53935" />
              </View>
              <Text style={tw`text-sm font-medium`}>Job Reference</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                setShowAttachmentOptions(false);
              }}
            >
              <View
                style={tw`w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-2`}
              >
                <Ionicons name="location" size={30} color="#2ecc71" />
              </View>
              <Text style={tw`text-sm font-medium`}>Location</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );

  const renderInfoPanel = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showInfoPanel}
      onRequestClose={() => setShowInfoPanel(false)}
    >
      <Pressable
        style={tw`flex-1 bg-black bg-opacity-50`}
        onPress={() => setShowInfoPanel(false)}
      >
        <View style={tw`absolute bottom-0 w-full bg-white rounded-t-3xl`}>
          <View style={tw`w-16 h-1 bg-gray-300 rounded-full mx-auto my-3`} />
          <Text style={tw`text-xl font-bold text-center mb-4`}>
            {chatType === "group" ? "Group Info" : "Chat Info"}
          </Text>

          <ScrollView style={tw`px-6 pb-8`}>
            <Card style="mb-4">
              <View style={tw`p-4 items-center`}>
                <View
                  style={tw`w-20 h-20 ${
                    chatType === "group" ? "bg-green-100" : "bg-blue-100"
                  } rounded-full items-center justify-center mb-3`}
                >
                  <Ionicons
                    name={chatType === "group" ? "people" : "person"}
                    size={40}
                    color={chatType === "group" ? "#2ecc71" : "#3498db"}
                  />
                </View>
                <Text style={tw`text-xl font-bold`}>{chatData.name}</Text>
                <Text style={tw`text-gray-500`}>
                  {chatType === "group"
                    ? "Maintenance Team"
                    : chatData.role || "Tenant"}
                </Text>
              </View>
            </Card>

            {chatType === "group" && (
              <>
                <Text style={tw`text-lg font-semibold mb-2`}>Description</Text>
                <Text style={tw`text-gray-600 mb-4`}>
                  {chatData.description ||
                    "Team coordination for maintenance requests and building upkeep"}
                </Text>
              </>
            )}

            <Text style={tw`text-lg font-semibold mb-2`}>Actions</Text>
            <View style={tw`flex-row justify-between mb-4`}>
              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => {
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="notifications-off-outline"
                    size={24}
                    color="#555"
                  />
                </View>
                <Text style={tw`text-xs text-center`}>Mute</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => {
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons name="search-outline" size={24} color="#555" />
                </View>
                <Text style={tw`text-xs text-center`}>Search</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => {
                  navigation.navigate("MaintenanceJobs");
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons name="construct-outline" size={24} color="#555" />
                </View>
                <Text style={tw`text-xs text-center`}>Jobs</Text>
              </TouchableOpacity>

              {chatType === "direct" && (
                <TouchableOpacity
                  style={tw`items-center`}
                  onPress={() => {
                    setShowInfoPanel(false);
                  }}
                >
                  <View
                    style={tw`w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1`}
                  >
                    <Ionicons
                      name="person-remove-outline"
                      size={24}
                      color="#555"
                    />
                  </View>
                  <Text style={tw`text-xs text-center`}>Block</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => {
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons name="flag-outline" size={24} color="#555" />
                </View>
                <Text style={tw`text-xs text-center`}>Report</Text>
              </TouchableOpacity>
            </View>

            {chatType === "direct" && (
              <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-semibold mb-2`}>
                  Active Requests
                </Text>
                <Card>
                  <TouchableOpacity
                    style={tw`p-4 flex-row items-center`}
                    onPress={() => {
                      navigation.navigate("RequestDetails", {
                        request: {
                          id: "1",
                          title: "Leaking Faucet",
                          status: "In Progress",
                          date: "Mar 18",
                          statusColor: "bg-yellow-500",
                        },
                      });
                      setShowInfoPanel(false);
                    }}
                  >
                    <View
                      style={tw`w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3`}
                    >
                      <Ionicons name="construct" size={20} color="#e67e22" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-semibold`}>Leaking Faucet</Text>
                      <View style={tw`flex-row items-center mt-1`}>
                        <View
                          style={tw`w-2 h-2 rounded-full bg-yellow-500 mr-2`}
                        />
                        <Text style={tw`text-gray-600 text-sm`}>
                          In Progress
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                </Card>
              </View>
            )}

            <TouchableOpacity
              style={tw`bg-red-500 py-3 rounded-full items-center`}
              onPress={() => {
                setChatMessages([]);
                setShowInfoPanel(false);
              }}
            >
              <Text style={tw`text-white font-semibold`}>
                Clear Conversation
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );

  const renderMembersModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showMembersModal}
      onRequestClose={() => setShowMembersModal(false)}
    >
      <Pressable
        style={tw`flex-1 bg-black bg-opacity-50`}
        onPress={() => setShowMembersModal(false)}
      >
        <View style={tw`absolute bottom-0 w-full bg-white rounded-t-3xl`}>
          <View style={tw`w-16 h-1 bg-gray-300 rounded-full mx-auto my-3`} />
          <Text style={tw`text-xl font-bold text-center mb-4`}>
            Team Members
          </Text>

          <ScrollView style={tw`px-6 pb-8 max-h-96`}>
            {maintenanceTeam.map((member) => (
              <View
                key={member.id}
                style={tw`flex-row items-center p-3 border-b border-gray-100`}
              >
                <View
                  style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3`}
                >
                  <Ionicons name="person" size={24} color="#3498db" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium`}>{member.name}</Text>
                  <Text style={tw`text-gray-500 text-sm`}>{member.role}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <View
                    style={tw`w-2 h-2 rounded-full ${
                      member.online ? "bg-green-500" : "bg-gray-400"
                    } mr-2`}
                  />
                  <Text style={tw`text-gray-500 text-xs`}>
                    {member.online ? "Online" : "Offline"}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={tw`bg-blue-500 py-3 rounded-full items-center mt-4`}
              onPress={() => setShowMembersModal(false)}
            >
              <Text style={tw`text-white font-semibold`}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Messages section */}
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted={true}
          contentContainerStyle={tw`flex-grow justify-end pt-4`}
          style={tw`flex-1`}
          ListEmptyComponent={() => (
            <View style={tw`flex-1 items-center justify-center py-12`}>
              <View
                style={tw`w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4`}
              >
                <Ionicons name="chatbubble-outline" size={32} color="#3498db" />
              </View>
              <Text style={tw`text-gray-500 text-center`}>No messages yet</Text>
              <Text style={tw`text-gray-400 text-center mt-1`}>
                Start the conversation!
              </Text>
            </View>
          )}
        />

        {/* Message input section */}
        <View
          style={tw`border-t border-gray-200 px-2 py-2 flex-row items-center`}
        >
          <TouchableOpacity
            onPress={() => setShowAttachmentOptions(true)}
            style={tw`p-2 mr-1`}
          >
            <Ionicons name="add-circle" size={24} color="#3498db" />
          </TouchableOpacity>

          <View
            style={tw`flex-1 flex-row items-center bg-gray-100 rounded-full px-3 py-2 mr-2`}
          >
            <TextInput
              style={tw`flex-1 text-base`}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              multiline
              maxHeight={100}
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            style={tw`bg-blue-500 w-10 h-10 rounded-full items-center justify-center`}
            disabled={message.trim() === ""}
          >
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {renderAttachmentOptions()}
      {renderInfoPanel()}
      {renderMembersModal()}
    </SafeAreaView>
  );
};

export default MaintenanceChatScreen;
