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
import { useTheme } from "../context/ThemeContext";

const MaintenanceRequestScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [permitEntry, setPermitEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
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
    inputBackground: isDark ? "bg-gray-700" : "bg-white",
    inputText: isDark ? "text-white" : "text-gray-900",
    borderColor: isDark ? "border-gray-600" : "border-gray-300",
    placeholderColor: isDark ? "#9ca3af" : "#9ca3af",
    modalBackground: isDark ? "bg-gray-800" : "bg-white",
    iconBackground: isDark ? "bg-blue-900" : "bg-blue-100",
    iconColor: isDark ? "#90caf9" : "#3498db",
    addPhotoButton: isDark ? "bg-blue-700" : "bg-blue-500",
    photoPlaceholder: isDark ? "border-gray-600" : "border-gray-300",
    switchTrack: isDark
      ? { false: "#4b5563", true: "#1e3a8a" }
      : { false: "#e0e0e0", true: "#bde3ff" },
    switchThumb: isDark
      ? isUrgent
        ? "#3b82f6"
        : "#9ca3af"
      : isUrgent
      ? "#3498db"
      : "#f4f3f4",
    permitSwitchThumb: isDark
      ? permitEntry
        ? "#3b82f6"
        : "#9ca3af"
      : permitEntry
      ? "#3498db"
      : "#f4f3f4",
    removePhotoBg: isDark ? "bg-red-600" : "bg-red-500",
    chevronColor: isDark ? "#9ca3af" : "#777",
    checkmarkColor: isDark ? "#4ade80" : "#2ecc71",
  };

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
    setTimeout(() => {
      setLoading(false);
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
        <View style={tw`${styles.modalBackground} rounded-t-3xl p-5`}>
          <View
            style={tw`w-16 h-1 ${styles.borderColor} rounded-full mx-auto mb-5`}
          />
          <Text
            style={tw`text-xl font-bold mb-4 text-center ${styles.textColor}`}
          >
            Select Category
          </Text>
          <ScrollView style={tw`max-h-96`}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={tw`flex-row items-center p-4 border-b ${styles.borderColor}`}
                onPress={() => {
                  setCategory(item.name);
                  setShowCategoryModal(false);
                }}
              >
                <View
                  style={tw`w-10 h-10 ${styles.iconBackground} rounded-full items-center justify-center mr-3`}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={styles.iconColor}
                  />
                </View>
                <Text style={tw`flex-1 font-medium ${styles.textColor}`}>
                  {item.name}
                </Text>
                {category === item.name && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={styles.checkmarkColor}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button
            title="Cancel"
            onPress={() => setShowCategoryModal(false)}
            style="mt-4"
            type="outlined"
            darkMode={isDark}
          />
        </View>
      </View>
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
      >
        <ScrollView style={tw`flex-1`}>
          <View style={tw`p-5`}>
            {/* Header */}
            <View style={tw`flex-row items-center mb-6`}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={tw`p-2 mr-4`}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={styles.iconColor}
                />
              </TouchableOpacity>
              <Text style={tw`text-2xl font-bold ${styles.textColor}`}>
                New Maintenance Request
              </Text>
            </View>

            {/* Form */}
            <Card style={`mb-5 ${styles.cardBackground}`}>
              <View style={tw`p-4`}>
                <Text
                  style={tw`text-lg font-semibold mb-5 ${styles.textColor}`}
                >
                  Request Details
                </Text>

                {/* Title */}
                <View style={tw`mb-4`}>
                  <Text style={tw`mb-2 font-medium ${styles.textColor}`}>
                    Title
                  </Text>
                  <TextInput
                    style={tw`border ${styles.borderColor} rounded-lg p-3 text-base ${styles.inputBackground} ${styles.inputText}`}
                    placeholder="Brief description of the issue"
                    placeholderTextColor={styles.placeholderColor}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* Category Selector */}
                <View style={tw`mb-4`}>
                  <Text style={tw`mb-2 font-medium ${styles.textColor}`}>
                    Category
                  </Text>
                  <TouchableOpacity
                    style={tw`border ${styles.borderColor} rounded-lg p-3 flex-row justify-between items-center ${styles.inputBackground}`}
                    onPress={() => setShowCategoryModal(true)}
                  >
                    <Text
                      style={tw`text-base ${
                        category ? styles.textColor : styles.subtextColor
                      }`}
                    >
                      {category || "Select category"}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={styles.chevronColor}
                    />
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <View style={tw`mb-4`}>
                  <Text style={tw`mb-2 font-medium ${styles.textColor}`}>
                    Description
                  </Text>
                  <TextInput
                    style={tw`border ${styles.borderColor} rounded-lg p-3 text-base h-24 ${styles.inputBackground} ${styles.inputText}`}
                    placeholder="Detailed description of the issue"
                    placeholderTextColor={styles.placeholderColor}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {/* Photos */}
                <View style={tw`mb-4`}>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text style={tw`font-medium ${styles.textColor}`}>
                      Photos
                    </Text>
                    <TouchableOpacity
                      style={tw`${styles.addPhotoButton} py-1 px-3 rounded-full`}
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
                            style={tw`absolute top-1 right-1 ${styles.removePhotoBg} w-6 h-6 rounded-full items-center justify-center`}
                            onPress={() => removePhoto(index)}
                          >
                            <Ionicons name="close" size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <View
                      style={tw`border border-dashed ${styles.photoPlaceholder} rounded-lg p-4 items-center justify-center`}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={32}
                        color={styles.subtextColor}
                      />
                      <Text style={tw`${styles.subtextColor} mt-2`}>
                        Add photos of the issue
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>

            {/* Additional Options */}
            <Card style={`mb-5 ${styles.cardBackground}`}>
              <View style={tw`p-4`}>
                <Text
                  style={tw`text-lg font-semibold mb-4 ${styles.textColor}`}
                >
                  Additional Options
                </Text>

                {/* Urgent Toggle */}
                <View
                  style={tw`flex-row justify-between items-center mb-4 border-b ${styles.borderColor} pb-4`}
                >
                  <View>
                    <Text style={tw`font-medium ${styles.textColor}`}>
                      Mark as Urgent
                    </Text>
                    <Text style={tw`text-sm ${styles.subtextColor}`}>
                      For emergency issues
                    </Text>
                  </View>
                  <Switch
                    value={isUrgent}
                    onValueChange={setIsUrgent}
                    trackColor={styles.switchTrack}
                    thumbColor={styles.switchThumb}
                    ios_backgroundColor={isDark ? "#4b5563" : "#e0e0e0"}
                  />
                </View>

                {/* Permit Entry Toggle */}
                <View style={tw`flex-row justify-between items-center w-full`}>
                  <View style={tw`flex-1 mr-4`}>
                    <Text style={tw`font-medium ${styles.textColor}`}>
                      Permit Entry When Absent
                    </Text>
                    <Text style={tw`text-sm ${styles.subtextColor}`}>
                      Allow maintenance to enter when you're not home
                    </Text>
                  </View>
                  <Switch
                    value={permitEntry}
                    onValueChange={setPermitEntry}
                    trackColor={styles.switchTrack}
                    thumbColor={styles.permitSwitchThumb}
                    ios_backgroundColor={isDark ? "#4b5563" : "#e0e0e0"}
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
              darkMode={isDark}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderCategoryModal()}
    </SafeAreaView>
  );
};

export default MaintenanceRequestScreen;
