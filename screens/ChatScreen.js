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
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";

const ChatScreen = ({ route, navigation }) => {
  const { conversation } = route.params;
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(conversation.messages || []);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const flatListRef = useRef(null);
  const { theme } = useTheme();

  const isDark = theme === "dark";
  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-white",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-black",
    subtextColor: isDark ? "text-gray-400" : "text-gray-500",
    inputBackground: isDark ? "bg-gray-700" : "bg-gray-100",
    inputText: isDark ? "text-white" : "text-gray-900",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    modalBackground: isDark ? "bg-gray-800" : "bg-white",
    iconColor: isDark ? "#90caf9" : "#3498db",
    sentMessageBg: isDark ? "bg-blue-800" : "bg-blue-500",
    receivedMessageBg: isDark ? "bg-gray-700" : "bg-gray-200",
    timeTextColor: isDark ? "text-blue-200" : "text-blue-100",
    receivedTimeTextColor: isDark ? "text-gray-500" : "text-gray-500",
    inputBorder: isDark ? "border-gray-600" : "border-gray-200",
  };

  useEffect(() => {
    // Set navigation title and right header button
    navigation.setOptions({
      title: conversation.sender,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowInfoPanel(true)}
          style={tw`mr-2 p-2`}
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={styles.iconColor}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, conversation, theme]);

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
    };

    setChatMessages([newMessage, ...chatMessages]);
    setMessage("");

    // Simulate reply after a short delay for demonstration purposes
    if (conversation.sender === "Maintenance") {
      setTimeout(() => {
        const replyMessage = {
          id: String(Date.now() + 1),
          text: "Thank you for your request. We have logged your issue and will address it as soon as possible. You can track the status in the Maintenance Requests section.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSent: false,
        };
        setChatMessages([replyMessage, newMessage, ...chatMessages]);
      }, 1500);
    } else {
      setTimeout(() => {
        const replyMessage = {
          id: String(Date.now() + 1),
          text: "Thanks for your message. We'll get back to you shortly.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSent: false,
        };
        setChatMessages([replyMessage, newMessage, ...chatMessages]);
      }, 1000);
    }
  };

  // Render individual message bubble
  const renderMessage = ({ item }) => {
    return (
      <View
        style={tw`my-1 mx-3 max-w-3/4 ${
          item.isSent
            ? `self-end ${styles.sentMessageBg} rounded-tl-xl rounded-bl-xl rounded-tr-xl`
            : `self-start ${styles.receivedMessageBg} rounded-tr-xl rounded-br-xl rounded-tl-xl`
        }`}
      >
        <View style={tw`p-3`}>
          <Text
            style={tw`text-base ${
              item.isSent ? "text-white" : styles.textColor
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
            item.isSent
              ? `${styles.timeTextColor} self-end`
              : styles.receivedTimeTextColor
          } px-3 pb-1`}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  // Attachment options modal
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
            style={tw`w-16 h-1 ${styles.receivedMessageBg} rounded-full mx-auto my-3`}
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
                  text: "I found a leak under the sink",
                  image: "/api/placeholder/300/200",
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isSent: true,
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
                  color={isDark ? "#ce93d8" : "#9c27b0"}
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
                navigation.navigate("MaintenanceRequest");
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
                Maintenance
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
                  color={isDark ? "#a5d6a7" : "#2ecc71"}
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

  // Info panel modal
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
            style={tw`w-16 h-1 ${styles.receivedMessageBg} rounded-full mx-auto my-3`}
          />
          <Text
            style={tw`text-xl font-bold text-center mb-4 ${styles.textColor}`}
          >
            Conversation Info
          </Text>

          <View style={tw`px-6 pb-8`}>
            <Card style={`mb-4 ${styles.cardBackground}`}>
              <View style={tw`p-4 items-center`}>
                <View
                  style={tw`w-20 h-20 ${
                    isDark ? "bg-blue-900" : "bg-blue-100"
                  } rounded-full items-center justify-center mb-3`}
                >
                  <Ionicons
                    name={
                      conversation.sender === "Maintenance"
                        ? "construct"
                        : "person"
                    }
                    size={40}
                    color={styles.iconColor}
                  />
                </View>
                <Text style={tw`text-xl font-bold ${styles.textColor}`}>
                  {conversation.sender}
                </Text>
                <Text style={tw`${styles.subtextColor}`}>
                  {conversation.sender === "Maintenance"
                    ? "Maintenance Department"
                    : conversation.sender === "Building Manager"
                    ? "Property Management"
                    : "Resident"}
                </Text>
              </View>
            </Card>

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
                  style={tw`w-12 h-12 ${styles.receivedMessageBg} rounded-full items-center justify-center mb-1`}
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
                  style={tw`w-12 h-12 ${styles.receivedMessageBg} rounded-full items-center justify-center mb-1`}
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
                  navigation.navigate("MaintenanceRequest");
                  setShowInfoPanel(false);
                }}
              >
                <View
                  style={tw`w-12 h-12 ${styles.receivedMessageBg} rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="construct-outline"
                    size={24}
                    color={styles.subtextColor}
                  />
                </View>
                <Text style={tw`text-xs text-center ${styles.textColor}`}>
                  Request
                </Text>
              </TouchableOpacity>

              {conversation.sender !== "Maintenance" && (
                <TouchableOpacity
                  style={tw`items-center`}
                  onPress={() => {
                    setShowInfoPanel(false);
                  }}
                >
                  <View
                    style={tw`w-12 h-12 ${styles.receivedMessageBg} rounded-full items-center justify-center mb-1`}
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
                  style={tw`w-12 h-12 ${styles.receivedMessageBg} rounded-full items-center justify-center mb-1`}
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

            {conversation.sender === "Maintenance" && (
              <View style={tw`mb-4`}>
                <Text
                  style={tw`text-lg font-semibold mb-2 ${styles.textColor}`}
                >
                  Active Requests
                </Text>
                <Card style={styles.cardBackground}>
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
          </View>
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
            style={tw`flex-1 flex-row items-center ${styles.inputBackground} rounded-full px-3 h-full mr-2`}
          >
            <TextInput
              style={tw`flex-1 text-base ${styles.inputText}`}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
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
    </SafeAreaView>
  );
};

export default ChatScreen;
