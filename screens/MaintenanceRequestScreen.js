import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import Button from "../components/Button";
import Card from "../components/Card";

const MaintenanceRequestScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [permitEntry, setPermitEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const categories = [
    { id: "1", name: "Plumbing", icon: "water" },
    { id: "2", name: "Electrical", icon: "flash" },
    { id: "3", name: "HVAC", icon: "thermometer" },
    { id: "4", name: "Appliance", icon: "restaurant" },
    { id: "5", name: "Structural", icon: "home" },
    { id: "6", name: "Pest Control", icon: "bug" },
    { id: "7", name: "Other", icon: "help-circle" },
  ];

  const addPhoto = () => {
    // In a real app, this would open the camera or photo library
    const newPhoto = `/api/placeholder/300/200?text=Photo ${photos.length + 1}`;
    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const submitRequest = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your request");
      return;
    }

    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate back to messages with success message
      navigation.navigate("Messages", {
        requestSubmitted: true,
        requestDetails: {
          title,
          category,
          isUrgent,
        },
      });
    }, 1500);
  };

  // Category selection modal
  const renderCategoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCategoryModal}
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={tw`flex-1 bg-black bg-opacity-50 justify-end`}>
        <View style={tw`bg-white rounded-t-3xl p-5`}>
          <View style={tw`w-16 h-1 bg-gray-300 rounded-full mx-auto mb-5`} />
          <Text style={tw`text-xl font-bold mb-4 text-center`}>
            Select Category
          </Text>
          <ScrollView style={tw`max-h-96`}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={tw`flex-row items-center p-4 border-b border-gray-100`}
                onPress={() => {
                  setCategory(item.name);
                  setShowCategoryModal(false);
                }}
              >
                <View
                  style={tw`w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3`}
                >
                  <Ionicons name={item.icon} size={20} color="#3498db" />
                </View>
                <Text style={tw`flex-1 font-medium`}>{item.name}</Text>
                {category === item.name && (
                  <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button
            title="Cancel"
            onPress={() => setShowCategoryModal(false)}
            style="mt-4"
            type="outlined"
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
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
              <Text style={tw`text-2xl font-bold`}>
                New Maintenance Request
              </Text>
            </View>

            {/* Form */}
            <Card style="mb-5">
              <View style={tw`p-4`}>
                <Text style={tw`text-lg font-semibold mb-5`}>
                  Request Details
                </Text>

                {/* Title */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-gray-700 mb-2 font-medium`}>Title</Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-base`}
                    placeholder="Brief description of the issue"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* Category Selector */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-gray-700 mb-2 font-medium`}>
                    Category
                  </Text>
                  <TouchableOpacity
                    style={tw`border border-gray-300 rounded-lg p-3 flex-row justify-between items-center`}
                    onPress={() => setShowCategoryModal(true)}
                  >
                    <Text
                      style={tw`text-base ${
                        category ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {category || "Select category"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#777" />
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-gray-700 mb-2 font-medium`}>
                    Description
                  </Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-lg p-3 text-base h-24`}
                    placeholder="Detailed description of the issue"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {/* Photos */}
                <View style={tw`mb-4`}>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text style={tw`text-gray-700 font-medium`}>Photos</Text>
                    <TouchableOpacity
                      style={tw`bg-blue-500 py-1 px-3 rounded-full`}
                      onPress={addPhoto}
                    >
                      <Text style={tw`text-white font-medium`}>Add Photo</Text>
                    </TouchableOpacity>
                  </View>

                  {photos.length > 0 ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={tw`mb-2`}
                    >
                      {photos.map((photo, index) => (
                        <View key={index} style={tw`mr-3 relative`}>
                          <Image
                            source={{ uri: photo }}
                            style={tw`w-24 h-24 rounded-lg`}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            style={tw`absolute top-1 right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center`}
                            onPress={() => removePhoto(index)}
                          >
                            <Ionicons name="close" size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <View
                      style={tw`border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center`}
                    >
                      <Ionicons name="camera-outline" size={32} color="#999" />
                      <Text style={tw`text-gray-500 mt-2`}>
                        Add photos of the issue
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>

            {/* Additional Options */}
            <Card style="mb-5">
              <View style={tw`p-4`}>
                <Text style={tw`text-lg font-semibold mb-4`}>
                  Additional Options
                </Text>

                {/* Urgent Toggle */}
                <View
                  style={tw`flex-row justify-between items-center mb-4 border-b border-gray-100 pb-4`}
                >
                  <View>
                    <Text style={tw`font-medium`}>Mark as Urgent</Text>
                    <Text style={tw`text-gray-500 text-sm`}>
                      For emergency issues
                    </Text>
                  </View>
                  <Switch
                    value={isUrgent}
                    onValueChange={setIsUrgent}
                    trackColor={{ false: "#e0e0e0", true: "#bde3ff" }}
                    thumbColor={isUrgent ? "#3498db" : "#f4f3f4"}
                    ios_backgroundColor="#e0e0e0"
                  />
                </View>

                {/* Permit Entry Toggle */}
                <View style={tw`flex-row justify-between items-center`}>
                  <View>
                    <Text style={tw`font-medium`}>
                      Permit Entry When Absent
                    </Text>
                    <Text style={tw`text-gray-500 text-sm`}>
                      Allow maintenance to enter when you're not home
                    </Text>
                  </View>
                  <Switch
                    value={permitEntry}
                    onValueChange={setPermitEntry}
                    trackColor={{ false: "#e0e0e0", true: "#bde3ff" }}
                    thumbColor={permitEntry ? "#3498db" : "#f4f3f4"}
                    ios_backgroundColor="#e0e0e0"
                  />
                </View>
              </View>
            </Card>

            {/* Submit Button */}
            <Button
              title={loading ? "Submitting..." : "Submit Request"}
              onPress={submitRequest}
              disabled={loading}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderCategoryModal()}
    </SafeAreaView>
  );
};

export default MaintenanceRequestScreen;
