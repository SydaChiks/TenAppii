import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import Button from "../components/Button";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";

const RequestDetailsScreen = ({ route, navigation }) => {
  const { request } = route.params;
  const [comment, setComment] = useState("");
  const { theme } = useTheme();

  const isDark = theme === "dark";
  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-100",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-black",
    subtextColor: isDark ? "text-gray-400" : "text-gray-500",
    inputBackground: isDark ? "bg-gray-700" : "bg-gray-100",
    inputText: isDark ? "text-white" : "text-gray-900",
    borderColor: isDark ? "border-gray-700" : "border-gray-300",
    iconColor: isDark ? "#90caf9" : "#3498db",
    dangerBg: isDark ? "bg-red-900" : "bg-red-100",
    dangerIcon: isDark ? "#ef9a9a" : "#e74c3c",
    successIcon: isDark ? "#a5d6a7" : "#2ecc71",
    timelineDot: isDark ? "bg-blue-400" : "bg-blue-500",
    timelineLine: isDark ? "border-gray-600" : "border-gray-300",
  };

  // Mock data - in a real app, this would come from your API
  const requestDetails = {
    ...request,
    description:
      "Water is leaking from the kitchen sink pipe whenever I use the faucet. There's a small puddle forming underneath.",
    category: "Plumbing",
    dateSubmitted: "March 18, 2025",
    assignedTo: "John Davis",
    estimatedCompletion: "March 21, 2025",
    permitEntry: true,
    photos: ["/api/placeholder/300/200?text=Sink+Photo"],
    updates: [
      {
        id: "1",
        date: "Mar 18, 2025",
        time: "10:15 AM",
        text: "Request received and scheduled for assessment",
        user: "System",
      },
      {
        id: "2",
        date: "Mar 19, 2025",
        time: "2:30 PM",
        text: "Technician assigned to request",
        user: "Building Manager",
      },
      {
        id: "3",
        date: "Mar 19, 2025",
        time: "4:45 PM",
        text: "Assessment completed. Parts have been ordered and will arrive tomorrow. Repair scheduled for March 21.",
        user: "John Davis",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return isDark ? "bg-gray-500" : "bg-gray-500";
      case "Scheduled":
        return isDark ? "bg-blue-600" : "bg-blue-500";
      case "In Progress":
        return isDark ? "bg-yellow-600" : "bg-yellow-500";
      case "Completed":
        return isDark ? "bg-green-600" : "bg-green-500";
      case "Cancelled":
        return isDark ? "bg-red-600" : "bg-red-500";
      default:
        return isDark ? "bg-gray-500" : "bg-gray-500";
    }
  };

  const addComment = () => {
    if (comment.trim() === "") return;

    // In a real app, you would send this to your API
    alert("Comment submitted: " + comment);
    setComment("");
  };

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={styles.statusBarStyle}
        backgroundColor={styles.statusBarColor}
      />

      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-5`}>
          {/* Header */}
          <View style={tw`flex-row items-center mb-6`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`p-2 mr-4`}
            >
              <Ionicons name="arrow-back" size={24} color={styles.iconColor} />
            </TouchableOpacity>
            <Text style={tw`text-2xl font-bold flex-1 ${styles.textColor}`}>
              Request Details
            </Text>

            {request.status !== "Completed" &&
              request.status !== "Cancelled" && (
                <TouchableOpacity
                  style={tw`p-2 ${styles.dangerBg} rounded-full`}
                  onPress={() => {
                    // In a real app, you would send this to your API
                    alert("Request cancelled");
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color={styles.dangerIcon}
                  />
                </TouchableOpacity>
              )}
          </View>

          {/* Status Card */}
          <Card style={`mb-5 ${styles.cardBackground}`}>
            <View style={tw`p-4`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-lg font-semibold ${styles.textColor}`}>
                  {requestDetails.title}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <View
                    style={tw`w-3 h-3 rounded-full ${getStatusColor(
                      requestDetails.status
                    )} mr-2`}
                  />
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {requestDetails.status}
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row mb-3`}>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>
                    Category
                  </Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {requestDetails.category}
                  </Text>
                </View>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>
                    Submitted
                  </Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {requestDetails.dateSubmitted}
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row mb-3`}>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>
                    Assigned To
                  </Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {requestDetails.assignedTo || "Not assigned yet"}
                  </Text>
                </View>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>
                    Est. Completion
                  </Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {requestDetails.estimatedCompletion || "Not scheduled"}
                  </Text>
                </View>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-sm ${styles.subtextColor} mb-1`}>
                  Description
                </Text>
                <Text style={tw`${styles.textColor}`}>
                  {requestDetails.description}
                </Text>
              </View>

              {requestDetails.photos && requestDetails.photos.length > 0 && (
                <View style={tw`mb-3`}>
                  <Text style={tw`text-sm ${styles.subtextColor} mb-2`}>
                    Photos
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {requestDetails.photos.map((photo, index) => (
                      <Image
                        key={index}
                        source={{ uri: photo }}
                        style={tw`w-40 h-40 rounded-lg mr-3`}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Permit Entry Status */}
              <View style={tw`flex-row items-center mt-2`}>
                <Ionicons
                  name={
                    requestDetails.permitEntry
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={20}
                  color={
                    requestDetails.permitEntry
                      ? styles.successIcon
                      : styles.dangerIcon
                  }
                  style={tw`mr-2`}
                />
                <Text style={tw`${styles.textColor}`}>
                  {requestDetails.permitEntry
                    ? "Permission to enter when absent: Granted"
                    : "Permission to enter when absent: Denied"}
                </Text>
              </View>
            </View>
          </Card>

          {/* Updates/Timeline */}
          <Card style={`mb-5 ${styles.cardBackground}`}>
            <View style={tw`p-4`}>
              <Text style={tw`text-lg font-semibold mb-4 ${styles.textColor}`}>
                Updates
              </Text>

              {requestDetails.updates.map((update, index) => (
                <View
                  key={update.id}
                  style={tw`mb-4 ${
                    index !== requestDetails.updates.length - 1
                      ? `border-l-2 ${styles.timelineLine} pl-4 pb-2`
                      : ""
                  }`}
                >
                  <View
                    style={tw`${
                      index !== requestDetails.updates.length - 1
                        ? `absolute -left-1.5 top-0 w-3 h-3 rounded-full ${styles.timelineDot}`
                        : ""
                    }`}
                  />
                  <Text style={tw`text-xs ${styles.subtextColor}`}>
                    {update.date} - {update.time}
                  </Text>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {update.user}
                  </Text>
                  <Text style={tw`mt-1 ${styles.textColor}`}>
                    {update.text}
                  </Text>
                </View>
              ))}

              {/* Add comment section */}
              <View style={tw`mt-4 pt-4 border-t ${styles.borderColor}`}>
                <Text style={tw`font-medium mb-2 ${styles.textColor}`}>
                  Add Comment
                </Text>
                <View style={tw`flex-row`}>
                  <TextInput
                    style={tw`flex-1 border ${styles.borderColor} rounded-lg p-3 mr-2 ${styles.inputBackground} ${styles.inputText}`}
                    placeholder="Write a comment..."
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                  />
                  <TouchableOpacity
                    style={tw`bg-blue-500 w-10 h-10 rounded-full items-center justify-center`}
                    onPress={addComment}
                    disabled={comment.trim() === ""}
                  >
                    <Ionicons name="send" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>

          {/* Actions */}
          <View style={tw`flex-row justify-between mb-5`}>
            <Button
              title="Message Maintenance"
              onPress={() =>
                navigation.navigate("Chat", {
                  conversation: {
                    id: "maintenance",
                    sender: "Maintenance",
                    messages: [
                      {
                        id: "1",
                        text: "How can we help with your request today?",
                        time: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        isSent: false,
                      },
                    ],
                  },
                })
              }
              style="flex-1 mr-2"
              type="outlined"
              darkMode={isDark}
            />

            {request.status === "In Progress" && (
              <Button
                title="Mark Completed"
                onPress={() => {
                  // In a real app, you would send this to your API
                  alert("Request marked as completed");
                  navigation.goBack();
                }}
                style="flex-1 ml-2"
                darkMode={isDark}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestDetailsScreen;
