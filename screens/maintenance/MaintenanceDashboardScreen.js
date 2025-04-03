import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import Card from "../../components/Card";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

// Sample maintenance data
const MAINTENANCE_REQUESTS = [
  {
    id: "1",
    unit: "101",
    tenant: "John Doe",
    type: "Plumbing",
    description: "Leaking faucet in kitchen",
    status: "Open",
    priority: "Medium",
    dateSubmitted: "2025-03-30T14:30:00",
    assignedTo: null,
    icon: "water-outline",
  },
  {
    id: "2",
    unit: "204",
    tenant: "Sarah Williams",
    type: "Electrical",
    description: "Power outlet not working in living room",
    status: "In Progress",
    priority: "High",
    dateSubmitted: "2025-04-01T09:15:00",
    assignedTo: "Mike T.",
    icon: "flash-outline",
  },
  {
    id: "3",
    unit: "305",
    tenant: "Robert Chen",
    type: "HVAC",
    description: "AC not cooling properly",
    status: "Scheduled",
    priority: "Medium",
    dateSubmitted: "2025-04-02T11:00:00",
    assignedTo: "HVAC Team",
    icon: "thermometer-outline",
  },
  {
    id: "4",
    unit: "118",
    tenant: "Emma Johnson",
    type: "Appliance",
    description: "Refrigerator making loud noise",
    status: "Completed",
    priority: "Low",
    dateSubmitted: "2025-03-28T16:45:00",
    assignedTo: "Alex M.",
    icon: "cube-outline",
  },
  {
    id: "5",
    unit: "422",
    tenant: "Michael Brown",
    type: "Structural",
    description: "Ceiling leak in bathroom",
    status: "Open",
    priority: "Critical",
    dateSubmitted: "2025-04-03T08:00:00",
    assignedTo: null,
    icon: "home-outline",
  },
];

const MAINTENANCE_STATS = {
  open: 12,
  inProgress: 8,
  scheduled: 5,
  completed: 24,
  totalThisMonth: 49,
  avgCompletionTime: "2.3 days",
};

