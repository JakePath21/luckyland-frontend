<template>
    <div class="friends-page">
      <h2>Your Friends</h2>
      <div class="tab-buttons">
            <button @click="currentTab = 'friends'">Friends</button>
            <button @click="currentTab = 'requests'">Pending Requests</button>
            <button @click="goToAllUsers" class="view-all-users-btn">View All Users</button>
        </div>

  
      <!-- Friends List -->
      <div v-if="currentTab === 'friends'" class="friends-list">
        <div
          v-for="friend in friends"
          :key="friend.id"
          class="friend-card"
          @click="goToProfile(friend.id)"
        >
          <div class="avatar-wrapper">
            <img :src="getAvatarUrl(friend.avatar)" alt="Base Avatar" class="avatar-image" />
            <img
              v-for="item in getSortedEquippedItems(friend.equipped_items)"
              :key="item.item_id"
              :src="getImageUrl(item.image_url)"
              alt="Equipped Item"
              class="equipped-item-overlay"
              :class="getItemClass(item.item_type)"
            />
          </div>
          <h3>{{ friend.username }}</h3>
        </div>
      </div>
  
      <!-- Friend Requests -->
      <div v-if="currentTab === 'requests'" class="friend-requests">
        <div
          v-for="request in friendRequests"
          :key="request.id"
          class="friend-card"
          @click="goToProfile(request.sender_id)"
        >
          <div class="avatar-wrapper">
            <img :src="getAvatarUrl(request.avatar)" alt="Base Avatar" class="avatar-image" />
            <img
              v-for="item in getSortedEquippedItems(request.equipped_items)"
              :key="item.item_id"
              :src="getImageUrl(item.image_url)"
              alt="Equipped Item"
              class="equipped-item-overlay"
              :class="getItemClass(item.item_type)"
            />
          </div>
          <h3>{{ request.username }}</h3>
          <div class="request-actions">
                <button class="accept-button" @click.stop="acceptRequest(request.id, request.sender_id)">Accept</button>
                <button class="decline-button" @click.stop="declineRequest(request.id)">Decline</button>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { userStore } from '../store/user';
  
  export default {
    setup() {
      const friends = ref([]);
      const friendRequests = ref([]);
      const currentTab = ref('friends');
      const router = useRouter();
  
      // Fetch Friends
      const fetchFriends = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/friends/${userStore.id}/friends`);
                friends.value = response.data;

                // Fetch equipped items for each friend
                for (let friend of friends.value) {
                friend.equipped_items = await fetchEquippedItems(friend.id);
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

  
      // Fetch Friend Requests
      const fetchFriendRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/friends/${userStore.id}/requests`);
                friendRequests.value = response.data;

                // Fetch equipped items for each request
                for (let request of friendRequests.value) {
                request.equipped_items = await fetchEquippedItems(request.sender_id);
                }
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        const goToAllUsers = () => {
        router.push('/users');
        };


  
      // Accept Friend Request
      const acceptRequest = async (requestId, senderId) => {
        try {
          await axios.post('http://localhost:5000/api/friends/accept', {
            requestId,
            senderId,
            receiverId: userStore.id,
          });
          fetchFriends();
          fetchFriendRequests();
        } catch (error) {
          console.error('Error accepting friend request:', error);
        }
      };
  
      const fetchEquippedItems = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/catalog/equipped/${userId}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching equipped items for user ${userId}:`, error);
                return [];
            }
        };


      // Decline Friend Request
      const declineRequest = async (requestId) => {
        try {
          await axios.post('http://localhost:5000/api/friends/decline', { requestId });
          fetchFriendRequests();
        } catch (error) {
          console.error('Error declining friend request:', error);
        }
      };
  
      // Navigate to User Profile
      const goToProfile = (userId) => {
        router.push(`/users/${userId}`);
      };
  
      // Get Avatar URL
      const getAvatarUrl = (avatar) => (avatar ? `/avatars/${avatar}` : '/src/assets/baseAvatarSpaced.png');
  
      // Get Image URL
      const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/default-item.png');
  
      // Sort equipped items based on item type order
      const itemOrder = {
        back: 1,
        pants: 2,
        shirt: 3,
        hair: 4,
        hat: 5,
        package: 6,
        front: 7,
      };
  
      const getSortedEquippedItems = (equippedItems) => {
            return Array.isArray(equippedItems)
                ? equippedItems.slice().sort((a, b) => itemOrder[a.item_type] - itemOrder[b.item_type])
                : [];
        };


        console.log('Friends Data:', friends.value);
        console.log('Friend Requests Data:', friendRequests.value);

  
      // Get CSS class for item type
      const getItemClass = (itemType) => `item-${itemType}`;
  
      onMounted(() => {
        fetchFriends();
        fetchFriendRequests();
      });
  
      return {
        friends,
        friendRequests,
        currentTab,
        acceptRequest,
        declineRequest,
        goToProfile,
        goToAllUsers,
        getAvatarUrl,
        getImageUrl,
        getSortedEquippedItems,
        getItemClass,
      };
    },
  };
  </script>
  
  
  
  <style scoped>
  .friends-page {
    color: #fff;
    padding: 2em;
    text-align: center;
  }
  
  .tab-buttons {
    margin-bottom: 1em;
  }
  
/* View All Users button */
.tab-buttons button {
  background-color: #42b983; /* Default green for other buttons */
  color: #fff;
  padding: 0.75em 2em;
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
  margin: 0 0.5em;
}

/* Specific style for the "View All Users" button */
.tab-buttons button.view-all-users-btn {
  background-color: #007bff; /* Default blue color */
}

.tab-buttons button.view-all-users-btn:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

  
  .friends-list,
  .friend-requests {
    display: flex;
    flex-wrap: wrap;
    gap: 2em;
    justify-content: center;
  }
  
  .friend-card {
    background-color: #333;
    padding: 1em;
    border-radius: 8px;
    text-align: center;
    width: 200px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    cursor: pointer; /* Make the card clickable */
    transition: background-color 0.2s;
  }
  
  .friend-card:hover {
    background-color: #444;
  }
  
  .avatar-wrapper {
    position: relative;
    width: 100px;
    height: 130px;
    margin: 0 auto 1em;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 1;
  }
  
  .equipped-item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .view-all-users {
  margin-top: 1em;
}

.view-all-users button {
  background-color: #007bff;
  color: #fff;
  padding: 0.75em 2em;
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
}

.view-all-users button:hover {
  background-color: #0056b3;
}


  /* Layering for each item type */
  .item-back {
    z-index: 0;
  }
  
  .item-pants {
    z-index: 2;
  }
  
  .item-shirt {
    z-index: 3;
  }
  
  .item-hair {
    z-index: 4;
  }
  
  .item-hat {
    z-index: 5;
  }
  
  .item-package {
    z-index: 6;
  }
  
  .item-front {
    z-index: 7;
  }
  
  .view-all-button {
  background-color: #007bff; /* Blue color */
  color: #fff;
  padding: 0.75em 2em;
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
  }

    .view-all-button:hover {
    background-color: #0056b3; /* Darker blue on hover */
    }


  button {
    background-color: #42b983;
    color: #fff;
    padding: 0.5em 1em;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 0.5em;
  }
  
  button:hover {
    background-color: #369870;
  }

  .request-actions {
  display: flex;
  justify-content: center;
  gap: 1em; /* Add space between the buttons */
  margin-top: 0.5em;
}

.accept-button {
  background-color: #28a745; /* Green color */
  color: #fff;
  padding: 0.5em 1em;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.accept-button:hover {
  background-color: #218838; /* Darker green on hover */
}

.decline-button {
  background-color: #dc3545; /* Red color */
  color: #fff;
  padding: 0.5em 1em;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.decline-button:hover {
  background-color: #c82333; /* Darker red on hover */
}

  </style>
  