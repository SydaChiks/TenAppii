import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
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
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";

const NewsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [currentSharePost, setCurrentSharePost] = useState(null);
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
          title: "Sandton City Mall Updates",
          content:
            "New stores opening this month in Sandton City, including international fashion brands and local boutiques. Come visit our renovated food court with new dining options from around the world. Special discounts available for residents.",
          image: "https://dummyjson.com/image/150",
          likes: 42,
          comments: 15,
          timePosted: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "shopping",
          author: "Management Team",
          isHighPriority: false,
        },
        {
          id: "2",
          title: "Nelson Mandela Square Events",
          content:
            "Upcoming cultural celebrations and art exhibitions at Nelson Mandela Square this weekend. Live performances scheduled each evening at 7PM. Don't miss the local artists showcase on Sunday afternoon.",
          image: "https://dummyjson.com/image/150",
          likes: 38,
          comments: 12,
          timePosted: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "events",
          author: "Events Coordinator",
          isHighPriority: false,
        },
        {
          id: "3",
          title: "Building Maintenance Notice",
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
        },
        {
          id: "5",
          title: "New Security Measures Implementation",
          content:
            "We're enhancing our security system starting next week. New access cards will be distributed on Monday at the reception desk. Please update your details and collect your new card before Friday.",
          image: "https://dummyjson.com/image/150",
          likes: 63,
          comments: 19,
          timePosted: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          liked: false,
          bookmarked: false,
          commentsList: [],
          category: "security",
          author: "Security Department",
          isHighPriority: true,
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
                user: "You",
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
        message: `${post.title}\n\n${post.content}\n\nShared from Sandton Residences App`,
      });
    } catch (error) {
      Alert.alert("Error", "Could not share the post");
    }
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
            <View style={tw`flex-row items-center mb-3`}>
              <Text style={tw`text-xs ${styles.secondaryText} mr-2`}>
                {formatTimeAgo(post.timePosted)}
              </Text>
              <View
                style={tw`${
                  isDark ? "bg-blue-900" : "bg-blue-100"
                } rounded-full px-2 py-1`}
              >
                <Text
                  style={tw`text-xs ${
                    isDark ? "text-blue-300" : "text-blue-800"
                  } capitalize`}
                >
                  {post.category}
                </Text>
              </View>
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
        </View>

        {/* Comment section */}
        {activePostId === post.id && (
          <View style={tw`mt-4 bg-gray-50 p-3 rounded-lg`}>
            <Text style={tw`font-bold text-sm text-gray-800 mb-2`}>
              Comments ({post.comments})
            </Text>

            {post.commentsList && post.commentsList.length > 0 ? (
              <View style={tw`mb-4`}>
                {post.commentsList.map((comment) => (
                  <View
                    key={comment.id}
                    style={tw`bg-white p-3 rounded-lg mb-2 shadow-sm`}
                  >
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`font-bold text-sm text-gray-800`}>
                        {comment.user}
                      </Text>
                      <Text style={tw`text-xs text-gray-500`}>
                        {comment.timePosted instanceof Date
                          ? formatTimeAgo(comment.timePosted)
                          : comment.timePosted}
                      </Text>
                    </View>
                    <Text style={tw`text-sm text-gray-700 mt-1`}>
                      {comment.text}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={tw`text-gray-500 text-sm mb-2 italic`}>
                No comments yet. Be the first to comment!
              </Text>
            )}

            <View style={tw`flex-row mt-3`}>
              <TextInput
                style={tw`flex-1 h-10 px-4 bg-white border border-gray-200 rounded-full`}
                placeholder="Add a comment..."
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
          style={tw`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-xl p-5 w-full max-w-sm`}
        >
          <Text style={tw`text-xl font-bold mb-4 ${styles.text}`}>
            Filter News
          </Text>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "all"
                ? "bg-blue-50 border border-blue-200"
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
                  ? "text-blue-800 font-medium"
                  : "text-gray-800"
              }`}
            >
              All Updates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "events"
                ? "bg-blue-50 border border-blue-200"
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
                  ? "text-blue-800 font-medium"
                  : "text-gray-800"
              }`}
            >
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "maintenance"
                ? "bg-blue-50 border border-blue-200"
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
                  ? "text-blue-800 font-medium"
                  : "text-gray-800"
              }`}
            >
              Maintenance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "shopping"
                ? "bg-blue-50 border border-blue-200"
                : "bg-gray-50"
            }`}
            onPress={() => {
              setSelectedFilter("shopping");
              setShowFilterModal(false);
            }}
          >
            <Text
              style={tw`${
                selectedFilter === "shopping"
                  ? "text-blue-800 font-medium"
                  : "text-gray-800"
              }`}
            >
              Shopping
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "security"
                ? "bg-blue-50 border border-blue-200"
                : "bg-gray-50"
            }`}
            onPress={() => {
              setSelectedFilter("security");
              setShowFilterModal(false);
            }}
          >
            <Text
              style={tw`${
                selectedFilter === "security"
                  ? "text-blue-800 font-medium"
                  : "text-gray-800"
              }`}
            >
              Security
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "priority"
                ? "bg-blue-50 border border-blue-200"
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
                  ? "text-blue-800 font-medium"
                  : "text-gray-800"
              }`}
            >
              Important Announcements
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-3 mb-2 rounded-lg ${
              selectedFilter === "bookmarked"
                ? "bg-blue-50 border border-blue-200"
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
                  ? "text-blue-800 font-medium"
                  : "text-gray-800"
              }`}
            >
              Bookmarked Posts
            </Text>
          </TouchableOpacity>

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
        <View
          style={tw`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-t-xl p-5 w-full`}
        >
          <View style={tw`items-center mb-3`}>
            <View style={tw`w-12 h-1 bg-gray-300 rounded-full`}></View>
          </View>

          <Text style={tw`text-xl font-bold mb-4 text-center`}>Share Post</Text>

          <TouchableOpacity
            style={tw`flex-row items-center p-4 mb-2 bg-gray-50 rounded-xl`}
            onPress={() => {
              setShowShareOptions(false);
              if (currentSharePost) handleShare(currentSharePost);
            }}
          >
            <Ionicons name="share-social" size={24} color="#3498db" />
            <Text style={tw`ml-3 text-base font-medium`}>
              Share with Other Apps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center p-4 mb-2 bg-gray-50 rounded-xl`}
            onPress={() => {
              setShowShareOptions(false);
              Alert.alert("Success", "Post link copied to clipboard!");
            }}
          >
            <Ionicons name="copy" size={24} color="#3498db" />
            <Text style={tw`ml-3 text-base font-medium`}>Copy Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center p-4 mb-4 bg-gray-50 rounded-xl`}
            onPress={() => {
              setShowShareOptions(false);
              Alert.alert("Email Sent", "Post has been shared via email");
            }}
          >
            <Ionicons name="mail" size={24} color="#3498db" />
            <Text style={tw`ml-3 text-base font-medium`}>Share via Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-4 bg-gray-200 rounded-xl items-center`}
            onPress={() => setShowShareOptions(false)}
          >
            <Text style={tw`font-medium text-gray-800`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView
        style={tw`flex-1 items-center justify-center  ${styles.background}`}
      >
        <View style={tw`flex-col h-screen`}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={tw`mt-4 text-base ${styles.secondaryText}`}>
            Loading news feed...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      {/* Fixed Header */}
      <View style={tw`${styles.headerBackground} p-4 pb-6 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`w-10 h-10 items-center justify-center`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-white`}>News & Updates</Text>
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
            placeholder="Search news and updates..."
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
      </View>

      {/* Fixed Filter Pills and Post Counter */}
      <View style={tw`${styles.background} pt-2`}>
        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-2`}
          contentContainerStyle={tw`px-4 pb-2`}
        >
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "all" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={tw`${
                selectedFilter === "all" ? "text-white" : "text-gray-800"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "events" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setSelectedFilter("events")}
          >
            <Text
              style={tw`${
                selectedFilter === "events" ? "text-white" : "text-gray-800"
              }`}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "maintenance" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setSelectedFilter("maintenance")}
          >
            <Text
              style={tw`${
                selectedFilter === "maintenance"
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              Maintenance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "priority" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setSelectedFilter("priority")}
          >
            <Text
              style={tw`${
                selectedFilter === "priority" ? "text-white" : "text-gray-800"
              }`}
            >
              Important
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "bookmarked" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setSelectedFilter("bookmarked")}
          >
            <Text
              style={tw`${
                selectedFilter === "bookmarked" ? "text-white" : "text-gray-800"
              }`}
            >
              Saved
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Post counter */}
        <View style={tw`px-4 mb-2 flex-row justify-between items-center`}>
          <Text style={tw`${styles.secondaryText} text-sm`}>
            {filteredPosts().length}{" "}
            {filteredPosts().length === 1 ? "post" : "posts"} found
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={tw`text-blue-500 text-sm`}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-4 pb-20`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3498db"]}
          />
        }
      >
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
      </ScrollView>

      {/* Filter modal */}
      {renderFilterModal()}

      {/* Share options modal */}
      {renderShareModal()}
    </SafeAreaView>
  );
};

export default NewsScreen;
