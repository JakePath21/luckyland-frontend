<template>
    <div class="dashboard">
      <h2 class="dashboard-title">Welcome to your dashboard</h2>
  
      <div class="dashboard-container">
        <!-- Left Section: Player Info and Avatar -->
        <div class="left-section">
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


  
          <div class="player-info">
            <h3 class="player-name">{{ userStore.username }}</h3>
            <p class="registration-date">Date Registered: {{ stats.registered_at || 'N/A' }}</p>
            <div class="currencies">
              <div class="currency gold">
                <img src="/src/assets/goldicon.png" alt="Gold" />
                <span>{{ userStore.gold }}</span>
              </div>
              <div class="currency tickets">
                <img src="/src/assets/ticketicon.png" alt="Tickets" />
                <span>{{ userStore.tickets }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Middle Section: Statistics -->
        <div class="middle-section">
          <h3 class="section-title">Statistics</h3>
          <div class="stats">
            <div class="stat-box">Bets Placed: {{ stats.betsPlaced || 'N/A' }}</div>
            <div class="stat-box total-won">Total Won: {{ stats.totalWon || 'N/A' }}</div>
            <div class="stat-box">Gold Wagered: {{ stats.goldWagered || 'N/A' }}</div>
            <div class="stat-box total-lost">Total Lost: {{ stats.totalLost || 'N/A' }}</div>
            <div class="stat-box">Favorite Game: {{ stats.favoriteGame || 'N/A' }}</div>
          </div>
        </div>
  
        <!-- Right Section: Inventory -->
        <div class="right-section">
          <h3 class="section-title">Your Inventory</h3>
          <div class="inventory-grid">
            <div v-for="item in ownedItems" :key="item.id" class="inventory-item" @click="viewItemDetails(item.id)">
              <div class="inventory-item-box">
                <img :src="getImageUrl(item.image_url)" alt="Item Image" class="inventory-item-image" />
                <p>{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Friends Section -->
      <div class="friends-section">
        <h3 class="section-title">Friends</h3>
        <div class="friends-list">
          <div class="friend" v-for="friend in friends" :key="friend.id" @click="goToProfile(friend.id)">
            <div class="friend-avatar-wrapper">
              <img :src="getAvatarUrl(friend.avatar)" alt="Friend Avatar" class="friend-avatar" />
              <img
                v-for="item in getSortedEquippedItems(friend.equipped_items)"
                :key="item.item_id"
                :src="getImageUrl(item.image_url)"
                alt="Equipped Item"
                class="friend-equipped-item-overlay"
                :class="getItemClass(item.item_type)"
              />
            </div>
            <p>{{ friend.username }}</p>
          </div>
        </div>
        <p class="see-all" @click="goToAllUsers">See All →</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { userStore } from '../store/user';
  import { useRouter } from 'vue-router';
  import { onMounted, ref, computed } from 'vue';
  
  export default {
  setup() {
    const ownedItems = ref([]);
    const equippedItems = ref([]);
    const registrationDate = ref('');
    const router = useRouter();
    const friends = ref([]);
    const stats = ref({
      betsPlaced: null,
      goldWagered: null,
      totalWon: null,
      totalLost: null,
      favoriteGame: null,
    });

    const fetchFriendsWithEquippedItems = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/friends/${userStore.id}/friends`);
          friends.value = await Promise.all(
            response.data.map(async (friend) => {
              const equippedResponse = await axios.get(`http://localhost:5000/api/catalog/equipped/${friend.id}`);
              return { ...friend, equipped_items: equippedResponse.data };
            })
          );
        } catch (error) {
          console.error('Failed to fetch friends with equipped items:', error);
        }
      };


    // Define the order of item types
    const itemOrder = {
      back: 1,
      pants: 2,
      shirt: 3,
      hair: 4,
      hat: 5,
      package: 6,
      front: 7,
    };

    // Fetch Owned Items
    const fetchOwnedItems = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/catalog/owned/${userStore.id}`);
          ownedItems.value = response.data.map((item) => ({
            ...item,
            id: item.id || item.item_id, // Ensure `id` is set correctly
          }));
        } catch (error) {
          console.error('Failed to fetch owned items:', error);
        }
      };


      const viewItemDetails = (itemId) => {
        if (itemId) {
          router.push(`/catalog/${itemId}`);
        } else {
          console.error('Invalid item ID:', itemId);
        }
      };

    // Fetch Equipped Items
    const fetchEquippedItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/catalog/equipped/${userStore.id}`);
        equippedItems.value = response.data;
      } catch (error) {
        console.error('Failed to fetch equipped items:', error);
      }
    };

    // Sort equipped items based on item type order
    const sortedEquippedItems = computed(() => {
      return equippedItems.value.slice().sort((a, b) => itemOrder[a.item_type] - itemOrder[b.item_type]);
    });

    // Method to return a dynamic class based on item type
    const getItemClass = (itemType) => {
      return `item-${itemType}`;
    };

    const goToAllUsers = () => {
      router.push('/friends');
    };

    const goToProfile = (friendId) => {
      router.push(`/users/${friendId}`);
    };

    const goToItemPage = (itemId) => {
      router.push(`/catalog/${itemId}`);
    };


    const getSortedEquippedItems = (equippedItems) => {
            return Array.isArray(equippedItems)
                ? equippedItems.slice().sort((a, b) => itemOrder[a.item_type] - itemOrder[b.item_type])
                : [];
        };

    const getAvatarUrl = () => '/src/assets/baseAvatarSpaced.png';
    const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/default-item.png');

    onMounted(() => {
      fetchOwnedItems();
      fetchEquippedItems();
      fetchFriendsWithEquippedItems();
    });

    return {
      userStore,
      ownedItems,
      equippedItems,
      sortedEquippedItems,
      registrationDate,
      getSortedEquippedItems,
      stats,
      getAvatarUrl,
      getImageUrl,
      goToAllUsers,
      friends,
      goToProfile,
      goToItemPage,
      viewItemDetails,
      getItemClass, // Ensure this is returned
    };
  },
};
  </script>
  
  <style scoped>
  .dashboard {
    color: #fff;
    padding: 2em;
  }
  
  .dashboard-title {
    text-align: center;
    font-size: 2em;
    margin-bottom: 1.5em;
  }
  
  .dashboard-container {
    display: flex;
    justify-content: space-between;
    gap: 2em;
  }
  
  /* Left Section */
  .left-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  
  /* .avatar-wrapper {
    position: relative;
    width: 150px;
    height: 200px;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .equipped-item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  } */

  .avatar-wrapper {
  position: relative;
  width: 150px;
  height: 200px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1; /* Default z-index for the base avatar */
}

