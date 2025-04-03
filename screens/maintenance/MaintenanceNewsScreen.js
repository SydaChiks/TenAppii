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
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Card } from "../../components";
import { useTheme } from "../../context/ThemeContext";

const MaintenanceNewsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("maintenance");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [currentSharePost, setCurrentSharePost] = useState(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // New post/edit form state
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("maintenance");
  const [newPostImage, setNewPostImage] = useState(null);
  const [isHighPriority, setIsHighPriority] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-50",
    text: isDark ? "text-white" : "text-gray-800",
    secondaryText: isDark ? "text-gray-300" : "text-gray-600",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    headerBackground: isDark ? "bg-blue-900" : "bg-blue-500",
    searchBackground: isDark ? "bg-gray-700" : "bg-blue-400",
    searchPlaceholder: isDark ? "text-gray-300" : "text-white",
    filterButton: isDark ? "bg-gray-700" : "bg-gray-200",
    filterText: isDark ? "text-white" : "text-gray-800",
    activeFilterBackground: isDark ? "bg-blue-800" : "bg-blue-500",
    modalBackground: isDark ? "bg-gray-800" : "bg-white",
    inputBackground: isDark ? "bg-gray-700" : "bg-gray-100",
    inputText: isDark ? "text-white" : "text-gray-900",
    borderColor: isDark ? "border-gray-600" : "border-gray-300",
    shadowColor: isDark ? "shadow-gray-900" : "shadow-gray-300",
    accentBackground: isDark ? "bg-blue-900" : "bg-blue-100",
    accentText: isDark ? "text-blue-300" : "text-blue-700",
  };

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
          title: "Water Supply Interruption - Building A",
          content:
            "Due to essential maintenance work, water supply to Building A will be interrupted from 10AM to 2PM tomorrow. Please store adequate water for your needs during this period. Emergency water tanks will be available in the lobby.",
          image: "https://dummyjson.com/image/150",
          likes: 24,
          comments: 18,
          timePosted: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "maintenance",
          author: "Maintenance Team",
          isHighPriority: true,
          isMaintenance: true,
        },
        {
          id: "2",
          title: "Elevator Maintenance Schedule - July",
          content:
            "The scheduled maintenance for all elevators will take place throughout July. Each elevator will be out of service for approximately 4 hours. Schedule: Building A - July 5th, Building B - July 12th, Building C - July 19th. We apologize for any inconvenience.",
          image: "https://dummyjson.com/image/150",
          likes: 15,
          comments: 8,
          timePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "maintenance",
          author: "Maintenance Supervisor",
          isHighPriority: false,
          isMaintenance: true,
        },
        {
          id: "3",
          title: "Swimming Pool Maintenance Notice",
          content:
            "The swimming pool will be closed on Saturday for routine maintenance. We apologize for any inconvenience. The gym and sauna facilities will remain open during normal hours. Maintenance is expected to be completed by Sunday morning.",
          image: null,
          likes: 17,
          comments: 8,
          timePosted: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "maintenance",
          author: "Building Management",
          isHighPriority: true,
          isMaintenance: true,
        },
        {
          id: "4",
          title: "Community BBQ Next Weekend",
          content:
            "Join us for our quarterly community BBQ next Saturday at 2PM in the garden area. Food and drinks provided! Please RSVP by Wednesday for catering purposes. Families welcome - we'll have activities for children too.",
          image: "https://dummyjson.com/image/150",
          likes: 56,
          comments: 23,
          timePosted: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "events",
          author: "Community Manager",
          isHighPriority: false,
          isMaintenance: false,
        },
        {
          id: "5",
          title: "HVAC System Upgrade Notice",
          content:
            "We will be upgrading the HVAC system in Building C next week. This work will take place from Monday to Wednesday between 9AM and 5PM. During this time, the air conditioning may be intermittently unavailable. We'll try to minimize disruption as much as possible.",
          image: "https://dummyjson.com/image/150",
          likes: 32,
          comments: 12,
          timePosted: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "maintenance",
          author: "Maintenance Department",
          isHighPriority: false,
          isMaintenance: true,
        },
      ]);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const toggleLike = (id) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const toggleBookmark = (id) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          const newBookmarkState = !post.bookmarked;

          if (newBookmarkState) {
            setBookmarkedPosts([...bookmarkedPosts, post.id]);
          } else {
            setBookmarkedPosts(
              bookmarkedPosts.filter((postId) => postId !== post.id)
            );
          }

          return {
            ...post,
            bookmarked: newBookmarkState,
          };
        }
        return post;
      })
    );
  };

  const addComment = (id) => {
    if (commentText.trim() === "") return;

    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [
              ...(post.commentsList || []),
              {
                id: Math.random().toString(),
                text: commentText,
                user: "You (Maintenance Staff)",
                timePosted: new Date(),
              },
            ],
          };
        }
        return post;
      })
    );

    setCommentText("");
    setActivePostId(null);
  };

  const handleShare = async (post) => {
    try {
      await Share.share({
        message: `${post.title}\n\n${post.content}\n\nShared from Sandton Residences Maintenance App`,
      });
    } catch (error) {
      Alert.alert("Error", "Could not share the post");
    }
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
      likes: editingPost ? editingPost.likes : 0,
      comments: editingPost ? editingPost.comments : 0,
      commentsList: editingPost ? editingPost.commentsList : [],
      isHighPriority: isHighPriority,
      author: "Maintenance Team",
      isMaintenance: true,
      liked: editingPost ? editingPost.liked : false,
      bookmarked: editingPost ? editingPost.bookmarked : false,
    };

    if (editingPost) {
      // Update existing post
      setPosts(
        posts.map((post) => (post.id === editingPost.id ? newPost : post))
      );
      Alert.alert("Success", "Post updated successfully");
    } else {
      // Add new post
      setPosts([newPost, ...posts]);
      Alert.alert("Success", "New post created successfully");
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
          Alert.alert("Success", "Post deleted successfully");
        },
      },
    ]);
  };

  const resetPostForm = () => {
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("maintenance");
    setNewPostImage(null);
    setIsHighPriority(false);
    setEditingPost(null);
  };

  const editPost = (post) => {
    if (!post.isMaintenance) {
      Alert.alert(
        "Permission Denied",
        "You can only edit maintenance-related posts."
      );
      return;
    }

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
      if (selectedFilter === "bookmarked") {
        filtered = filtered.filter((post) => post.bookmarked);
      } else if (selectedFilter === "priority") {
        filtered = filtered.filter((post) => post.isHighPriority);
      } else if (selectedFilter === "my-posts") {
        filtered = filtered.filter((post) => post.isMaintenance);
      } else {
        filtered = filtered.filter((post) => post.category === selectedFilter);
      }
    }

    return filtered;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    return format(date, "MMM d, yyyy");
  };

  const renderPost = (post) => (
    <Card
      key={post.id}
      style={`mb-4 shadow-md overflow-hidden ${styles.cardBackground}`}
    >
      {post.isHighPriority && (
        <View
          style={tw`${
            isDark ? "bg-red-900" : "bg-red-100"
          } px-4 py-2 border-l-4 border-red-500`}
        >
          <Text
            style={tw`${isDark ? "text-red-300" : "text-red-700"} font-medium`}
          >
            Important Announcement
          </Text>
        </View>
      )}

      <View style={tw`p-4`}>
        <View style={tw`flex-row justify-between items-start`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold mb-1 ${styles.text}`}>
              {post.title}
            </Text>
            <View style={tw`flex-row items-center mb-3 flex-wrap`}>
              <Text style={tw`text-xs ${styles.secondaryText} mr-2`}>
                {formatTimeAgo(post.timePosted)}
              </Text>
              <View
                style={tw`${
                  isDark ? "bg-blue-900" : "bg-blue-100"
                } rounded-full px-2 py-1 mr-2`}
              >
                <Text
                  style={tw`text-xs ${
                    isDark ? "text-blue-300" : "text-blue-800"
                  } capitalize`}
                >
                  {post.category}
                </Text>
              </View>
              {post.isMaintenance && (
                <View
                  style={tw`${
                    isDark ? "bg-green-900" : "bg-green-100"
                  } rounded-full px-2 py-1`}
                >
                  <Text
                    style={tw`text-xs ${
                      isDark ? "text-green-300" : "text-green-800"
                    }`}
                  >
                    Maintenance Team
                  </Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setCurrentSharePost(post);
              setShowShareOptions(true);
            }}
            style={tw`p-2`}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={isDark ? "#aaa" : "#666"}
            />
          </TouchableOpacity>
        </View>

        {post.image && (
          <Image
            source={{ uri: post.image }}
            style={tw`w-full h-48 rounded-lg mb-3`}
          />
        )}

        <Text style={tw`text-base ${styles.text} leading-relaxed mb-4`}>
          {post.content}
        </Text>

        <View
          style={tw`flex-row items-center text-xs ${styles.secondaryText} mb-3`}
        >
          <Ionicons
            name="person-outline"
            size={14}
            color={isDark ? "#aaa" : "#666"}
          />
          <Text style={tw`ml-1 ${isDark ? "text-gray-400" : "text-gray-800"}`}>
            Posted by {post.author}
          </Text>
        </View>

        <View
          style={tw`flex-row items-center justify-between border-t ${
            isDark ? "border-gray-700" : "border-gray-100"
          } pt-3`}
        >
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`flex-row items-center mr-6`}
              onPress={() => toggleLike(post.id)}
            >
              <Ionicons
                name={post.liked ? "heart" : "heart-outline"}
                size={22}
                color={post.liked ? "#FF4081" : isDark ? "#aaa" : "#666"}
              />
              <Text style={tw`ml-1 text-sm ${styles.secondaryText}`}>
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center mr-6`}
              onPress={() =>
                setActivePostId(activePostId === post.id ? null : post.id)
              }
            >
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={isDark ? "#aaa" : "#666"}
              />
              <Text style={tw`ml-1 text-sm ${styles.secondaryText}`}>
                {post.comments}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={() => toggleBookmark(post.id)}
            >
              <Ionicons
                name={post.bookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={post.bookmarked ? "#3498db" : isDark ? "#aaa" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {/* Admin actions for maintenance team posts */}
          {post.isMaintenance && (
            <View style={tw`flex-row`}>
              <TouchableOpacity style={tw`mr-3`} onPress={() => editPost(post)}>
                <Ionicons
                  name="create-outline"
                  size={22}
                  color={isDark ? "#3498db" : "#3498db"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletePost(post.id)}>
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={isDark ? "#e74c3c" : "#e74c3c"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Comment section */}
        {activePostId === post.id && (
          <View
            style={tw`mt-4 ${
              isDark ? "bg-gray-700" : "bg-gray-50"
            } p-3 rounded-lg`}
          >
            <Text style={tw`font-bold text-sm ${styles.text} mb-2`}>
              Comments ({post.comments})
            </Text>

            {post.commentsList && post.commentsList.length > 0 ? (
              <View style={tw`mb-4`}>
                {post.commentsList.map((comment) => (
                  <View
                    key={comment.id}
                    style={tw`${
                      isDark ? "bg-gray-800" : "bg-white"
                    } p-3 rounded-lg mb-2 shadow-sm`}
                  >
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`font-bold text-sm ${styles.text}`}>
                        {comment.user}
                      </Text>
                      <Text style={tw`text-xs ${styles.secondaryText}`}>
                        {comment.timePosted instanceof Date
                          ? formatTimeAgo(comment.timePosted)
                          : comment.timePosted}
                      </Text>
                    </View>
                    <Text style={tw`text-sm ${styles.text} mt-1`}>
                      {comment.text}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={tw`${styles.secondaryText} text-sm mb-2 italic`}>
                No comments yet. Be the first to comment!
              </Text>
            )}

            <View style={tw`flex-row mt-3`}>
              <TextInput
                style={tw`flex-1 h-10 px-4 ${
                  isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                } border ${
                  isDark ? "border-gray-600" : "border-gray-200"
                } rounded-full`}
                placeholder="Add a comment..."
                placeholderTextColor={isDark ? "#aaa" : "#999"}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={tw`ml-2 px-4 h-10 bg-blue-500 items-center justify-center rounded-full`}
                onPress={() => addComment(post.id)}
              >
                <Text style={tw`text-white font-bold`}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
        <View
          style={tw`${styles.modalBackground} rounded-xl p-5 w-full max-w-sm`}
        >
          <Text style={tw`text-xl font-bold mb-4 ${styles.text}`}>
            Filter News
          </Text>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "all"
                ? isDark
                  ? "bg-blue-900"
                  : "bg-blue-50 border border-blue-200"
                : isDark
                ? "bg-gray-700"
                : "bg-gray-50"
            }`}
            onPress={() => {
              setSelectedFilter("all");
              setShowFilterModal(false);
            }}
          >
            <Text
              style={tw`${
                selectedFilter === "all"
                  ? isDark
                    ? "text-blue-300 font-medium"
                    : "text-blue-800 font-medium"
                  : styles.text
              }`}
            >
              All Updates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "my-posts"
                ? isDark
                  ? "bg-blue-900"
                  : "bg-blue-50 border border-blue-200"
                : isDark
                ? "bg-gray-700"
                : "bg-gray-50"
            }`}
            onPress={() => {
              setSelectedFilter("my-posts");
              setShowFilterModal(false);
            }}
          >
            <Text
              style={tw`${
                selectedFilter === "my-posts"
                  ? isDark
                    ? "text-blue-300 font-medium"
                    : "text-blue-800 font-medium"
                  : styles.text
              }`}
            >
              Maintenance Team Posts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "maintenance"
                ? isDark
                  ? "bg-blue-900"
                  : "bg-blue-50 border border-blue-200"
                : isDark
                ? "bg-gray-700"
                : "bg-gray-50"
            }`}
            onPress={() => {
              setSelectedFilter("maintenance");
              setShowFilterModal(false);
            }}
          >
            <Text
              style={tw`${
                selectedFilter === "maintenance"
                  ? isDark
                    ? "text-blue-300 font-medium"
                    : "text-blue-800 font-medium"
                  : styles.text
              }`}
            >
              Maintenance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "events"
                ? isDark
                  ? "bg-blue-900"
                  : "bg-blue-50 border border-blue-200"
                : isDark
                ? "bg-gray-700"
                : "bg-gray-50"
            }`}
            onPress={() => {
              setSelectedFilter("events");
              setShowFilterModal(false);
            }}
          >
            <Text
              style={tw`${
                selectedFilter === "events"
                  ? isDark
                    ? "text-blue-300 font-medium"
                    : "text-blue-800 font-medium"
                  : styles.text
              }`}
            >
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "priority"
                ? isDark
                  ? "bg-blue-900"
                  : "bg-blue-50 border border-blue-200"
                : isDark
                ? "bg-gray-700"
                : "bg-gray-50"
            }`}
            onPress={() => {
              setSelectedFilter("priority");
              setShowFilterModal(false);
            }}
          >
            <Text
              style={tw`${
                selectedFilter === "priority"
                  ? isDark
                    ? "text-blue-300 font-medium"
                    : "text-blue-800 font-medium"
                  : styles.text
              }`}
            >
              Important Announcements
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "bookmarked"
                ? isDark
                  ? "bg-blue-900"
                  : "bg-blue-50 border border-blue-200"
                : isDark
                ? "bg-gray-700"
                : "bg-gray-50"
            }`}
            onPress={() => {
              setSelectedFilter("bookmarked");
              setShowFilterModal(false);
            }}
          >
            <Text
              style={tw`${
                selectedFilter === "bookmarked"
                  ? isDark
                    ? "text-blue-300 font-medium"
                    : "text-blue-800 font-medium"
                  : styles.text
              }`}
            >
              Bookmarked Posts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`mt-3 p-3 ${
              isDark ? "bg-gray-600" : "bg-gray-200"
            } rounded-lg items-center`}
            onPress={() => setShowFilterModal(false)}
          >
            <Text
              style={tw`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderShareModal = () => (
    <Modal
      visible={showShareOptions}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowShareOptions(false)}
    >
      <TouchableOpacity
        style={tw`flex-1 bg-black bg-opacity-50 justify-end items-center`}
        activeOpacity={1}
        onPress={() => setShowShareOptions(false)}
      >
        <View style={tw`${styles.modalBackground} rounded-t-xl p-5 w-full`}>
          <View style={tw`items-center mb-3`}>
            <View style={tw`w-12 h-1 bg-gray-300 rounded-full`}></View>
          </View>

          <Text style={tw`text-xl font-bold mb-4 text-center ${styles.text}`}>
            Share Post
          </Text>

          <TouchableOpacity
            style={tw`flex-row items-center p-4 mb-2 ${
              isDark ? "bg-gray-700" : "bg-gray-50"
            } rounded-xl`}
            onPress={() => {
              setShowShareOptions(false);
              if (currentSharePost) handleShare(currentSharePost);
            }}
          >
            <Ionicons name="share-social" size={24} color="#3498db" />
            <Text style={tw`ml-3 text-base font-medium ${styles.text}`}>
              Share with Other Apps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center p-4 mb-2 ${
              isDark ? "bg-gray-700" : "bg-gray-50"
            } rounded-xl`}
            onPress={() => {
              setShowShareOptions(false);
              Alert.alert("Success", "Post link copied to clipboard!");
            }}
          >
            <Ionicons name="copy" size={24} color="#3498db" />
            <Text style={tw`ml-3 text-base font-medium ${styles.text}`}>
              Copy Link
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center p-4 mb-4 ${
              isDark ? "bg-gray-700" : "bg-gray-50"
            } rounded-xl`}
            onPress={() => {
              setShowShareOptions(false);
              Alert.alert("Email Sent", "Post has been shared via email");
            }}
          >
            <Ionicons name="mail" size={24} color="#3498db" />
            <Text style={tw`ml-3 text-base font-medium ${styles.text}`}>
              Share via Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-4 ${
              isDark ? "bg-gray-600" : "bg-gray-200"
            } rounded-xl items-center`}
            onPress={() => setShowShareOptions(false)}
          >
            <Text
              style={tw`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
        <View
          style={tw`${styles.modalBackground} rounded-t-xl p-5 max-h-[90%]`}
        >
          <View style={tw`items-center mb-3`}>
            <View style={tw`w-12 h-1 bg-gray-300 rounded-full`}></View>
          </View>

          <Text style={tw`text-xl font-bold mb-4 text-center ${styles.text}`}>
            {editingPost
              ? "Edit Maintenance Post"
              : "Create Maintenance Update"}
          </Text>

          <ScrollView>
            <Text style={tw`text-sm font-medium mb-2 ${styles.text}`}>
              Title
            </Text>
            <TextInput
              style={tw`border ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-200 bg-white"
              } rounded-lg p-3 mb-3`}
              placeholder="Enter post title"
              placeholderTextColor={isDark ? "#aaa" : "#999"}
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />

            <Text style={tw`text-sm font-medium mb-2 ${styles.text}`}>
              Content
            </Text>
            <TextInput
              style={tw`border ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-200 bg-white"
              } rounded-lg p-3 mb-3 min-h-[100px]`}
              placeholder="Write your post content"
              placeholderTextColor={isDark ? "#aaa" : "#999"}
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
            />

            <Text style={tw`text-sm font-medium mb-2 ${styles.text}`}>
              Category
            </Text>
            <View style={tw`flex-row flex-wrap mb-3`}>
              {["maintenance", "events"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={tw`mr-2 mb-2 px-3 py-2 rounded-full ${
                    newPostCategory === cat
                      ? "bg-blue-500"
                      : isDark
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                  onPress={() => setNewPostCategory(cat)}
                >
                  <Text
                    style={tw`${
                      newPostCategory === cat
                        ? "text-white"
                        : isDark
                        ? "text-gray-300"
                        : "text-gray-800"
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
                color={isHighPriority ? "#3498db" : isDark ? "#aaa" : "#666"}
              />
              <Text style={tw`ml-2 ${styles.text}`}>
                Mark as Important Announcement
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center mb-3`}
              onPress={pickImage}
            >
              <Ionicons
                name="image-outline"
                size={24}
                color={isDark ? "#aaa" : "#666"}
              />
              <Text style={tw`ml-2 ${styles.text}`}>
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
                style={tw`flex-1 mr-2 p-3 ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                } rounded-lg`}
                onPress={() => {
                  setShowCreatePostModal(false);
                  resetPostForm();
                }}
              >
                <Text
                  style={tw`text-center font-medium ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
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

  if (loading && !refreshing) {
    return (
      <SafeAreaView
        style={tw`flex-1 items-center justify-center ${styles.background}`}
      >
        <View style={tw`flex-col h-screen`}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={tw`mt-4 text-base ${styles.secondaryText}`}>
            Loading maintenance updates...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      {/* Header */}
      <Animated.View
        style={[
          tw`${styles.headerBackground} p-4 pb-6 rounded-b-3xl`,
          { height: headerHeight },
        ]}
      >
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`w-10 h-10 items-center justify-center`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-white`}>
            Maintenance Updates
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
          style={tw`flex-row items-center ${styles.searchBackground} rounded-full px-4 py-2`}
        >
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.8)" />
          <TextInput
            style={tw`flex-1 ml-2 ${styles.searchPlaceholder} placeholder:opacity-70`}
            placeholder="Search maintenance updates..."
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
            onRefresh={onRefresh}
            colors={["#3498db"]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-4`}
          contentContainerStyle={tw`pb-2`}
        >
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "all"
                ? styles.activeFilterBackground
                : styles.filterButton
            }`}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={tw`${
                selectedFilter === "all" ? "text-white" : styles.filterText
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "my-posts"
                ? styles.activeFilterBackground
                : styles.filterButton
            }`}
            onPress={() => setSelectedFilter("my-posts")}
          >
            <Text
              style={tw`${
                selectedFilter === "my-posts" ? "text-white" : styles.filterText
              }`}
            >
              My Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "maintenance"
                ? styles.activeFilterBackground
                : styles.filterButton
            }`}
            onPress={() => setSelectedFilter("maintenance")}
          >
            <Text
              style={tw`${
                selectedFilter === "maintenance"
                  ? "text-white"
                  : styles.filterText
              }`}
            >
              Maintenance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "priority"
                ? styles.activeFilterBackground
                : styles.filterButton
            }`}
            onPress={() => setSelectedFilter("priority")}
          >
            <Text
              style={tw`${
                selectedFilter === "priority" ? "text-white" : styles.filterText
              }`}
            >
              Important
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "bookmarked"
                ? styles.activeFilterBackground
                : styles.filterButton
            }`}
            onPress={() => setSelectedFilter("bookmarked")}
          >
            <Text
              style={tw`${
                selectedFilter === "bookmarked"
                  ? "text-white"
                  : styles.filterText
              }`}
            >
              Saved
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Post counter */}
        <View style={tw`mb-2 flex-row justify-between items-center`}>
          <Text style={tw`${styles.secondaryText} text-sm`}>
            {filteredPosts().length}{" "}
            {filteredPosts().length === 1 ? "post" : "posts"} found
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={tw`text-blue-500 text-sm`}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {filteredPosts().length > 0 ? (
          filteredPosts().map(renderPost)
        ) : (
          <View style={tw`items-center justify-center py-16`}>
            <Ionicons
              name="newspaper-outline"
              size={60}
              color={isDark ? "#555" : "#ccc"}
            />
            <Text style={tw`${styles.secondaryText} mt-4 text-center`}>
              No maintenance updates found matching your criteria
            </Text>
            <TouchableOpacity
              style={tw`mt-4 bg-blue-500 px-4 py-2 rounded-full`}
              onPress={() => {
                setSelectedFilter("all");
                setSearchQuery("");
              }}
            >
              <Text style={tw`text-white font-medium`}>Show All Updates</Text>
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

      {/* Share options modal */}
      {renderShareModal()}
    </SafeAreaView>
  );
};

export default MaintenanceNewsScreen;
