import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Appearance,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import tw from "twrnc";
import { Card } from "../../components";
import { ThemeContext } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

const AdminDashboardScreen = ({ navigation }) => {
  // Theme and system preferences
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");
  const [followSystem, setFollowSystem] = useState(true);

  // Tab and section states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedSection, setSelectedSection] = useState("tenants");

  // Loading state
  const [loading, setLoading] = useState(true);

  // Data states
  const [tenants, setTenants] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);

  // Filtering states
  const [maintenanceFilterStatus, setMaintenanceFilterStatus] = useState("all");

  // Theme listener
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (followSystem) {
        setTheme(colorScheme || "light");
      }
    });

    return () => subscription.remove();
  }, [followSystem]);

  // Theme-specific styles
  const isDark = theme === "dark";
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
  };

  // Data fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      setTimeout(() => {
        // Populate with dummy data similar to HomeScreen approach
        setTenants([
          {
            id: "1",
            name: "John Doe",
            unit: "101",
            leaseEnd: new Date("2024-12-31"),
            paymentStatus: "paid",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
          },
          {
            id: "2",
            name: "Jane Smith",
            unit: "202",
            leaseEnd: new Date("2024-06-30"),
            paymentStatus: "pending",
            email: "jane.smith@example.com",
            phone: "+1 (555) 987-6543",
          },
        ]);

        setMaintenanceRequests([
          {
            id: "1",
            type: "Plumbing",
            description: "Leaking Faucet in Kitchen",
            status: "In Progress",
            timeAgo: "2 hours ago",
            icon: "build-outline",
          },
          {
            id: "2",
            type: "HVAC",
            description: "AC Not Cooling Properly",
            status: "Scheduled",
            timeAgo: "Yesterday",
            icon: "snow-outline",
          },
        ]);

        setMessages([
          {
            id: "1",
            sender: "John Doe",
            lastMessage: "Maintenance Update Request",
            timeAgo: "10:30 AM",
            unread: true,
          },
          {
            id: "2",
            sender: "Maintenance Team",
            lastMessage: "Request Assigned",
            timeAgo: "9:45 AM",
            unread: false,
          },
        ]);

        setGroups([
          {
            id: "1",
            name: "Building Announcements",
            lastMessage: "Water Shutdown Notice",
            timeAgo: "Yesterday",
          },
          {
            id: "2",
            name: "Resident Community",
            lastMessage: "Monthly Meeting Details",
            timeAgo: "2 days ago",
          },
        ]);

        setLoading(false);
      }, 1500);
    };

    fetchInitialData();
  }, []);

  // Theme toggle functions
  const toggleTheme = () => {
    if (followSystem) {
      setFollowSystem(false);
      setTheme(theme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // Long press handler for theme toggle
  const handleLongPress = () => {
    setFollowSystem(!followSystem);
    if (followSystem) {
      setTheme(systemTheme || "light");
    }
  };

  // Quick Actions Component
  const QuickActionButton = ({ icon, label, onPress, color, bgColor }) => (
    <TouchableOpacity
      style={{
        ...tw`${styles.cardBackground} rounded-xl py-5 items-center shadow-sm m-1`,
        width: width / 3 - 16,
      }}
      onPress={onPress}
    >
      <View style={tw`p-3 ${bgColor} rounded-full mb-2`}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={tw`text-sm font-medium ${styles.textColor}`}>{label}</Text>
    </TouchableOpacity>
  );

  // Quick Actions
  const quickActions = [
    {
      icon: "document-text-outline",
      label: "Payments",
      onPress: () => navigation.navigate("AdminPaymentsScreen"),
      color: isDark ? "#90caf9" : "#3498db",
      bgColor: isDark ? "bg-blue-900" : "bg-blue-100",
    },
    {
      icon: "document-outline",
      label: "Lease",
      onPress: () => navigation.navigate("AdminLeaseManagementScreen"),
      color: isDark ? "#ffcc80" : "#e67e22",
      bgColor: isDark ? "bg-orange-900" : "bg-orange-100",
    },
    {
      icon: "build-outline",
      label: "Maintenance",
      onPress: () => setActiveTab("maintenance"),
      color: isDark ? "#a5d6a7" : "#2ecc71",
      bgColor: isDark ? "bg-green-900" : "bg-green-100",
    },
    {
      icon: "people-outline",
      label: "Tenants",
      onPress: () => {
        setActiveTab("dashboard");
        setSelectedSection("tenants");
      },
      color: isDark ? "#ce93d8" : "#9c27b0",
      bgColor: isDark ? "bg-purple-900" : "bg-purple-100",
    },
    {
      icon: "chatbubbles-outline",
      label: "Messages",
      onPress: () => setActiveTab("messages"),
      color: isDark ? "#80cbc4" : "#009688",
      bgColor: isDark ? "bg-teal-900" : "bg-teal-100",
    },
    {
      icon: "settings-outline",
      label: "Settings",
      onPress: () => navigation.navigate("SettingsScreen"),
      color: isDark ? "#90caf9" : "#3498db",
      bgColor: isDark ? "bg-blue-900" : "bg-blue-100",
    },
  ];

  // Rendering methods
  const renderHeader = () => (
    <View style={tw`${styles.headerBackground} p-6 pt-8 pb-16 rounded-b-3xl`}>
      <View style={tw`flex-row justify-between items-center`}>
        <View>
          <Text style={tw`${styles.headerSubtextColor} text-base`}>
            Admin Portal
          </Text>
          <Text style={tw`text-3xl font-bold text-white`}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Text>
          <Text style={tw`${styles.headerSubtextColor} mt-1`}>
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </Text>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            style={tw`p-2 mr-2 ${
              isDark ? "bg-blue-700" : "bg-blue-400"
            } rounded-full`}
            onPress={toggleTheme}
            onLongPress={handleLongPress}
          >
            <Ionicons name={isDark ? "moon" : "sunny"} size={22} color="#fff" />
            {followSystem && (
              <View
                style={tw`absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white`}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`p-2 ${
              isDark ? "bg-blue-700" : "bg-blue-400"
            } rounded-full`}
            onPress={() => navigation.navigate("SettingsScreen")}
          >
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={tw`mb-6 px-4`}>
      <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
        Quick Actions
      </Text>
      <View style={tw`flex-row flex-wrap -mx-1`}>
        {quickActions.map((action, index) => (
          <QuickActionButton
            key={index}
            icon={action.icon}
            label={action.label}
            onPress={action.onPress}
            color={action.color}
            bgColor={action.bgColor}
          />
        ))}
      </View>
    </View>
  );

  const renderActivityCard = (items, icon, renderItem) => (
    <Card style={`mb-4 ${styles.cardBackground}`}>
      <View style={tw`p-4`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-xl font-bold ${styles.textColor}`}>
            {icon && <Ionicons name={icon} style={tw`mr-2`} />}
            {renderItem.title}
          </Text>
          <TouchableOpacity>
            <Text style={tw`text-blue-500`}>View All</Text>
          </TouchableOpacity>
        </View>
        {items.map(renderItem.render)}
      </View>
    </Card>
  );

  const renderMaintenanceActivities = () => (
    <View style={tw`px-4`}>
      {renderActivityCard(maintenanceRequests, "build-outline", {
        title: "Maintenance Requests",
        render: (item) => (
          <View
            key={item.id}
            style={tw`flex-row justify-between items-center py-2 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <View style={tw`flex-row items-center`}>
              <View
                style={tw`p-2 mr-3 ${
                  isDark ? "bg-blue-900" : "bg-blue-100"
                } rounded-full`}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={isDark ? "#90caf9" : "#3498db"}
                />
              </View>
              <View>
                <Text style={tw`font-semibold ${styles.textColor}`}>
                  {item.type}
                </Text>
                <Text style={tw`${styles.subtextColor} text-sm`}>
                  {item.description}
                </Text>
              </View>
            </View>
            <Text style={tw`${styles.subtextColor} text-sm`}>
              {item.timeAgo}
            </Text>
          </View>
        ),
      })}
    </View>
  );

  const renderMessages = () => (
    <View style={tw`px-4`}>
      {renderActivityCard(messages, "chatbubbles-outline", {
        title: "Recent Messages",
        render: (item) => (
          <View
            key={item.id}
            style={tw`flex-row justify-between items-center py-2 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <View>
              <Text style={tw`font-semibold ${styles.textColor}`}>
                {item.sender}
              </Text>
              <Text style={tw`${styles.subtextColor} text-sm`}>
                {item.lastMessage}
              </Text>
            </View>
            <Text style={tw`${styles.subtextColor} text-sm`}>
              {item.timeAgo}
            </Text>
          </View>
        ),
      })}
    </View>
  );

  // Loading State
  if (loading) {
    return (
      <SafeAreaView
        style={tw`flex-1 ${styles.background} items-center justify-center`}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={tw`mt-4 text-base ${styles.subtextColor}`}>
          Loading admin dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, followSystem }}>
      <SafeAreaView style={tw`flex-1 ${styles.background}`}>
        <StatusBar
          barStyle={styles.statusBarStyle}
          backgroundColor={styles.statusBarColor}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-6`}
        >
          {renderHeader()}
          <View style={tw`-mt-10`}>
            {renderQuickActions()}
            {renderMaintenanceActivities()}
            {renderMessages()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

export default AdminDashboardScreen;