const MaintenanceDashboardScreen = ({ navigation }) => {
  const { theme, toggleTheme, followSystem } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setMaintenanceRequests(MAINTENANCE_REQUESTS);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle theme toggle long press to toggle system follow
  const handleLongPress = () => {
    console.log("Follow system toggle");
  };

  // Filter maintenance requests
  const getFilteredRequests = () => {
    let filtered = [...maintenanceRequests];

    // Apply status filter
    if (activeFilter !== "All") {
      filtered = filtered.filter((request) => request.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.unit.toLowerCase().includes(query) ||
          request.tenant.toLowerCase().includes(query) ||
          request.type.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "text-red-500";
      case "High":
        return "text-orange-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  // Get background color based on status
  const getStatusBg = (status) => {
    const isDark = theme === "dark";
    switch (status) {
      case "Open":
        return isDark ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800";
      case "In Progress":
        return isDark
          ? "bg-blue-900 text-blue-300"
          : "bg-blue-100 text-blue-800";
      case "Scheduled":
        return isDark
          ? "bg-yellow-900 text-yellow-300"
          : "bg-yellow-100 text-yellow-800";
      case "Completed":
        return isDark
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-800";
    }
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
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 ${styles.background}`}>
        <View style={tw`flex flex-col items-center justify-center h-screen`}>
          <ActivityIndicator
            style={tw`w-12 h-12`}
            size="large"
            color="#3B82F6"
          />
          <Text style={tw`mt-4 text-base ${styles.subtextColor}`}>
            Loading maintenance data...
          </Text>
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
                Maintenance
              </Text>
              <Text style={tw`text-3xl font-bold text-white`}>Dashboard</Text>
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
          {/* Stats Cards */}
          <View style={tw`flex-row mb-4`}>
            <Card style={`flex-1 mr-2 ${styles.cardBackground}`}>
              <View style={tw`items-center py-3`}>
                <Text style={tw`${styles.subtextColor} mb-1`}>Open</Text>
                <Text style={tw`text-xl font-bold text-red-500`}>
                  {MAINTENANCE_STATS.open}
                </Text>
              </View>
            </Card>
            <Card style={`flex-1 mx-2 ${styles.cardBackground}`}>
              <View style={tw`items-center py-3`}>
                <Text style={tw`${styles.subtextColor} mb-1`}>In Progress</Text>
                <Text style={tw`text-xl font-bold text-blue-500`}>
                  {MAINTENANCE_STATS.inProgress}
                </Text>
              </View>
            </Card>
            <Card style={`flex-1 ml-2 ${styles.cardBackground}`}>
              <View style={tw`items-center py-3`}>
                <Text style={tw`${styles.subtextColor} mb-1`}>Completed</Text>
                <Text style={tw`text-xl font-bold text-green-500`}>
                  {MAINTENANCE_STATS.completed}
                </Text>
              </View>
            </Card>
          </View>

          {/* Search Bar */}
          <Card style={`mb-4 ${styles.cardBackground}`}>
            <View style={tw`p-2`}>
              <View
                style={tw`flex-row items-center ${styles.inputBackground} rounded-lg px-3 py-2`}
              >
                <Ionicons
                  name="search"
                  size={20}
                  color={isDark ? "#aaa" : "#666"}
                />
                <TextInput
                  style={tw`flex-1 ml-2 ${styles.inputText}`}
                  placeholder="Search requests..."
                  placeholderTextColor={isDark ? "#aaa" : "#666"}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={isDark ? "#aaa" : "#666"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`mb-4`}
          >
            {["All", "Open", "In Progress", "Scheduled", "Completed"].map(
              (filter) => (
                <TouchableOpacity
                  key={filter}
                  style={tw`px-4 py-2 mr-2 rounded-full ${
                    activeFilter === filter
                      ? isDark
                        ? "bg-blue-700"
                        : "bg-blue-500"
                      : isDark
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text
                    style={tw`${
                      activeFilter === filter ? "text-white" : styles.textColor
                    } font-medium`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          {/* Quick Actions */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
              Quick Actions
            </Text>
            <View style={tw`flex-row flex-wrap -mx-1`}>
              <QuickActionButton
                icon="add-circle-outline"
                label="New Request"
                color={isDark ? "#90caf9" : "#3498db"}
                bgColor={isDark ? "bg-blue-900" : "bg-blue-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => alert("Create new maintenance request")}
              />
              <QuickActionButton
                icon="build-outline"
                label="Assign Tasks"
                color={isDark ? "#ffcc80" : "#e67e22"}
                bgColor={isDark ? "bg-yellow-900" : "bg-orange-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => alert("Assign maintenance tasks")}
              />
              <QuickActionButton
                icon="checkmark-done-outline"
                label="Mark Complete"
                color={isDark ? "#a5d6a7" : "#2ecc71"}
                bgColor={isDark ? "bg-green-900" : "bg-green-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => alert("Mark tasks as complete")}
              />
              <QuickActionButton
                icon="analytics-outline"
                label="Reports"
                color={isDark ? "#ce93d8" : "#9c27b0"}
                bgColor={isDark ? "bg-purple-900" : "bg-purple-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => alert("Maintenance reports")}
              />
              <QuickActionButton
                icon="calendar-outline"
                label="Schedule"
                color={isDark ? "#ef9a9a" : "#e53935"}
                bgColor={isDark ? "bg-red-900" : "bg-red-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => alert("Maintenance schedule")}
              />
              <QuickActionButton
                icon="cog-outline"
                label="Settings"
                color={isDark ? "#80cbc4" : "#009688"}
                bgColor={isDark ? "bg-teal-900" : "bg-teal-100"}
                cardBg={styles.cardBackground}
                textColor={styles.textColor}
                onPress={() => alert("Maintenance settings")}
              />
            </View>
          </View>

          {/* Maintenance Requests */}
          <View style={tw`mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-xl font-bold ${styles.textColor}`}>
                Maintenance Requests
              </Text>
              <TouchableOpacity>
                <Text style={tw`text-blue-500`}>View All</Text>
              </TouchableOpacity>
            </View>

            {getFilteredRequests().length === 0 ? (
              <Card style={`p-4 ${styles.cardBackground}`}>
                <View style={tw`flex items-center justify-center py-6`}>
                  <Ionicons
                    name="document-outline"
                    size={40}
                    color={isDark ? "#555" : "#ccc"}
                  />
                  <Text style={tw`${styles.subtextColor} mt-2`}>
                    No maintenance requests found
                  </Text>
                </View>
              </Card>
            ) : (
              getFilteredRequests().map((request) => (
                <Card key={request.id} style={`mb-2 ${styles.cardBackground}`}>
                  <TouchableOpacity
                    onPress={() =>
                      alert(`View details for request ${request.id}`)
                    }
                  >
                    <View style={tw`p-3`}>
                      <View
                        style={tw`flex-row justify-between items-center mb-2`}
                      >
                        <View style={tw`flex-row items-center`}>
                          <View
                            style={tw`p-2 mr-3 ${
                              isDark ? "bg-blue-900" : "bg-blue-100"
                            } rounded-full ${styles.iconBackgroundColor}`}
                          >
                            <Ionicons
                              name={request.icon}
                              size={18}
                              color={isDark ? "#90caf9" : "#3498db"}
                            />
                          </View>
                          <View>
                            <Text style={tw`font-semibold ${styles.textColor}`}>
                              {request.type} - Unit {request.unit}
                            </Text>
                            <Text style={tw`text-sm ${styles.subtextColor}`}>
                              {request.tenant}
                            </Text>
                          </View>
                        </View>
                        <View style={tw`flex items-end`}>
                          <Text
                            style={tw`text-xs ${getPriorityColor(
                              request.priority
                            )}`}
                          >
                            {request.priority} Priority
                          </Text>
                          <Text style={tw`text-xs ${styles.subtextColor}`}>
                            {format(
                              new Date(request.dateSubmitted),
                              "MMM d, h:mm a"
                            )}
                          </Text>
                        </View>
                      </View>

                      <Text style={tw`${styles.textColor} mb-2`}>
                        {request.description}
                      </Text>

                      <View style={tw`flex-row justify-between items-center`}>
                        <View style={tw`flex-row items-center`}>
                          <Text
                            style={tw`text-xs px-2 py-1 rounded-full ${getStatusBg(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </Text>
                        </View>
                        <Text style={tw`text-xs ${styles.subtextColor}`}>
                          {request.assignedTo
                            ? `Assigned to: ${request.assignedTo}`
                            : "Unassigned"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={tw`absolute bottom-6 right-6 w-14 h-14 rounded-full ${
          isDark ? "bg-blue-700" : "bg-blue-500"
        } items-center justify-center shadow-lg`}
        onPress={() => alert("Create new maintenance request")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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

export default MaintenanceDashboardScreen;
