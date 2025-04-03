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

const GroupMessagesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Mock data - in a real app, this would come from your API
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

    // In a real app, you would send this to your API
    const newGroupId = `new-${Date.now()}`;

    setModalVisible(false);
    setGroupName("");
    setSelectedMembers([]);

    // Navigate to the new group chat
    navigation.navigate("Chat", {
      conversation: {
        id: newGroupId,
        sender: groupName,
        messages: [],
      },
    });
  };

  // Render group list item
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={tw`p-4 border-b border-gray-100 flex-row items-center`}
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
          item.isOfficial ? "bg-green-100" : "bg-blue-100"
        } rounded-full items-center justify-center mr-3`}
      >
        <Ionicons
          name={item.isOfficial ? "megaphone" : "people"}
          size={24}
          color={item.isOfficial ? "#2ecc71" : "#3498db"}
        />
        {item.unread > 0 && (
          <View
            style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center`}
          >
            <Text style={tw`text-white text-xs font-bold`}>{item.unread}</Text>
          </View>
        )}
      </View>
      <View style={tw`flex-1`}>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`font-semibold text-lg`}>{item.name}</Text>
          <Text style={tw`text-gray-500 text-xs`}>{item.lastActive}</Text>
        </View>
        <Text style={tw`text-gray-500 text-xs`}>{item.members}</Text>
        <Text
          style={tw`text-gray-600 mt-1 ${
            item.unread > 0 ? "font-semibold" : ""
          }`}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  // Modal for creating a new group
  const renderCreateGroupModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={tw`flex-1 bg-black bg-opacity-50 justify-end`}>
        <View style={tw`bg-white rounded-t-3xl p-5 h-3/4`}>
          <View style={tw`w-16 h-1 bg-gray-300 rounded-full mx-auto mb-5`} />
          <Text style={tw`text-xl font-bold mb-4 text-center`}>
            Create New Group
          </Text>

          {/* Group name input */}
          <View style={tw`mb-5`}>
            <Text style={tw`text-gray-700 mb-2 font-medium`}>Group Name</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base`}
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>

          {/* Search members */}
          <View style={tw`mb-3`}>
            <Text style={tw`text-gray-700 mb-2 font-medium`}>
              Select Members
            </Text>
            <View
              style={tw`flex-row items-center border border-gray-300 rounded-lg mb-2`}
            >
              <Ionicons name="search" size={20} color="#999" style={tw`ml-3`} />
              <TextInput
                style={tw`p-2 flex-1 text-base`}
                placeholder="Search by name or apartment"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={tw`p-2`}
                  onPress={() => setSearchQuery("")}
                >
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={tw`text-gray-500 text-sm`}>
              {selectedMembers.length} members selected
            </Text>
          </View>

          <FlatList
            data={filteredResidents}
            keyExtractor={(item) => item.id}
            style={tw`max-h-96 mb-5`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`flex-row items-center py-3 border-b border-gray-100`}
                onPress={() => toggleMemberSelection(item.id)}
              >
                <View
                  style={tw`w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3`}
                >
                  <Text style={tw`font-bold text-blue-500`}>
                    {item.name.substring(0, 1)}
                  </Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium`}>{item.name}</Text>
                  <Text style={tw`text-gray-500 text-sm`}>Apt {item.apt}</Text>
                </View>
                <View
                  style={tw`w-6 h-6 rounded-full border border-gray-300 items-center justify-center
                  ${
                    selectedMembers.includes(item.id)
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white"
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
                <Ionicons name="people" size={40} color="#ccc" />
                <Text style={tw`text-gray-500 mt-2`}>
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
            />
            <Button
              title="Create Group"
              onPress={createNewGroup}
              style="flex-1 ml-2"
              disabled={!groupName.trim() || selectedMembers.length === 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  // Search bar modal
  const renderSearchBar = () =>
    showSearch && (
      <View style={tw`px-4 mb-4`}>
        <Card>
          <View
            style={tw`flex-row items-center p-2 border border-gray-200 rounded-lg`}
          >
            <Ionicons name="search" size={20} color="#999" style={tw`ml-2`} />
            <TextInput
              style={tw`p-2 flex-1 text-base`}
              placeholder="Search groups by name"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={tw`p-2`}
                onPress={() => setSearchQuery("")}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </View>
    );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {/* Header with blue background */}
      <View style={tw`bg-blue-500 p-6 pt-8 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-3xl font-bold text-white`}>
              Group Messages
            </Text>
            <Text style={tw`text-blue-100 mt-1`}>
              Connect with your community
            </Text>
          </View>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`p-2 mr-2 bg-blue-400 rounded-full`}
              onPress={() => {
                setShowSearch(!showSearch);
                if (!showSearch) setSearchQuery("");
              }}
            >
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`p-2 bg-blue-400 rounded-full`}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={tw`px-4 -mt-10 flex-1`}>
        {renderSearchBar()}

        <Card style="mb-4 flex-1">
          <View style={tw`flex-row border-b border-gray-200`}>
            <TouchableOpacity
              style={tw`flex-1 py-3 px-4 flex-row items-center justify-center border-b-2 border-blue-500`}
            >
              <Ionicons
                name="people"
                size={20}
                color="#3498db"
                style={tw`mr-2`}
              />
              <Text style={tw`font-semibold text-blue-500`}>All Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 py-3 px-4 flex-row items-center justify-center`}
              onPress={() => {
                navigation.navigate("Messages");
              }}
            >
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="#999"
                style={tw`mr-2`}
              />
              <Text style={tw`font-semibold text-gray-500`}>
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
                <Ionicons name="people" size={60} color="#ccc" />
                <Text style={tw`text-gray-500 mt-4 text-lg`}>
                  No groups found
                </Text>
                {searchQuery.length > 0 ? (
                  <Text style={tw`text-gray-400 mt-2`}>
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
          <Text style={tw`text-xl font-bold mb-3`}>Quick Actions</Text>
          <View style={tw`flex-row`}>
            <Card style="flex-1 mr-2">
              <TouchableOpacity
                style={tw`items-center py-4`}
                onPress={() => setModalVisible(true)}
              >
                <View style={tw`p-3 bg-blue-100 rounded-full mb-2`}>
                  <Ionicons name="people" size={24} color="#3498db" />
                </View>
                <Text style={tw`font-medium`}>New Group</Text>
              </TouchableOpacity>
            </Card>
            <Card style="flex-1 mx-2">
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
                <View style={tw`p-3 bg-green-100 rounded-full mb-2`}>
                  <Ionicons name="megaphone" size={24} color="#2ecc71" />
                </View>
                <Text style={tw`font-medium`}>Announcements</Text>
              </TouchableOpacity>
            </Card>
            <Card style="flex-1 ml-2">
              <TouchableOpacity
                style={tw`items-center py-4`}
                onPress={() => {
                  navigation.navigate("MaintenanceRequest");
                }}
              >
                <View style={tw`p-3 bg-orange-100 rounded-full mb-2`}>
                  <Ionicons name="construct" size={24} color="#e67e22" />
                </View>
                <Text style={tw`font-medium`}>Maintenance</Text>
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
