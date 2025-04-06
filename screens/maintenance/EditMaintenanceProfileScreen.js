import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import * as Yup from "yup";
import { Button, Input } from "../../components";
import { useTheme } from "../../context/ThemeContext";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  specialization: Yup.string().required("Specialization is required"),
  yearsOfExperience: Yup.number()
    .required("Years of experience is required")
    .min(0, "Must be 0 or more"),
});

const EditMaintenanceProfileScreen = ({ navigation, route }) => {
  const { userData } = route.params;
  const [profileImage, setProfileImage] = useState(userData.profileImage);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-100",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    headerBackground: isDark ? "bg-blue-800" : "bg-blue-500",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-black",
    subtextColor: isDark ? "text-gray-400" : "text-gray-500",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    profileImageBg: isDark ? "bg-blue-900" : "bg-blue-100",
    cameraButtonBg: isDark ? "bg-blue-700" : "bg-blue-500",
    changePasswordBg: isDark ? "bg-gray-800" : "bg-white",
    changePasswordIconBg: isDark ? "bg-purple-900" : "bg-purple-100",
    changePasswordIconColor: isDark ? "#ba68c8" : "#9c27b0",
    chevronColor: isDark ? "#777" : "#999",
    shadowColor: isDark ? "shadow-gray-900" : "shadow-gray-300",
  };

  const handleImagePicker = () => {
    Alert.alert(
      "Update Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => {
            Alert.alert(
              "Camera",
              "Camera functionality would be implemented here"
            );
          },
        },
        {
          text: "Choose from Library",
          onPress: () => {
            Alert.alert("Gallery", "Image selection would be implemented here");
          },
        },
        {
          text: "Remove Photo",
          onPress: () => {
            setProfileImage("/api/placeholder/150/150");
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={styles.statusBarStyle}
        backgroundColor={styles.statusBarColor}
      />

      {/* Header */}
      <View style={tw`${styles.headerBackground} p-6 pt-4 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-white`}>Edit Profile</Text>
          <View style={tw`w-10`} /> {/* Spacer to center the title */}
        </View>
      </View>

      <ScrollView
        style={tw`flex-1 px-4 -mt-10`}
        contentContainerStyle={tw`pb-8`}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={tw`items-center mb-6`}>
          <View style={tw`relative`}>
            <View style={tw`${styles.profileImageBg} p-2 rounded-full`}>
              <Image
                source={{ uri: profileImage }}
                style={tw`w-32 h-32 rounded-full`}
              />
            </View>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={tw`absolute bottom-0 right-0 ${styles.cameraButtonBg} w-10 h-10 rounded-full items-center justify-center`}
            >
              <Ionicons name="camera-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Edit Form */}
        <Formik
          initialValues={{
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone || "",
            specialization: userData.specialization || "",
            yearsOfExperience: userData.yearsOfExperience?.toString() || "0",
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateProfile}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                icon="person-outline"
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={touched.fullName && errors.fullName}
                darkMode={isDark}
              />

              <Input
                label="Email Address"
                placeholder="Enter your email address"
                icon="mail-outline"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email && errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                darkMode={isDark}
              />

              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                icon="call-outline"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                error={touched.phone && errors.phone}
                keyboardType="phone-pad"
                darkMode={isDark}
              />

              <Input
                label="Specialization"
                placeholder="e.g., HVAC, Electrical, Plumbing"
                icon="build-outline"
                value={values.specialization}
                onChangeText={handleChange("specialization")}
                onBlur={handleBlur("specialization")}
                error={touched.specialization && errors.specialization}
                darkMode={isDark}
              />

              <Input
                label="Years of Experience"
                placeholder="Enter years of experience"
                icon="briefcase-outline"
                value={values.yearsOfExperience}
                onChangeText={handleChange("yearsOfExperience")}
                onBlur={handleBlur("yearsOfExperience")}
                error={touched.yearsOfExperience && errors.yearsOfExperience}
                keyboardType="numeric"
                darkMode={isDark}
              />

              <Button
                title="Update Profile"
                onPress={handleSubmit}
                loading={loading}
                style="mt-6"
                darkMode={isDark}
              />
            </View>
          )}
        </Formik>

        {/* Change Password Option */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.changePasswordBg} rounded-xl p-4 mt-4 shadow-sm`}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <View
            style={tw`p-2 mr-3 ${styles.changePasswordIconBg} rounded-full`}
          >
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={styles.changePasswordIconColor}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>Change Password</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={styles.chevronColor}
          />
        </TouchableOpacity>

        {/* Certifications Management */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.changePasswordBg} rounded-xl p-4 mt-4 shadow-sm`}
          onPress={() => navigation.navigate("ManageCertifications")}
        >
          <View style={tw`p-2 mr-3 bg-purple-100 rounded-full`}>
            <Ionicons
              name="ribbon-outline"
              size={22}
              color={isDark ? "#ba68c8" : "#9c27b0"}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>
            Manage Certifications
          </Text>
          <View style={tw`flex-1`}></View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={styles.chevronColor}
          />
        </TouchableOpacity>

        {/* Service Areas Management */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full ${styles.changePasswordBg} rounded-xl p-4 mt-4 shadow-sm`}
          onPress={() => navigation.navigate("ManageServiceAreas")}
        >
          <View style={tw`p-2 mr-3 bg-blue-100 rounded-full`}>
            <Ionicons
              name="location-outline"
              size={22}
              color={isDark ? "#64b5f6" : "#2196f3"}
            />
          </View>
          <Text style={tw`text-base ${styles.textColor}`}>
            Manage Service Areas
          </Text>
          <View style={tw`flex-1`}></View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={styles.chevronColor}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditMaintenanceProfileScreen;
