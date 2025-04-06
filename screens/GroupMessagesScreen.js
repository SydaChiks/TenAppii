import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import Button from "../components/Button";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";

const GroupMessagesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === "dark";
  // Theme specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-100",
    statusBarStyle: isDark ? "light-content" : "dark-content",
    statusBarColor: isDark ? "#121212" : "#f9f9f9",
    headerBackground: isDark ? "bg-blue-800" : "bg-blue-500",
    headerTextColor: isDark ? "text-blue-200" : "text-blue-100",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textColor: isDark ? "text-white" : "text-black",
    subtextColor: isDark ? "text-gray-400" : "text-gray-500",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    inputBackground: isDark ? "bg-gray-700" : "bg-white",
    inputText: isDark ? "text-white" : "text-gray-900",
    placeholderColor: isDark ? "#9ca3af" : "#9ca3af",
    modalBackground: isDark ? "bg-gray-800" : "bg-white",
    officialGroupBg: isDark ? "bg-green-900" : "bg-green-100",
    officialGroupIcon: isDark ? "#81c784" : "#2ecc71",
    unofficialGroupBg: isDark ? "bg-blue-900" : "bg-blue-100",
    unofficialGroupIcon: isDark ? "#90caf9" : "#3498db",
    unreadBadge: isDark ? "bg-red-600" : "bg-red-500",
    chevronColor: isDark ? "#777" : "#999",
    searchButtonBg: isDark ? "bg-blue-700" : "bg-blue-400",
    addButtonBg: isDark ? "bg-blue-700" : "bg-blue-400",
    activeTabBorder: isDark ? "border-blue-400" : "border-blue-500",
    activeTabText: isDark ? "text-blue-400" : "text-blue-500",
    inactiveTabText: isDark ? "text-gray-400" : "text-gray-500",
    quickActionBg: isDark ? "bg-gray-700" : "bg-white",
    quickActionIconBg: isDark ? "bg-blue-900" : "bg-blue-100",
    quickActionIconColor: isDark ? "#90caf9" : "#3498db",
    announcementsIconBg: isDark ? "bg-green-900" : "bg-green-100",
    announcementsIconColor: isDark ? "#81c784" : "#2ecc71",
    maintenanceIconBg: isDark ? "bg-orange-900" : "bg-orange-100",
    maintenanceIconColor: isDark ? "#ffb74d" : "#e67e22",
    memberSelectBg: isDark ? "bg-gray-700" : "bg-white",
    memberSelectBorder: isDark ? "border-gray-600" : "border-gray-300",
    memberSelectCheck: isDark ? "bg-blue-600" : "bg-blue-500",
  };

  // Mock data
  const residents = [
    { id: "1", name: "John Smith", apt: "101" },
    { id: "2", name: "Maria Rodriguez", apt: "205" },
    { id: "3", name: "David Lee", apt: "310" },
    { id: "4", name: "Sarah Johnson", apt: "412" },
    { id: "5", name: "Michael Brown", apt: "507" },
    { id: "6", name: "Jennifer Wong", apt: "603" },
    { id: "7", name: "Robert Garcia", apt: "108" },
    { id: "8", name: "Linda Kim", apt: "214" },
  ];

  const existingGroups = [
    {
      id: "1",
      name: "Building Announcements",
      members: "All residents",
      lastMessage: "Water shut-off scheduled for Friday",
      unread: 2,
      lastActive: "10:30 AM",
      isOfficial: true,
    },
    {
      id: "2",
      name: "Floor 3 Residents",
      members: "12 people",
      lastMessage: "Anyone interested in a floor meetup?",
      unread: 0,
      lastActive: "Yesterday",
      isOfficial: false,
    },
    {
      id: "3",
      name: "Maintenance Updates",
      members: "All residents",
      lastMessage: "Elevator maintenance complete",
      unread: 1,
      lastActive: "9:15 AM",
      isOfficial: true,
    },
    {
      id: "4",
      name: "Community Events",
      members: "45 people",
      lastMessage: "Pool party this weekend!",
      unread: 0,
      lastActive: "Yesterday",
      isOfficial: false,
    },
    {
      id: "5",
      name: "Fitness Center",
      members: "18 people",
      lastMessage: "New equipment arrives next week",
      unread: 0,
      lastActive: "Mar 20",
      isOfficial: false,
    },
  ];

  const filteredGroups = existingGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.apt.includes(searchQuery)
  );

  const toggleMemberSelection = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const createNewGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      Alert.alert(
        "Error",
        "Please enter a group name and select at least one member"
      );
      return;
    }

    const newGroupId = `new-${Date.now()}`;
    setModalVisible(false);
    setGroupName("");
    setSelectedMembers([]);

    navigation.navigate("Chat", {
      conversation: {
        id: newGroupId,
        sender: groupName,
        messages: [],
      },
    });
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={tw`p-4 border-b ${styles.borderColor} flex-row items-center`}
      onPress={() =>
        navigation.navigate("Chat", {
          conversation: {
            id: item.id,
            sender: item.name,
            messages: [
              {
                id: "1",
                text: item.lastMessage,
                time: item.lastActive,
                isSent: false,
              },
            ],
          },
        })
      }
    >
      <View
        style={tw`w-12 h-12 ${
          item.isOfficial ? styles.officialGroupBg : styles.unofficialGroupBg
        } rounded-full items-center justify-center mr-3`}
      >
        <Ionicons
          name={item.isOfficial ? "megaphone" : "people"}
          size={24}
          color={
            item.isOfficial
              ? styles.officialGroupIcon
              : styles.unofficialGroupIcon
          }
        />
        {item.unread > 0 && (
          <View
            style={tw`absolute -top-1 -right-1 ${styles.unreadBadge} rounded-full w-5 h-5 items-center justify-center`}
          >
            <Text style={tw`text-white text-xs font-bold`}>{item.unread}</Text>
          </View>
        )}
      </View>
      <View style={tw`flex-1`}>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`font-semibold text-lg ${styles.textColor}`}>
            {item.name}
          </Text>
          <Text style={tw`text-xs ${styles.subtextColor}`}>
            {item.lastActive}
          </Text>
        </View>
        <Text style={tw`text-xs ${styles.subtextColor}`}>{item.members}</Text>
        <Text
          style={tw`mt-1 ${item.unread > 0 ? "font-semibold" : ""} ${
            styles.subtextColor
          }`}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={styles.chevronColor} />
    </TouchableOpacity>
  );

  const renderCreateGroupModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={tw`flex-1 bg-black bg-opacity-50 justify-end`}>
        <View style={tw`${styles.modalBackground} rounded-t-3xl p-5 h-3/4`}>
          <View
            style={tw`w-16 h-1 ${styles.borderColor} rounded-full mx-auto mb-5`}
          />
          <Text
            style={tw`text-xl font-bold mb-4 text-center ${styles.textColor}`}
          >
            Create New Group
          </Text>

          <View style={tw`mb-5`}>
            <Text style={tw`mb-2 font-medium ${styles.textColor}`}>
              Group Name
            </Text>
            <TextInput
              style={tw`border ${styles.borderColor} rounded-lg p-3 text-base ${styles.inputBackground} ${styles.inputText}`}
              placeholder="Enter group name"
              placeholderTextColor={styles.placeholderColor}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>

          <View style={tw`mb-3`}>
            <Text style={tw`mb-2 font-medium ${styles.textColor}`}>
              Select Members
            </Text>
            <View
              style={tw`flex-row items-center border ${styles.borderColor} rounded-lg mb-2 ${styles.inputBackground}`}
            >
              <Ionicons
                name="search"
                size={20}
                color={styles.subtextColor}
                style={tw`ml-3`}
              />
              <TextInput
                style={tw`p-2 flex-1 text-base ${styles.inputText}`}
                placeholder="Search by name or apartment"
                placeholderTextColor={styles.placeholderColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={tw`p-2`}
                  onPress={() => setSearchQuery("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={styles.subtextColor}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={tw`text-sm ${styles.subtextColor}`}>
              {selectedMembers.length} members selected
            </Text>
          </View>

          <FlatList
            data={filteredResidents}
            keyExtractor={(item) => item.id}
            style={tw`max-h-96 mb-5`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`flex-row items-center py-3 border-b ${styles.borderColor}`}
                onPress={() => toggleMemberSelection(item.id)}
              >
                <View
                  style={tw`w-10 h-10 ${styles.unofficialGroupBg} rounded-full items-center justify-center mr-3`}
                >
                  <Text style={tw`font-bold ${styles.unofficialGroupIcon}`}>
                    {item.name.substring(0, 1)}
                  </Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium ${styles.textColor}`}>
                    {item.name}
                  </Text>
                  <Text style={tw`text-sm ${styles.subtextColor}`}>
                    Apt {item.apt}
                  </Text>
                </View>
                <View
                  style={tw`w-6 h-6 rounded-full border ${
                    styles.memberSelectBorder
                  } items-center justify-center
                  ${
                    selectedMembers.includes(item.id)
                      ? `${styles.memberSelectCheck} border-transparent`
                      : styles.memberSelectBg
                  }`}
                >
                  {selectedMembers.includes(item.id) && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={tw`items-center py-6`}>
                <Ionicons name="people" size={40} color={styles.subtextColor} />
                <Text style={tw`${styles.subtextColor} mt-2`}>
                  No matching residents found
                </Text>
              </View>
            )}
          />

          <View style={tw`flex-row`}>
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                setGroupName("");
                setSelectedMembers([]);
                setSearchQuery("");
              }}
              style="flex-1 mr-2"
              type="outlined"
              darkMode={isDark}
            />
            <Button
              title="Create Group"
              onPress={createNewGroup}
              style="flex-1 ml-2"
              disabled={!groupName.trim() || selectedMembers.length === 0}
              darkMode={isDark}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSearchBar = () =>
    showSearch && (
      <View style={tw`px-4 mb-4`}>
        <Card style={styles.cardBackground}>
          <View
            style={tw`flex-row items-center p-2 border ${styles.borderColor} rounded-lg ${styles.inputBackground}`}
          >
            <Ionicons
              name="search"
              size={20}
              color={styles.subtextColor}
              style={tw`ml-2`}
            />
            <TextInput
              style={tw`p-2 flex-1 text-base ${styles.inputText}`}
              placeholder="Search groups by name"
              placeholderTextColor={styles.placeholderColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={tw`p-2`}
                onPress={() => setSearchQuery("")}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={styles.subtextColor}
                />
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </View>
    );

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={styles.statusBarStyle}
        backgroundColor={styles.statusBarColor}
      />

      <View style={tw`${styles.headerBackground} p-6 pt-8 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-3xl font-bold text-white`}>
              Group Messages
            </Text>
            <Text style={tw`${styles.headerTextColor} mt-1`}>
              Connect with your community
            </Text>
          </View>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`p-2 mr-2 ${styles.searchButtonBg} rounded-full`}
              onPress={() => {
                setShowSearch(!showSearch);
                if (!showSearch) setSearchQuery("");
              }}
            >
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`p-2 ${styles.addButtonBg} rounded-full`}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={tw`px-4 -mt-10 flex-1`}>
        {renderSearchBar()}

        <Card style={`mb-4 flex-1 ${styles.cardBackground}`}>
          <View style={tw`flex-row border-b ${styles.borderColor}`}>
            <TouchableOpacity
              style={tw`flex-1 py-3 px-4 flex-row items-center justify-center border-b-2 ${styles.activeTabBorder}`}
            >
              <Ionicons
                name="people"
                size={20}
                color={styles.unofficialGroupIcon}
                style={tw`mr-2`}
              />
              <Text style={tw`font-semibold ${styles.activeTabText}`}>
                All Groups
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 py-3 px-4 flex-row items-center justify-center`}
              onPress={() => navigation.navigate("Messages")}
            >
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={styles.inactiveTabText}
                style={tw`mr-2`}
              />
              <Text style={tw`font-semibold ${styles.inactiveTabText}`}>
                Direct Messages
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredGroups}
            keyExtractor={(item) => item.id}
            renderItem={renderGroupItem}
            style={tw`flex-1`}
            ListEmptyComponent={() => (
              <View style={tw`items-center justify-center py-12`}>
                <Ionicons name="people" size={60} color={styles.subtextColor} />
                <Text style={tw`${styles.subtextColor} mt-4 text-lg`}>
                  No groups found
                </Text>
                {searchQuery.length > 0 ? (
                  <Text style={tw`${styles.subtextColor} mt-2`}>
                    Try a different search term
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={tw`mt-4 bg-blue-500 py-2 px-6 rounded-full`}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={tw`text-white font-medium`}>
                      Create New Group
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </Card>

        {/* Quick Actions */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-xl font-bold mb-3 ${styles.textColor}`}>
            Quick Actions
          </Text>
          <View style={tw`flex-row`}>
            <Card style={`flex-1 mr-2 ${styles.quickActionBg}`}>
              <TouchableOpacity
                style={tw`items-center py-4`}
                onPress={() => setModalVisible(true)}
              >
                <View
                  style={tw`p-3 ${styles.quickActionIconBg} rounded-full mb-2`}
                >
                  <Ionicons
                    name="people"
                    size={24}
                    color={styles.quickActionIconColor}
                  />
                </View>
                <Text style={tw`font-medium ${styles.textColor}`}>
                  New Group
                </Text>
              </TouchableOpacity>
            </Card>
            <Card style={`flex-1 mx-2 ${styles.quickActionBg}`}>
              <TouchableOpacity
                style={tw`items-center py-4`}
                onPress={() => {
                  navigation.navigate("Chat", {
                    conversation: {
                      id: "building-announcements",
                      sender: "Building Announcements",
                      messages: [
                        {
                          id: "1",
                          text: "Water shut-off scheduled for Friday",
                          time: "10:30 AM",
                          isSent: false,
                        },
                      ],
                    },
                  });
                }}
              >
                <View
                  style={tw`p-3 ${styles.announcementsIconBg} rounded-full mb-2`}
                >
                  <Ionicons
                    name="megaphone"
                    size={24}
                    color={styles.announcementsIconColor}
                  />
                </View>
                <Text style={tw`font-medium ${styles.textColor}`}>
                  Announcements
                </Text>
              </TouchableOpacity>
            </Card>
            <Card style={`flex-1 ml-2 ${styles.quickActionBg}`}>
              <TouchableOpacity
                style={tw`items-center py-4`}
                onPress={() => navigation.navigate("MaintenanceRequest")}
              >
                <View
                  style={tw`p-3 ${styles.maintenanceIconBg} rounded-full mb-2`}
                >
                  <Ionicons
                    name="construct"
                    size={24}
                    color={styles.maintenanceIconColor}
                  />
                </View>
                <Text style={tw`font-medium ${styles.textColor}`}>
                  Maintenance
                </Text>
              </TouchableOpacity>
            </Card>
          </View>
        </View>
      </View>

      {renderCreateGroupModal()}
    </SafeAreaView>
  );
};

export default GroupMessagesScreen;
