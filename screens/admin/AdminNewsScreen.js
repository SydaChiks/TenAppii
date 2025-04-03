import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Card } from "../../components";

const AdminNewsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // New post/edit form state
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("events");
  const [newPostImage, setNewPostImage] = useState(null);
  const [isHighPriority, setIsHighPriority] = useState(false);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 80],
    extrapolate: "clamp",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPosts([
        {
          id: "1",
          title: "Sandton City Mall Updates",
          content:
            "New stores opening this month in Sandton City, including international fashion brands and local boutiques. Come visit our renovated food court with new dining options from around the world. Special discounts available for residents.",
          image: "https://dummyjson.com/image/150",
          likes: 42,
          comments: 15,
          timePosted: new Date(Date.now() - 2 * 60 * 60 * 1000),
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "shopping",
          author: "Management Team",
          isHighPriority: false,
        },
        // ... (same posts as in NewsScreen)
      ]);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPostImage(result.assets[0].uri);
    }
  };

  const createOrUpdatePost = () => {
    // Validation
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newPost = {
      id: editingPost ? editingPost.id : Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      image: newPostImage,
      category: newPostCategory,
      timePosted: new Date(),
      likes: 0,
      comments: 0,
      commentsList: [],
      isHighPriority: isHighPriority,
      author: "Admin",
    };

    if (editingPost) {
      // Update existing post
      setPosts(
        posts.map((post) => (post.id === editingPost.id ? newPost : post))
      );
    } else {
      // Add new post
      setPosts([newPost, ...posts]);
    }

    // Reset form and close modal
    resetPostForm();
    setShowCreatePostModal(false);
  };

  const deletePost = (postId) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setPosts(posts.filter((post) => post.id !== postId));
        },
      },
    ]);
  };

  const resetPostForm = () => {
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("events");
    setNewPostImage(null);
    setIsHighPriority(false);
    setEditingPost(null);
  };

  const editPost = (post) => {
    setEditingPost(post);
    setNewPostTitle(post.title);
    setNewPostContent(post.content);
    setNewPostCategory(post.category);
    setNewPostImage(post.image);
    setIsHighPriority(post.isHighPriority);
    setShowCreatePostModal(true);
  };

  const filteredPosts = () => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      if (selectedFilter === "priority") {
        filtered = filtered.filter((post) => post.isHighPriority);
      } else {
        filtered = filtered.filter((post) => post.category === selectedFilter);
      }
    }

    return filtered;
  };

  const renderCreatePostModal = () => (
    <Modal
      visible={showCreatePostModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCreatePostModal(false)}
    >
      <TouchableOpacity
        style={tw`flex-1 bg-black bg-opacity-50 justify-end`}
        activeOpacity={1}
        onPress={() => setShowCreatePostModal(false)}
      >
        <View style={tw`bg-white rounded-t-xl p-5 max-h-[90%]`}>
          <View style={tw`items-center mb-3`}>
            <View style={tw`w-12 h-1 bg-gray-300 rounded-full`}></View>
          </View>

          <Text style={tw`text-xl font-bold mb-4 text-center`}>
            {editingPost ? "Edit Post" : "Create New Post"}
          </Text>

          <ScrollView>
            <Text style={tw`text-sm font-medium mb-2 text-gray-700`}>
              Title
            </Text>
            <TextInput
              style={tw`border border-gray-200 rounded-lg p-3 mb-3`}
              placeholder="Enter post title"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />

            <Text style={tw`text-sm font-medium mb-2 text-gray-700`}>
              Content
            </Text>
            <TextInput
              style={tw`border border-gray-200 rounded-lg p-3 mb-3 min-h-[100px]`}
              placeholder="Write your post content"
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
            />

            <Text style={tw`text-sm font-medium mb-2 text-gray-700`}>
              Category
            </Text>
            <View style={tw`flex-row flex-wrap mb-3`}>
              {["events", "maintenance", "shopping", "security"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={tw`mr-2 mb-2 px-3 py-2 rounded-full ${
                    newPostCategory === cat ? "bg-blue-500" : "bg-gray-200"
                  }`}
                  onPress={() => setNewPostCategory(cat)}
                >
                  <Text
                    style={tw`${
                      newPostCategory === cat ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={tw`flex-row items-center mb-3`}
              onPress={() => setIsHighPriority(!isHighPriority)}
            >
              <Ionicons
                name={isHighPriority ? "checkbox-outline" : "square-outline"}
                size={24}
                color={isHighPriority ? "#3498db" : "#666"}
              />
              <Text style={tw`ml-2 text-gray-700`}>
                Mark as Important Announcement
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center mb-3`}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={24} color="#666" />
              <Text style={tw`ml-2 text-gray-700`}>
                {newPostImage ? "Change Image" : "Add Image"}
              </Text>
            </TouchableOpacity>

            {newPostImage && (
              <Image
                source={{ uri: newPostImage }}
                style={tw`w-full h-48 rounded-lg mb-3`}
              />
            )}

            <View style={tw`flex-row`}>
              <TouchableOpacity
                style={tw`flex-1 mr-2 p-3 bg-gray-200 rounded-lg`}
                onPress={() => {
                  setShowCreatePostModal(false);
                  resetPostForm();
                }}
              >
                <Text style={tw`text-center font-medium text-gray-800`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 p-3 bg-blue-500 rounded-lg`}
                onPress={createOrUpdatePost}
              >
                <Text style={tw`text-center font-medium text-white`}>
                  {editingPost ? "Update" : "Post"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderPost = (post) => (
    <Card key={post.id} style="mb-4 shadow-md overflow-hidden">
      {post.isHighPriority && (
        <View style={tw`bg-red-100 px-4 py-2 border-l-4 border-red-500`}>
          <Text style={tw`text-red-700 font-medium`}>
            Important Announcement
          </Text>
        </View>
      )}

      <View style={tw`p-4`}>
        <View style={tw`flex-row justify-between items-start mb-3`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold mb-1 text-gray-800`}>
              {post.title}
            </Text>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-xs text-gray-500 mr-2`}>
                {format(post.timePosted, "MMM d, yyyy HH:mm")}
              </Text>
              <View style={tw`bg-blue-100 rounded-full px-2 py-1`}>
                <Text style={tw`text-xs text-blue-800 capitalize`}>
                  {post.category}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {post.image && (
          <Image
            source={{ uri: post.image }}
            style={tw`w-full h-48 rounded-lg mb-3`}
          />
        )}

        <Text style={tw`text-base text-gray-700 leading-relaxed mb-4`}>
          {post.content}
        </Text>

        <View
          style={tw`flex-row justify-between items-center border-t border-gray-100 pt-3`}
        >
          <View style={tw`flex-row`}>
            <View style={tw`flex-row items-center mr-4`}>
              <Ionicons name="heart" size={18} color="#666" />
              <Text style={tw`ml-1 text-sm text-gray-600`}>{post.likes}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="chatbubble" size={18} color="#666" />
              <Text style={tw`ml-1 text-sm text-gray-600`}>
                {post.comments}
              </Text>
            </View>
          </View>

          <View style={tw`flex-row`}>
            <TouchableOpacity style={tw`mr-3`} onPress={() => editPost(post)}>
              <Ionicons name="create-outline" size={22} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deletePost(post.id)}>
              <Ionicons name="trash-outline" size={22} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity
        style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center p-4`}
        activeOpacity={1}
        onPress={() => setShowFilterModal(false)}
      >
        <View style={tw`bg-white rounded-xl p-5 w-full max-w-sm`}>
          <Text style={tw`text-xl font-bold mb-4 text-gray-800`}>
            Filter Posts
          </Text>

          {[
            "all",
            "events",
            "maintenance",
            "shopping",
            "security",
            "priority",
          ].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={tw`p-3 mb-2 rounded-lg ${
                selectedFilter === filter
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50"
              }`}
              onPress={() => {
                setSelectedFilter(filter);
                setShowFilterModal(false);
              }}
            >
              <Text
                style={tw`${
                  selectedFilter === filter
                    ? "text-blue-800 font-medium"
                    : "text-gray-800"
                }`}
              >
                {filter === "all"
                  ? "All Posts"
                  : filter === "priority"
                  ? "Important Announcements"
                  : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={tw`mt-3 p-3 bg-gray-200 rounded-lg items-center`}
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={tw`font-medium text-gray-800`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <View style={tw`flex-col items-center justify-center h-screen`}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={tw`mt-4 text-base text-gray-600`}>Loading posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <Animated.View
        style={[tw`bg-blue-500 p-4 pb-6`, { height: headerHeight }]}
      >
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`w-10 h-10 items-center justify-center`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-white`}>
            Manage News & Updates
          </Text>
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={tw`w-10 h-10 items-center justify-center`}
          >
            <Ionicons name="options-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View
          style={tw`flex-row items-center bg-blue-400 rounded-full px-4 py-2`}
        >
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.8)" />
          <TextInput
            style={tw`flex-1 ml-2 text-white placeholder:text-blue-100`}
            placeholder="Search posts..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color="rgba(255,255,255,0.8)"
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPosts();
            }}
            colors={["#3498db"]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Post counter */}
        <View style={tw`mb-2 flex-row justify-between items-center`}>
          <Text style={tw`text-gray-500 text-sm`}>
            {filteredPosts().length}{" "}
            {filteredPosts().length === 1 ? "post" : "posts"} found
          </Text>
          <TouchableOpacity onPress={() => fetchPosts()}>
            <Text style={tw`text-blue-500 text-sm`}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {filteredPosts().length > 0 ? (
          filteredPosts().map(renderPost)
        ) : (
          <View style={tw`items-center justify-center py-16`}>
            <Ionicons name="newspaper-outline" size={60} color="#ccc" />
            <Text style={tw`text-gray-500 mt-4 text-center`}>
              No posts found matching your criteria
            </Text>
            <TouchableOpacity
              style={tw`mt-4 bg-blue-500 px-4 py-2 rounded-full`}
              onPress={() => {
                setSelectedFilter("all");
                setSearchQuery("");
              }}
            >
              <Text style={tw`text-white font-medium`}>Show All Posts</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom space for better scrolling experience */}
        <View style={tw`h-20`} />
      </Animated.ScrollView>

      {/* Floating button to create a post */}
      <TouchableOpacity
        style={tw`absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg`}
        onPress={() => {
          resetPostForm();
          setShowCreatePostModal(true);
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Create/Edit Post Modal */}
      {renderCreatePostModal()}

      {/* Filter Modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

export default AdminNewsScreen;