/* Equipped items */
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

  
  /* Player Info */
  .player-info {
    text-align: left;
    margin-top: 1em;
  }
  
  .player-name {
    font-size: 1.2em;
    margin-bottom: 0.3em;
  }
  
  .registration-date {
    font-size: 0.9em;
    color: #aaa;
    margin-bottom: 0.5em;
  }
  
  .currencies {
    display: flex;
    gap: 1em;
    font-size: 1.2em;
  }
  
  /* Middle Section */
  .middle-section {
    flex: 2;
    text-align: center;
  }
  
  .stats {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    max-width: 250px;
    margin: 0 auto;
  }
  
  .stat-box {
    background: #444;
    padding: 0.5em;
    border-radius: 8px;
    text-align: center;
  }
  
  .total-won {
    background: #2a8f2a;
  }
  
  .total-lost {
    background: #a52a2a;
  }
  
  /* Right Section */
  .right-section {
    flex: 1;
    text-align: center;
  }
  
  .inventory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1em;
  }
  
  .inventory-item-box {
    background: #333;
    padding: 1em;
    border-radius: 8px;
    text-align: center;
    width: 100px;
    height: 120px;
  }
  
  .inventory-item-image {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
  
  /* Friends Section */
  .friends-section {
    margin-top: 2em;
    text-align: center;
  }
  
  .friends-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: center;
}

.friend {
  background: #444;
  padding: 0.5em;
  border-radius: 8px;
  width: 80px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
}

.friend,
.inventory-item {
  transition: transform 0.2s, background-color 0.2s;
  cursor: pointer;
}

.friend:hover,
.inventory-item:hover {
  transform: scale(1.05);
  background-color: #555;
}


.friend-avatar-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 0.5em;
}

.friend-avatar {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Changed from 'cover' to 'contain' */
  position: relative;
  z-index: 1;
}

.friend-equipped-item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}


.see-all {
  color: #007bff;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1em;
}

.see-all:hover {
  text-decoration: underline;
}

  </style>
  