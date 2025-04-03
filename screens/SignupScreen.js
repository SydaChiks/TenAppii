import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import {
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
import Button from "../components/Button";
import Input from "../components/Input";

const { height } = Dimensions.get("window");

const getValidationSchema = (role) => {
  const baseSchema = {
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string().required("Role selection is required"),
  };

  const roleSpecificSchema = {
    tenant: {
      ...baseSchema,
      unit: Yup.string().required("Unit/Room number is required"),
    },
    maintenance: {
      ...baseSchema,
      certifications: Yup.string().required("Certifications are required"),
      specialization: Yup.string().required("Specialization is required"),
      yearsOfExperience: Yup.number()
        .positive("Years of experience must be positive")
        .required("Years of experience is required"),
    },
    propertyOwner: {
      ...baseSchema,
      companyName: Yup.string().required("Company name is required"),
      numberOfProperties: Yup.number()
        .positive("Number of properties must be positive")
        .required("Number of properties is required"),
      propertyType: Yup.string().required("Property type is required"),
    },
  };

  return Yup.object().shape(roleSpecificSchema[role] || baseSchema);
};

const SignupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const handleSignup = async (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to main app (would be handled by auth context in a real app)
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    }, 1500);
  };

  const renderRoleSpecificFields = (formikProps) => {
    const { values, handleChange, handleBlur, touched, errors } = formikProps;

    switch (role) {
      case "tenant":
        return (
          <>
            <Input
              label="Unit/Room Number"
              placeholder="Enter your unit or room number"
              icon="home-outline"
              value={values.unit}
              onChangeText={handleChange("unit")}
              onBlur={handleBlur("unit")}
              error={touched.unit && errors.unit}
            />
            {/* Additional tenant-specific fields */}
            <Input
              label="Lease Start Date"
              placeholder="Enter lease start date"
              icon="calendar-outline"
              value={values.leaseStartDate}
              onChangeText={handleChange("leaseStartDate")}
              onBlur={handleBlur("leaseStartDate")}
              error={touched.leaseStartDate && errors.leaseStartDate}
            />
          </>
        );

      case "maintenance":
        return (
          <>
            <Input
              label="Certifications"
              placeholder="Enter your professional certifications"
              icon="ribbon-outline"
              value={values.certifications}
              onChangeText={handleChange("certifications")}
              onBlur={handleBlur("certifications")}
              error={touched.certifications && errors.certifications}
            />
            <Input
              label="Specialization"
              placeholder="Enter your maintenance specialization"
              icon="construct-outline"
              value={values.specialization}
              onChangeText={handleChange("specialization")}
              onBlur={handleBlur("specialization")}
              error={touched.specialization && errors.specialization}
            />
            <Input
              label="Years of Experience"
              placeholder="Enter years of maintenance experience"
              icon="time-outline"
              value={values.yearsOfExperience}
              onChangeText={handleChange("yearsOfExperience")}
              onBlur={handleBlur("yearsOfExperience")}
              error={touched.yearsOfExperience && errors.yearsOfExperience}
              keyboardType="numeric"
            />
            {/* Additional maintenance-specific fields */}
            <Input
              label="Service Areas"
              placeholder="Enter service areas (e.g., Plumbing, Electrical)"
              icon="map-outline"
              value={values.serviceAreas}
              onChangeText={handleChange("serviceAreas")}
              onBlur={handleBlur("serviceAreas")}
              error={touched.serviceAreas && errors.serviceAreas}
            />
          </>
        );

      case "propertyOwner":
        return (
          <>
            <Input
              label="Company Name"
              placeholder="Enter your company name"
              icon="business-outline"
              value={values.companyName}
              onChangeText={handleChange("companyName")}
              onBlur={handleBlur("companyName")}
              error={touched.companyName && errors.companyName}
            />
            <Input
              label="Number of Properties"
              placeholder="Enter number of properties you own"
              icon="home-outline"
              value={values.numberOfProperties}
              onChangeText={handleChange("numberOfProperties")}
              onBlur={handleBlur("numberOfProperties")}
              error={touched.numberOfProperties && errors.numberOfProperties}
              keyboardType="numeric"
            />
            <Input
              label="Property Type"
              placeholder="Enter type of properties (e.g., Residential, Commercial)"
              icon="business-outline"
              value={values.propertyType}
              onChangeText={handleChange("propertyType")}
              onBlur={handleBlur("propertyType")}
              error={touched.propertyType && errors.propertyType}
            />
            {/* Additional property owner-specific fields */}
            <Input
              label="Tax ID/EIN"
              placeholder="Enter your business Tax ID or EIN"
              icon="document-outline"
              value={values.taxId}
              onChangeText={handleChange("taxId")}
              onBlur={handleBlur("taxId")}
              error={touched.taxId && errors.taxId}
            />
          </>
        );

      default:
        return null;
    }
  };

  const getInitialValues = () => {
    const baseValues = {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: role,
    };

    switch (role) {
      case "tenant":
        return { ...baseValues, unit: "", leaseStartDate: "" };
      case "maintenance":
        return {
          ...baseValues,
          certifications: "",
          specialization: "",
          yearsOfExperience: "",
          serviceAreas: "",
        };
      case "propertyOwner":
        return {
          ...baseValues,
          companyName: "",
          numberOfProperties: "",
          propertyType: "",
          taxId: "",
        };
      default:
        return baseValues;
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        {/* Top design element */}
        <View
          style={tw`absolute right-0 top-0 w-2/5 h-24 bg-blue-500 rounded-bl-full opacity-80`}
        />

        <ScrollView
          contentContainerStyle={tw`flex-grow p-6`}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`w-10 h-10 items-center justify-center mt-2`}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* Logo & Welcome text */}
          <View style={tw`items-center mb-6 mt-4`}>
            <View style={tw`bg-blue-50 p-4 rounded-full mb-4 shadow-sm`}>
              <Image
                source={{ uri: "/api/placeholder/120/120" }}
                style={tw`w-24 h-24 rounded-full`}
              />
            </View>
            <Text style={tw`text-3xl font-bold text-center text-gray-800`}>
              Create Account
            </Text>
            <Text style={tw`text-gray-500 text-center mt-2 text-base`}>
              Choose your account type
            </Text>
          </View>

          {/* Role Selection */}
          {!role && (
            <View style={tw`mb-4`}>
              <View style={tw`flex-row justify-between`}>
                <TouchableOpacity
                  style={tw`flex-1 p-3 mr-2 rounded-lg items-center bg-gray-200`}
                  onPress={() => setRole("tenant")}
                >
                  <Ionicons name="people-outline" size={24} color="black" />
                  <Text style={tw`mt-2 text-center text-sm text-gray-700`}>
                    Tenant
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`flex-1 p-3 mx-2 rounded-lg items-center bg-gray-200`}
                  onPress={() => setRole("maintenance")}
                >
                  <Ionicons name="build-outline" size={24} color="black" />
                  <Text style={tw`mt-2 text-center text-sm text-gray-700`}>
                    Maintenance
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`flex-1 p-3 ml-2 rounded-lg items-center bg-gray-200`}
                  onPress={() => setRole("propertyOwner")}
                >
                  <Ionicons name="business-outline" size={24} color="black" />
                  <Text style={tw`mt-2 text-center text-sm text-gray-700`}>
                    Property Owner
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {role && (
            <Formik
              initialValues={getInitialValues()}
              validationSchema={() => getValidationSchema(role)}
              onSubmit={handleSignup}
            >
              {(formikProps) => {
                const {
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                } = formikProps;

                return (
                  <View style={tw`px-1`}>
                    {/* Shared Fields */}
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

                    {/* Password Fields */}
                    <View>
                      <Input
                        label="Password"
                        placeholder="Create a password"
                        icon="lock-closed-outline"
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        error={touched.password && errors.password}
                        secureTextEntry={secureTextEntry}
                      />
                      <TouchableOpacity
                        style={tw`absolute right-4 top-12`}
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

                    <View>
                      <Input
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        icon="lock-closed-outline"
                        value={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        error={
                          touched.confirmPassword && errors.confirmPassword
                        }
                        secureTextEntry={confirmSecureTextEntry}
                      />
                      <TouchableOpacity
                        style={tw`absolute right-4 top-12`}
                        onPress={() =>
                          setConfirmSecureTextEntry(!confirmSecureTextEntry)
                        }
                      >
                        <Ionicons
                          name={
                            confirmSecureTextEntry
                              ? "eye-outline"
                              : "eye-off-outline"
                          }
                          size={22}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Role-Specific Fields */}
                    {renderRoleSpecificFields(formikProps)}

                    <Button
                      title="Create Account"
                      onPress={handleSubmit}
                      loading={loading}
                      style="mt-4 mb-6"
                    />

                    {/* Other existing elements like social signup and login link */}
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
                        onPress={() => console.log("Google signup")}
                      >
                        <Ionicons
                          name="logo-google"
                          size={30}
                          color="#3b5998"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw`bg-gray-100 w-16 h-16 rounded-full items-center justify-center shadow-sm`}
                        onPress={() => console.log("Facebook signup")}
                      >
                        <Ionicons
                          name="logo-facebook"
                          size={30}
                          color="#3b5998"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw`bg-gray-100 w-16 h-16 rounded-full items-center justify-center shadow-sm`}
                        onPress={() => console.log("Apple signup")}
                      >
                        <Ionicons name="logo-apple" size={30} color="#000" />
                      </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row justify-center mt-4 ml-2`}>
                      <Text style={tw`text-gray-600 text-base`}>
                        Already have an account?{" "}
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                      >
                        <Text style={tw`text-blue-500 font-semibold text-base`}>
                          Sign In
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            </Formik>
          )}

          {/* Extra space for keyboard and scrolling */}
          <View style={tw`h-12`} />
        </ScrollView>

        {/* Bottom design element */}
        <View
          style={tw`absolute left-0 bottom-0 w-1/4 h-20 bg-blue-500 rounded-tr-full opacity-80`}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
