import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";
import { activities, user } from "../data/dummyData";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme, followSystem } = useTheme();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserString = await AsyncStorage.getItem("currentUser");
        if (currentUserString) {
          const currentUser = JSON.parse(currentUserString);
          setUserData(currentUser);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Long press on theme button will toggle follow system
  const handleLongPress = () => {
    console.log("Follow system toggle");
  };

  const isDark = theme === "dark";
  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-100",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    headerBackground: isDark ? "bg-blue-800" : "bg-blue-500",
    headerSubtextColor: isDark ? "text-blue-200" : "text-blue-100",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-black",
    subtextColor: isDark ? "text-gray-400" : "text-gray-500",
    iconBackgroundColor: isDark ? "opacity-75" : "",

    inputBackground: isDark ? "bg-gray-700" : "bg-gray-100",
    inputText: isDark ? "text-white" : "text-gray-900",
    borderColor: isDark ? "border-gray-600" : "border-gray-300",
    shadowColor: isDark ? "shadow-gray-900" : "shadow-gray-300",
    accentBackground: isDark ? "bg-blue-900" : "bg-blue-100",
    accentText: isDark ? "text-blue-300" : "text-blue-700",
  };

  if (!user) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <View style={tw`flex flex-col items-center justify-center h-screen`}>
          <ActivityIndicator
            style={tw`w-12 h-12`}
            size="large"
            color="#3B82F6"
          />
          <Text style={tw`mt-4 text-base text-gray-600`}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={styles.statusBarStyle}
        backgroundColor={styles.statusBarColor}
      />
      <ScrollView>
        {/* Header with blue background */}
        <View
          style={tw`${styles.headerBackground} p-6 pt-8 pb-16 rounded-b-3xl`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <View>
              <Text style={tw`${styles.headerSubtextColor} text-base`}>
                Welcome back,
              </Text>
              <Text style={tw`text-3xl font-bold text-white`}>
                {userData?.fullName || "John Doe"}
              </Text>
              <Text style={tw`${styles.headerSubtextColor} mt-1`}>
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </Text>
            </View>
            <View style={tw`flex-row`}>
              {/* Theme Toggle Icon */}
              <TouchableOpacity
                style={tw`p-2 mr-2 ${
                  isDark ? "bg-blue-700" : "bg-blue-400"
                } rounded-full`}
                onPress={toggleTheme}
                onLongPress={handleLongPress}
              >
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={22}
                  color="#fff"
                />
                {followSystem && (
                  <View
                    style={tw`absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white`}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`p-2 mr-2 ${
                  isDark ? "bg-blue-700" : "bg-blue-400"
                } rounded-full`}
              >
                <Ionicons name="search" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`p-2 ${
                  isDark ? "bg-blue-700" : "bg-blue-400"
                } rounded-full`}
              >
                <Ionicons name="notifications-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={tw`px-4 -mt-10`}>
          {/* Current Residence Card - Elevated on top of blue section */}
          <Card style={`mb-4 shadow-lg ${styles.cardBackground}`}>
            <View style={tw`items-center py-4`}>
              <View
                style={tw`w-16 h-16 ${
                  isDark ? "bg-blue-900" : "bg-blue-100"
                } rounded-full items-center justify-center mb-2`}
              >
                <Ionicons
                  name="home"
                  size={30}
                  color={isDark ? "#90caf9" : "#3498db"}
                />
              </View>
              <Text style={tw`text-2xl font-bold ${styles.textColor}`}>
                Unit {user.unit}
              </Text>
              <Text style={tw`${styles.subtextColor} mb-2`}>
                Current Residence
              </Text>

              <View
                style={tw`w-full border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                } my-2 pt-2`}
              >
                <View style={tw`flex-row justify-between px-4`}>
                  <View style={tw`items-center`}>
                    <Text style={tw`${styles.subtextColor} text-xs`}>
                      Lease Start
                    </Text>
                    <Text style={tw`font-medium ${styles.textColor}`}>
                      {format(
                        new Date(user.leaseStart || Date.now()),
                        "MMM d, yyyy"
                      )}
                    </Text>
                  </View>
                  <View style={tw`items-center`}>
                    <Text style={tw`${styles.subtextColor} text-xs`}>
                      Lease End
                    </Text>
                    <Text style={tw`font-medium ${styles.textColor}`}>
                      {format(
                        new Date(user.leaseEnd || Date.now()),
                        "MMM d, yyyy"
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>

          {/* Payment Info */}
          <View style={tw`flex-row mb-4`}>
            <Card style={`flex-1 mr-2 ${styles.cardBackground}`}>
              <View style={tw`items-center py-3`}>
                <Text style={tw`${styles.subtextColor} mb-1`}>
                  Next Payment
                </Text>
                <Text style={tw`text-xl font-bold text-blue-500`}>
                  ${user.rentAmount}
                </Text>
              </View>
            </Card>
            <Card style={`flex-1 ml-2 ${styles.cardBackground}`}>
              <View style={tw`items-center py-3`}>
                <Text style={tw`${styles.subtextColor} mb-1`}>Due Date</Text>
                <Text style={tw`text-xl font-bold text-blue-500`}>
                  {format(new Date(user.dueDate), "MMM d")}
                </Text>
              </View>
            </Card>
          </View>

          {/* Recent Activity */}
          <View style={tw`mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-xl font-bold ${styles.textColor}`}>
                Recent Activity
              </Text>
              <TouchableOpacity>
                <Text style={tw`text-blue-500`}>View All</Text>
              </TouchableOpacity>
            </View>
            {activities.map((activity) => (
              <Card key={activity.id} style={`mb-2 ${styles.cardBackground}`}>
                <TouchableOpacity>
                  <View style={tw`flex-row justify-between items-center p-1`}>
                    <View style={tw`flex-row items-center`}>
                      <View
                        style={tw`p-2 mr-3 ${
                          isDark ? "bg-blue-900" : "bg-blue-100"
                        } rounded-full ${styles.iconBackgroundColor}`}
                      >
                        <Ionicons
                          name={activity.icon || "document-text-outline"}
                          size={18}
                          color={isDark ? "#90caf9" : "#3498db"}
                        />
                      </View>
                      <View>
                        <Text style={tw`font-semibold ${styles.textColor}`}>
                          {activity.type}
                        </Text>
                        <Text style={tw`${styles.subtextColor} text-sm`}>
                          {activity.timeAgo}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? "#777" : "#999"}
                    />
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
              Quick Actions
            </Text>
            <View style={tw`flex-row flex-wrap -mx-1`}>
              <QuickActionButton
                icon="cash-outline"
                label="Pay Rent"
                color={isDark ? "#90caf9" : "#3498db"}
                bgColor={isDark ? "bg-blue-900" : "bg-blue-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => navigation.navigate("Payments")}
              />
              <QuickActionButton
                icon="construct-outline"
                label="Maintenance"
                color={isDark ? "#ffcc80" : "#e67e22"}
                bgColor={isDark ? "bg-yellow-900" : "bg-orange-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => navigation.navigate("Messages")}
              />
              <QuickActionButton
                icon="megaphone-outline"
                label="News"
                color={isDark ? "#a5d6a7" : "#2ecc71"}
                bgColor={isDark ? "bg-green-900" : "bg-green-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => navigation.navigate("News")}
              />
              <QuickActionButton
                icon="person-outline"
                label="Profile"
                color={isDark ? "#ce93d8" : "#9c27b0"}
                bgColor={isDark ? "bg-purple-900" : "bg-purple-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => navigation.navigate("Profile")}
              />
              <QuickActionButton
                icon="calendar-outline"
                label="Amenities"
                color={isDark ? "#ef9a9a" : "#e53935"}
                bgColor={isDark ? "bg-red-900" : "bg-red-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => alert("Amenities Booking")}
              />
              <QuickActionButton
                icon="document-text-outline"
                label="Lease"
                color={isDark ? "#90caf9" : "#3498db"}
                bgColor={isDark ? "bg-blue-900" : "bg-blue-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => navigation.navigate("LeaseManagement")}
              />
              <QuickActionButton
                icon="help-buoy-outline"
                label="Support"
                color={isDark ? "#80cbc4" : "#009688"}
                bgColor={isDark ? "bg-teal-900" : "bg-teal-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => alert("Help & Support")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Quick Action Button Component to reduce repetition
const QuickActionButton = ({
  icon,
  label,
  color,
  bgColor,
  cardBg,
  textColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...tw`${cardBg} rounded-xl py-5 items-center shadow-sm m-1`,
        width: width / 3 - 16,
      }}
      onPress={onPress}
    >
      <View style={tw`p-3 ${bgColor} rounded-full mb-2`}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={tw`text-sm font-medium ${textColor}`}>{label}</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
