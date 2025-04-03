import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import * as Yup from "yup";
import { jpgLogo } from "../assets";
import { Button, Input } from "../components";
import { useUser } from "../context/UserContext";

const { height } = Dimensions.get("window");

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const predefinedAccounts = {
  tenant: {
    fullName: "Emily Johnson",
    email: "emily.tenant@example.com",
    phone: "+1 (555) 123-4567",
    password: "tenant123",
    role: "tenant",
    unit: "Apt 305",
    leaseStartDate: "2024-01-15",
  },
  maintenance: {
    fullName: "Michael Rodriguez",
    email: "michael.maintenance@example.com",
    phone: "+1 (555) 987-6543",
    password: "maintenance123",
    role: "maintenance",
    certifications: "HVAC Certified, Electrical License",
    specialization: "HVAC and Electrical Systems",
    yearsOfExperience: "7",
    serviceAreas: "Residential and Commercial",
  },
  propertyOwner: {
    fullName: "Sarah Williams",
    email: "sarah.owner@example.com",
    phone: "+1 (555) 456-7890",
    password: "owner123",
    role: "propertyOwner",
    companyName: "Williams Property Group",
    numberOfProperties: "12",
    propertyType: "Mixed Residential and Commercial",
    taxId: "45-6789012",
  },
};

// Updated navigation helper function
const navigateToMainApp = (navigation, role) => {
  // Reset the navigation stack to the main app with the specific role
  navigation.reset({
    index: 0,
    routes: [{ name: "MainApp" }], // This matches the RootNavigator configuration
  });
};

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { refreshUserRole } = useUser();

  useEffect(() => {
    const initializeAccounts = async () => {
      try {
        const existingAccounts = await AsyncStorage.getItem(
          "registeredAccounts"
        );
        if (!existingAccounts) {
          await AsyncStorage.setItem(
            "registeredAccounts",
            JSON.stringify(predefinedAccounts)
          );
          console.log("Accounts initialized:", predefinedAccounts);
        }
      } catch (error) {
        console.error("Error initializing accounts:", error);
      }
    };

    initializeAccounts();
  }, []);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const storedAccountsString = await AsyncStorage.getItem(
        "registeredAccounts"
      );
      const storedAccounts = JSON.parse(storedAccountsString || "{}");

      const matchedAccount = Object.values(storedAccounts).find(
        (account) =>
          account.email === values.email && account.password === values.password
      );

      console.log("Matched Account:", matchedAccount);

      if (matchedAccount) {
        // First clear the current user data
        await AsyncStorage.removeItem("currentUser");

        // Then store the new user data
        await AsyncStorage.setItem(
          "currentUser",
          JSON.stringify(matchedAccount)
        );

        console.log("Storing User Role:", matchedAccount.role);
        // Refresh user role in context
        await refreshUserRole();
        // Navigate to main app
        setLoading(false);
        navigateToMainApp(navigation, matchedAccount.role);
      } else {
        Alert.alert("Login Failed", "Invalid email or password");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Error", "An unexpected error occurred");
      setLoading(false);
    }
  };

  const quickLogin = async (role) => {
    const account = predefinedAccounts[role];
    if (account) {
      await handleLogin({
        email: account.email,
        password: account.password,
      });
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow p-6`}
          showsVerticalScrollIndicator={false}
        >
          {/* Top design element */}
          <View
            style={tw`absolute right-0 top-0 w-2/5 h-24 bg-blue-500 rounded-bl-full opacity-80`}
          />

          <View
            style={tw`flex-1 p-6 justify-center`}
            style={{ minHeight: height * 0.9 }}
          >
            <View style={tw`items-center mb-6 mt-12`}>
              <View style={tw`bg-blue-50 p-4 rounded-full mb-4 shadow-sm`}>
                <Image source={jpgLogo} style={tw`w-24 h-24 rounded-full `} />
              </View>
            </View>

            {/* Quick Login Buttons */}
            <View style={tw`flex-row justify-between mb-4`}>
              <TouchableOpacity
                style={tw`bg-blue-100 p-2 rounded-lg`}
                onPress={() => quickLogin("tenant")}
              >
                <Text>Tenant Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-green-100 p-2 rounded-lg`}
                onPress={() => quickLogin("maintenance")}
              >
                <Text>Maintenance Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-purple-100 p-2 rounded-lg`}
                onPress={() => quickLogin("propertyOwner")}
              >
                <Text>Owner Login</Text>
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={tw`px-1`}>
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

                  <View>
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      icon="lock-closed-outline"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      error={touched.password && errors.password}
                      secureTextEntry={secureTextEntry}
                    />
                    <TouchableOpacity
                      style={tw`absolute right-4 top-9`}
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                    >
                      <Ionicons
                        name={
                          secureTextEntry ? "eye-outline" : "eye-off-outline"
                        }
                        size={22}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={tw`self-end mb-6 mt-1`}>
                    <Text style={tw`text-blue-500 font-medium`}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <Button
                    title="Sign In"
                    onPress={handleSubmit}
                    loading={loading}
                    style="mb-4"
                  />

                  <View style={tw`my-6 flex-row items-center`}>
                    <View style={tw`flex-1 h-px bg-gray-300`} />
                    <Text style={tw`mx-4 text-gray-500 font-medium`}>
                      OR CONTINUE WITH
                    </Text>
                    <View style={tw`flex-1 h-px bg-gray-300`} />
                  </View>

                  <View style={tw`flex-row justify-center space-x-4 mb-8`}>
                    <TouchableOpacity
                      style={tw`bg-gray-100 w-16 h-16 rounded-full items-center justify-center shadow-sm`}
                      onPress={() => console.log("Google login")}
                    >
                      <Ionicons name="logo-google" size={30} color="#3b5998" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`bg-gray-100 w-16 h-16 rounded-full items-center justify-center shadow-sm`}
                      onPress={() => console.log("Facebook login")}
                    >
                      <Ionicons
                        name="logo-facebook"
                        size={30}
                        color="#3b5998"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`bg-gray-100 w-16 h-16 rounded-full items-center justify-center shadow-sm`}
                      onPress={() => console.log("Apple login")}
                    >
                      <Ionicons name="logo-apple" size={30} color="#000" />
                    </TouchableOpacity>
                  </View>

                  <View style={tw`flex-row justify-center mt-4 ml-2`}>
                    <Text style={tw`text-gray-600 text-base `}>
                      Don't have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Signup")}
                    >
                      <Text style={tw`text-blue-500 font-semibold text-base`}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>

          {/* Bottom design element */}
          <View
            style={tw`absolute left-0 bottom-0 w-1/4 h-20 bg-blue-500 rounded-tr-full opacity-80`}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
