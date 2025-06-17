import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share, Bookmark, Search, Filter } from 'lucide-react-native';

export default function NewsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: '1',
      title: 'Sandton City Mall Updates',
      content: 'New stores opening this month in Sandton City, including international fashion brands and local boutiques. Come visit our renovated food court with new dining options from around the world.',
      image: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: 42,
      comments: 15,
      timePosted: new Date(Date.now() - 2 * 60 * 60 * 1000),
      liked: false,
      bookmarked: false,
      category: 'shopping',
      author: 'Management Team',
    },
    {
      id: '2',
      title: 'Community BBQ Next Weekend',
      content: 'Join us for our quarterly community BBQ next Saturday at 2PM in the garden area. Food and drinks provided! Please RSVP by Wednesday for catering purposes.',
      image: 'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: 56,
      comments: 23,
      timePosted: new Date(Date.now() - 6 * 60 * 60 * 1000),
      liked: false,
      bookmarked: false,
      category: 'events',
      author: 'Community Manager',
    },
    {
      id: '3',
      title: 'Building Maintenance Notice',
      content: 'The swimming pool will be closed on Saturday for routine maintenance. We apologize for any inconvenience. The gym and sauna facilities will remain open during normal hours.',
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: 17,
      comments: 8,
      timePosted: new Date(Date.now() - 3 * 60 * 60 * 1000),
      liked: false,
      bookmarked: false,
      category: 'maintenance',
      author: 'Building Management',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleLike = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleBookmark = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shopping': return '#3b82f6';
      case 'events': return '#10b981';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>News & Updates</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.postMeta}>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postTime}>{formatTimeAgo(post.timePosted)}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
                  <Text style={styles.categoryText}>{post.category}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Share size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Post Image */}
            {post.image && (
              <Image source={{ uri: post.image }} style={styles.postImage} />
            )}

            {/* Post Actions */}
            <View style={styles.postActions}>
              <View style={styles.actionGroup}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleLike(post.id)}
                >
                  <Heart
                    size={20}
                    color={post.liked ? '#ef4444' : '#6b7280'}
                    fill={post.liked ? '#ef4444' : 'none'}
                  />
                  <Text style={[styles.actionText, post.liked && styles.likedText]}>
                    {post.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={20} color="#6b7280" />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() => toggleBookmark(post.id)}
              >
                <Bookmark
                  size={20}
                  color={post.bookmarked ? '#3b82f6' : '#6b7280'}
                  fill={post.bookmarked ? '#3b82f6' : 'none'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Load More */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More Posts</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postMeta: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  postTime: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  likedText: {
    color: '#ef4444',
  },
  bookmarkButton: {
    padding: 4,
  },
  loadMoreButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
});