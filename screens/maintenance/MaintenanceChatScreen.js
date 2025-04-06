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
import { useTheme } from "../../context/ThemeContext";

const MaintenanceChatScreen = ({ route, navigation }) => {
  const { chatType = "direct", chatData = { name: "Chat", messages: [] } } =
    route.params || {};
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(chatData.messages || []);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const flatListRef = useRef(null);
  const { theme } = useTheme();

  const isDark = theme === "dark";
  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-white",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-gray-800",
    subtextColor: isDark ? "text-gray-400" : "text-gray-600",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    dividerColor: isDark ? "bg-gray-700" : "bg-gray-200",
    inputBackground: isDark ? "bg-gray-700" : "bg-gray-100",
    inputText: isDark ? "text-white" : "text-black",
    placeholderText: isDark ? "text-gray-400" : "text-gray-500",
    sentMessageBg: isDark ? "bg-blue-600" : "bg-blue-500",
    receivedMessageBg: isDark ? "bg-gray-700" : "bg-gray-200",
    sentMessageText: "text-white",
    receivedMessageText: isDark ? "text-white" : "text-black",
    modalBackground: isDark ? "bg-gray-800" : "bg-white",
    modalHandle: isDark ? "bg-gray-600" : "bg-gray-300",
    iconColor: isDark ? "#90caf9" : "#3498db",
    dangerButton: isDark ? "bg-red-600" : "bg-red-500",
    dangerText: "text-white",
    onlineIndicator: isDark ? "bg-green-400" : "bg-green-500",
    offlineIndicator: isDark ? "bg-gray-500" : "bg-gray-400",
  };

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
              <Ionicons name="people" size={24} color={styles.iconColor} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setShowInfoPanel(true)}
            style={tw`p-2`}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={styles.iconColor}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, chatData, chatType, styles.iconColor]);

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
      sender: "You",
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
            ? `${styles.sentMessageBg} rounded-tl-xl rounded-bl-xl rounded-tr-xl`
            : `${styles.receivedMessageBg} rounded-tr-xl rounded-br-xl rounded-tl-xl`
        }`}
      >
        <View style={tw`p-3`}>
          {chatType === "group" && !item.isSent && (
            <Text
              style={tw`text-xs font-semibold ${
                item.isSent ? "text-blue-100" : styles.subtextColor
              } mb-1`}
            >
              {item.sender}
            </Text>
          )}
          <Text
            style={tw`text-base ${
              item.isSent ? styles.sentMessageText : styles.receivedMessageText
            }`}
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
            item.isSent ? "text-blue-100 self-end" : styles.subtextColor
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
        <View
          style={tw`absolute bottom-0 w-full ${styles.modalBackground} rounded-t-3xl`}
        >
          <View
            style={tw`w-16 h-1 ${styles.modalHandle} rounded-full mx-auto my-3`}
          />
          <Text
            style={tw`text-xl font-bold text-center mb-4 ${styles.textColor}`}
          >
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
                style={tw`w-16 h-16 ${
                  isDark ? "bg-blue-900" : "bg-blue-100"
                } rounded-full items-center justify-center mb-2`}
              >
                <Ionicons name="camera" size={30} color={styles.iconColor} />
              </View>
              <Text style={tw`text-sm font-medium ${styles.textColor}`}>
                Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                setShowAttachmentOptions(false);
              }}
            >
              <View
                style={tw`w-16 h-16 ${
                  isDark ? "bg-purple-900" : "bg-purple-100"
                } rounded-full items-center justify-center mb-2`}
              >
                <Ionicons
                  name="image"
                  size={30}
                  color={isDark ? "#ba68c8" : "#9c27b0"}
                />
              </View>
              <Text style={tw`text-sm font-medium ${styles.textColor}`}>
                Photos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                setShowAttachmentOptions(false);
              }}
            >
              <View
                style={tw`w-16 h-16 ${
                  isDark ? "bg-orange-900" : "bg-orange-100"
                } rounded-full items-center justify-center mb-2`}
              >
                <Ionicons
                  name="document"
                  size={30}
                  color={isDark ? "#ffb74d" : "#e67e22"}
                />
              </View>
              <Text style={tw`text-sm font-medium ${styles.textColor}`}>
                Document
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                navigation.navigate("MaintenanceJobs");
                setShowAttachmentOptions(false);
              }}
            >
              <View
                style={tw`w-16 h-16 ${
                  isDark ? "bg-red-900" : "bg-red-100"
                } rounded-full items-center justify-center mb-2`}
              >
                <Ionicons
                  name="construct"
                  size={30}
                  color={isDark ? "#ef9a9a" : "#e53935"}
                />
              </View>
              <Text style={tw`text-sm font-medium ${styles.textColor}`}>
                Job Reference
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center mx-4`}
              onPress={() => {
                setShowAttachmentOptions(false);
              }}
            >
              <View
                style={tw`w-16 h-16 ${
                  isDark ? "bg-green-900" : "bg-green-100"
                } rounded-full items-center justify-center mb-2`}
              >
                <Ionicons
                  name="location"
                  size={30}
                  color={isDark ? "#81c784" : "#2ecc71"}
                />
              </View>
              <Text style={tw`text-sm font-medium ${styles.textColor}`}>
                Location
              </Text>
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
        <View
          style={tw`absolute bottom-0 w-full ${styles.modalBackground} rounded-t-3xl`}
        >
          <View
            style={tw`w-16 h-1 ${styles.modalHandle} rounded-full mx-auto my-3`}
          />
          <Text
            style={tw`text-xl font-bold text-center mb-4 ${styles.textColor}`}
          >
            {chatType === "group" ? "Group Info" : "Chat Info"}
          </Text>

          <ScrollView style={tw`px-6 pb-8`}>
            <Card style="mb-4">
              <View style={tw`p-4 items-center`}>
                <View
                  style={tw`w-20 h-20 ${
                    chatType === "group"
                      ? isDark
                        ? "bg-green-900"
                        : "bg-green-100"
                      : isDark
                      ? "bg-blue-900"
                      : "bg-blue-100"
                  } rounded-full items-center justify-center mb-3`}
                >
                  <Ionicons
                    name={chatType === "group" ? "people" : "person"}
                    size={40}
                    color={
                      chatType === "group"
                        ? isDark
                          ? "#81c784"
                          : "#2ecc71"
                        : styles.iconColor
                    }
                  />
                </View>
                <Text style={tw`text-xl font-bold ${styles.textColor}`}>
                  {chatData.name}
                </Text>
                <Text style={tw`${styles.subtextColor}`}>
                  {chatType === "group"
                    ? "Maintenance Team"
                    : chatData.role || "Tenant"}
                </Text>
              </View>
            </Card>

            {chatType === "group" && (
              <>
                <Text
                  style={tw`text-lg font-semibold mb-2 ${styles.textColor}`}
                >
                  Description
                </Text>
                <Text style={tw`${styles.subtextColor} mb-4`}>
                  {chatData.description ||
                    "Team coordination for maintenance requests and building upkeep"}
                </Text>
              </>
            )}

            <Text style={tw`text-lg font-semibold mb-2 ${styles.textColor}`}>
              Actions
            </Text>
            <View style={tw`flex-row justify-between mb-4`}>
              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => {
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="notifications-off-outline"
                    size={24}
                    color={styles.subtextColor}
                  />
                </View>
                <Text style={tw`text-xs text-center ${styles.textColor}`}>
                  Mute
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => {
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={styles.subtextColor}
                  />
                </View>
                <Text style={tw`text-xs text-center ${styles.textColor}`}>
                  Search
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => {
                  navigation.navigate("MaintenanceJobs");
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="construct-outline"
                    size={24}
                    color={styles.subtextColor}
                  />
                </View>
                <Text style={tw`text-xs text-center ${styles.textColor}`}>
                  Jobs
                </Text>
              </TouchableOpacity>

              {chatType === "direct" && (
                <TouchableOpacity
                  style={tw`items-center`}
                  onPress={() => {
                    setShowInfoPanel(false);
                  }}
                >
                  <View
                    style={tw`w-12 h-12 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } rounded-full items-center justify-center mb-1`}
                  >
                    <Ionicons
                      name="person-remove-outline"
                      size={24}
                      color={styles.subtextColor}
                    />
                  </View>
                  <Text style={tw`text-xs text-center ${styles.textColor}`}>
                    Block
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => {
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="flag-outline"
                    size={24}
                    color={styles.subtextColor}
                  />
                </View>
                <Text style={tw`text-xs text-center ${styles.textColor}`}>
                  Report
                </Text>
              </TouchableOpacity>
            </View>

            {chatType === "direct" && (
              <View style={tw`mb-4`}>
                <Text
                  style={tw`text-lg font-semibold mb-2 ${styles.textColor}`}
                >
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
                      style={tw`w-10 h-10 ${
                        isDark ? "bg-orange-900" : "bg-orange-100"
                      } rounded-full items-center justify-center mr-3`}
                    >
                      <Ionicons
                        name="construct"
                        size={20}
                        color={isDark ? "#ffb74d" : "#e67e22"}
                      />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-semibold ${styles.textColor}`}>
                        Leaking Faucet
                      </Text>
                      <View style={tw`flex-row items-center mt-1`}>
                        <View
                          style={tw`w-2 h-2 rounded-full bg-yellow-500 mr-2`}
                        />
                        <Text style={tw`${styles.subtextColor} text-sm`}>
                          In Progress
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={styles.subtextColor}
                    />
                  </TouchableOpacity>
                </Card>
              </View>
            )}

            <TouchableOpacity
              style={tw`${styles.dangerButton} py-3 rounded-full items-center`}
              onPress={() => {
                setChatMessages([]);
                setShowInfoPanel(false);
              }}
            >
              <Text style={tw`${styles.dangerText} font-semibold`}>
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
        <View
          style={tw`absolute bottom-0 w-full ${styles.modalBackground} rounded-t-3xl`}
        >
          <View
            style={tw`w-16 h-1 ${styles.modalHandle} rounded-full mx-auto my-3`}
          />
          <Text
            style={tw`text-xl font-bold text-center mb-4 ${styles.textColor}`}
          >
            Team Members
          </Text>

          <ScrollView style={tw`px-6 pb-8 max-h-96`}>
            {maintenanceTeam.map((member) => (
              <View
                key={member.id}
                style={tw`flex-row items-center p-3 border-b ${styles.borderColor}`}
              >
                <View
                  style={tw`w-12 h-12 ${
                    isDark ? "bg-blue-900" : "bg-blue-100"
                  } rounded-full items-center justify-center mr-3`}
                >
                  <Ionicons name="person" size={24} color={styles.iconColor} />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {member.name}
                  </Text>
                  <Text style={tw`${styles.subtextColor} text-sm`}>
                    {member.role}
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <View
                    style={tw`w-2 h-2 rounded-full ${
                      member.online
                        ? styles.onlineIndicator
                        : styles.offlineIndicator
                    } mr-2`}
                  />
                  <Text style={tw`${styles.subtextColor} text-xs`}>
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
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={styles.statusBarStyle}
        backgroundColor={styles.statusBarColor}
      />

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
          contentContainerStyle={tw`flex-grow justify-end pt-4`}
          style={tw`flex-1`}
          ListEmptyComponent={() => (
            <View style={tw`flex-1 items-center justify-center py-12`}>
              <View
                style={tw`w-16 h-16 ${
                  isDark ? "bg-blue-900" : "bg-blue-100"
                } rounded-full items-center justify-center mb-4`}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={32}
                  color={styles.iconColor}
                />
              </View>
              <Text style={tw`${styles.subtextColor} text-center`}>
                No messages yet
              </Text>
              <Text style={tw`${styles.subtextColor} text-center mt-1`}>
                Start the conversation!
              </Text>
            </View>
          )}
        />

        {/* Message input section */}
        <View
          style={tw`border-t ${styles.borderColor} px-2 py-2 flex-row items-center`}
        >
          <TouchableOpacity
            onPress={() => setShowAttachmentOptions(true)}
            style={tw`p-2 mr-1`}
          >
            <Ionicons name="add-circle" size={24} color={styles.iconColor} />
          </TouchableOpacity>

          <View
            style={tw`flex-1 flex-row items-center ${styles.inputBackground} rounded-full px-3 py-2 mr-2`}
          >
            <TextInput
              style={tw`flex-1 text-base ${styles.inputText}`}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={styles.placeholderText}
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
