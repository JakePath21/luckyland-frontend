<template>
    <div class="dashboard">
      <h2 class="dashboard-title">Welcome to your dashboard</h2>
  
      <div class="dashboard-container">
        <!-- Left Section: Player Info and Avatar -->
        <div class="left-section">
          <div class="avatar-wrapper">
            <img :src="getAvatarUrl()" alt="Base Avatar" class="avatar-image" />
            <img
              v-for="item in equippedItems"
              :key="item.id"
              :src="getImageUrl(item.image_url)"
              alt="Equipped Item"
              class="equipped-item-overlay"
            />
          </div>
  
          <div class="player-info">
            <h3 class="player-name">{{ userStore.username }}</h3>
            <p class="registration-date">Date Registered: {{ registrationDate || 'N/A' }}</p>
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
            <div v-for="item in ownedItems" :key="item.id" class="inventory-item">
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
          <div class="friend" v-for="n in 8" :key="n">Friends</div>
        </div>
        <p class="see-all">See All →</p>
      </div>
    </div>
  </template>
  
  <script>
  import { userStore } from '../store/user';
  import axios from 'axios';
  import { onMounted, ref } from 'vue';
  
  export default {
    setup() {
      const ownedItems = ref([]);
      const equippedItems = ref([]);
      const registrationDate = ref('');
      const stats = ref({
        betsPlaced: null,
        goldWagered: null,
        totalWon: null,
        totalLost: null,
        favoriteGame: null,
      });
  
      const fetchOwnedItems = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/catalog/owned/${userStore.id}`);
          ownedItems.value = response.data;
          equippedItems.value = response.data.filter((item) => item.equipped);
        } catch (error) {
          console.error('Failed to fetch owned items:', error);
        }
      };
  
      const getAvatarUrl = () => '/src/assets/baseAvatarSpaced.png';
      const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/default-item.png');
  
      onMounted(() => {
        fetchOwnedItems();
      });
  
      return { userStore, ownedItems, equippedItems, registrationDate, stats, getAvatarUrl, getImageUrl };
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
  
  .avatar-wrapper {
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
  }
  
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
    gap: 1em;
    justify-content: center;
  }
  
  .friend {
    background: #444;
    padding: 1em;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .see-all {
    color: #42b983;
    cursor: pointer;
    margin-top: 1em;
  }
  </style>
  