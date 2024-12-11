<template>
    <div class="profile-page" v-if="user">
      <h2>{{ user.username }}'s Profile</h2>
  
      <div class="avatar-wrapper">
        <img :src="getAvatarUrl()" alt="Base Avatar" class="avatar-image" />
        <img
          v-for="item in sortedEquippedItems"
          :key="item.item_id"
          :src="getImageUrl(item.image_url)"
          alt="Equipped Item"
          class="equipped-item-overlay"
          :class="getItemClass(item.item_type)"
        />
      </div>
  
      <p>Date Registered: {{ user.registered_at }}</p>
      <button v-if="!isOwnProfile" @click="sendFriendRequest">Add Friend</button>
    </div>
    <div v-else class="loading">Loading...</div>
  </template>
  
  <script>
import axios from 'axios';
import { userStore } from '../store/user';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const user = ref(null);
    const equippedItems = ref([]);
    const route = useRoute();
    const userId = ref(route.params.id);

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId.value}`);
        user.value = response.data;
        await fetchEquippedItems();
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Fetch equipped items for the user
    const fetchEquippedItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/catalog/equipped/${userId.value}`);
        equippedItems.value = response.data;
      } catch (error) {
        console.error('Error fetching equipped items:', error);
      }
    };

    // Watch for changes in userId and fetch profile data
    watch(() => route.params.id, (newId) => {
      userId.value = newId;
      fetchUserProfile();
    });

    // Send a friend request
    const sendFriendRequest = async () => {
      try {
        await axios.post('http://localhost:5000/api/friends/request', {
          senderId: userStore.id,
          receiverId: userId.value,
        });
        alert('Friend request sent!');
      } catch (error) {
        console.error('Error sending friend request:', error);
      }
    };

    const getAvatarUrl = (avatar) => (avatar ? `/avatars/${avatar}` : '/src/assets/baseAvatarSpaced.png');

    const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/default-item.png');

    const itemOrder = {
      back: 1,
      pants: 2,
      shirt: 3,
      hair: 4,
      hat: 5,
      package: 6,
      front: 7,
    };

    const sortedEquippedItems = computed(() => {
      return equippedItems.value.slice().sort((a, b) => itemOrder[a.item_type] - itemOrder[b.item_type]);
    });

    const getItemClass = (itemType) => `item-${itemType}`;

    const isOwnProfile = computed(() => parseInt(userStore.id) === parseInt(userId.value));

    onMounted(fetchUserProfile);

    return {
      user,
      sendFriendRequest,
      getAvatarUrl,
      getImageUrl,
      sortedEquippedItems,
      getItemClass,
      isOwnProfile,
    };
  },
};

  </script>
  
  <style scoped>
  .profile-page {
    text-align: center;
    color: #fff;
    padding: 2em;
  }
  
  .avatar-wrapper {
    position: relative;
    width: 150px;
    height: 200px;
    margin: 0 auto 1em;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 1; /* Default z-index for the base avatar */
  }
  
  .equipped-item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  /* Layering for each item type */
  .item-back {
    z-index: 0; /* Back items behind the avatar */
  }
  
  .item-pants {
    z-index: 2; /* Closest to the avatar, above back items */
  }
  
  .item-shirt {
    z-index: 3; /* Above pants */
  }
  
  .item-hair {
    z-index: 4; /* Above shirt and pants */
  }
  
  .item-hat {
    z-index: 5; /* Above hair */
  }
  
  .item-package {
    z-index: 6; /* Above hat and hair */
  }
  
  .item-front {
    z-index: 7; /* In front of everything else */
  }
  
  button {
    background-color: #42b983;
    color: #fff;
    padding: 0.75em 2em;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 4px;
  }
  
  button:hover {
    background-color: #369870;
  }
  
  .loading {
    text-align: center;
    color: #fff;
  }
  </style>
  