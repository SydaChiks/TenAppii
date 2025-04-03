import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import * as Yup from "yup";
import { Button, Input } from "../components";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  unitNumber: Yup.string().required("Unit number is required"),
});

const EditProfileScreen = ({ navigation, route }) => {
  const { userData } = route.params;
  const [profileImage, setProfileImage] = useState(userData.profileImage);
  const [loading, setLoading] = useState(false);

  const handleImagePicker = () => {
    Alert.alert(
      "Update Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => {
            // Implement camera functionality
            Alert.alert(
              "Camera",
              "Camera functionality would be implemented here"
            );
          },
        },
        {
          text: "Choose from Library",
          onPress: () => {
            // Implement image library selection
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
    // Simulate profile update
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
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`bg-blue-500 p-6 pt-4 pb-16 rounded-b-3xl`}>
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
            <View style={tw`bg-blue-100 p-2 rounded-full`}>
              <Image
                source={{ uri: profileImage }}
                style={tw`w-32 h-32 rounded-full`}
              />
            </View>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={tw`absolute bottom-0 right-0 bg-blue-500 w-10 h-10 rounded-full items-center justify-center`}
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
            unitNumber: userData.unitNumber,
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
              />

              <Input
                label="Unit Number"
                placeholder="Enter your unit number"
                icon="home-outline"
                value={values.unitNumber}
                onChangeText={handleChange("unitNumber")}
                onBlur={handleBlur("unitNumber")}
                error={touched.unitNumber && errors.unitNumber}
              />

              <Button
                title="Update Profile"
                onPress={handleSubmit}
                loading={loading}
                style="mt-6"
              />
            </View>
          )}
        </Formik>

        {/* Change Password Option */}
        <TouchableOpacity
          style={tw`flex-row items-center w-full bg-white rounded-xl p-4 mt-4 shadow-sm`}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <View style={tw`p-2 mr-3 bg-purple-100 rounded-full`}>
            <Ionicons name="lock-closed-outline" size={22} color="#9c27b0" />
          </View>
          <Text style={tw`text-base text-gray-800`}>Change Password</Text>
          <View style={tw`flex-1`}></View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
