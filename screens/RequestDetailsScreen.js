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

const RequestDetailsScreen = ({ route, navigation }) => {
  const { request } = route.params;
  const [comment, setComment] = useState("");

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
        return "bg-gray-500";
      case "Scheduled":
        return "bg-blue-500";
      case "In Progress":
        return "bg-yellow-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const addComment = () => {
    if (comment.trim() === "") return;

    // In a real app, you would send this to your API
    alert("Comment submitted: " + comment);
    setComment("");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-5`}>
          {/* Header */}
          <View style={tw`flex-row items-center mb-6`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`p-2 mr-4`}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={tw`text-2xl font-bold flex-1`}>Request Details</Text>

            {request.status !== "Completed" &&
              request.status !== "Cancelled" && (
                <TouchableOpacity
                  style={tw`p-2 bg-red-100 rounded-full`}
                  onPress={() => {
                    // In a real app, you would send this to your API
                    alert("Request cancelled");
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color="#e74c3c"
                  />
                </TouchableOpacity>
              )}
          </View>

          {/* Status Card */}
          <Card style="mb-5">
            <View style={tw`p-4`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-lg font-semibold`}>
                  {requestDetails.title}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <View
                    style={tw`w-3 h-3 rounded-full ${getStatusColor(
                      requestDetails.status
                    )} mr-2`}
                  />
                  <Text style={tw`font-medium`}>{requestDetails.status}</Text>
                </View>
              </View>

              <View style={tw`flex-row mb-3`}>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-gray-500 text-sm`}>Category</Text>
                  <Text style={tw`font-medium`}>{requestDetails.category}</Text>
                </View>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-gray-500 text-sm`}>Submitted</Text>
                  <Text style={tw`font-medium`}>
                    {requestDetails.dateSubmitted}
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row mb-3`}>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-gray-500 text-sm`}>Assigned To</Text>
                  <Text style={tw`font-medium`}>
                    {requestDetails.assignedTo || "Not assigned yet"}
                  </Text>
                </View>
                <View style={tw`w-1/2`}>
                  <Text style={tw`text-gray-500 text-sm`}>Est. Completion</Text>
                  <Text style={tw`font-medium`}>
                    {requestDetails.estimatedCompletion || "Not scheduled"}
                  </Text>
                </View>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-500 text-sm mb-1`}>Description</Text>
                <Text>{requestDetails.description}</Text>
              </View>

              {requestDetails.photos && requestDetails.photos.length > 0 && (
                <View style={tw`mb-3`}>
                  <Text style={tw`text-gray-500 text-sm mb-2`}>Photos</Text>
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
                  color={requestDetails.permitEntry ? "#2ecc71" : "#e74c3c"}
                  style={tw`mr-2`}
                />
                <Text>
                  {requestDetails.permitEntry
                    ? "Permission to enter when absent: Granted"
                    : "Permission to enter when absent: Denied"}
                </Text>
              </View>
            </View>
          </Card>

          {/* Updates/Timeline */}
          <Card style="mb-5">
            <View style={tw`p-4`}>
              <Text style={tw`text-lg font-semibold mb-4`}>Updates</Text>

              {requestDetails.updates.map((update, index) => (
                <View
                  key={update.id}
                  style={tw`mb-4 ${
                    index !== requestDetails.updates.length - 1
                      ? "border-l-2 border-gray-300 pl-4 pb-2"
                      : ""
                  }`}
                >
                  <View
                    style={tw`${
                      index !== requestDetails.updates.length - 1
                        ? "absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500"
                        : ""
                    }`}
                  />
                  <Text style={tw`text-gray-500 text-xs`}>
                    {update.date} - {update.time}
                  </Text>
                  <Text style={tw`font-medium`}>{update.user}</Text>
                  <Text style={tw`mt-1`}>{update.text}</Text>
                </View>
              ))}

              {/* Add comment section */}
              <View style={tw`mt-4 pt-4 border-t border-gray-200`}>
                <Text style={tw`font-medium mb-2`}>Add Comment</Text>
                <View style={tw`flex-row`}>
                  <TextInput
                    style={tw`flex-1 border border-gray-300 rounded-lg p-3 mr-2`}
                    placeholder="Write a comment..."
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
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestDetailsScreen;
