<template>
    <div class="avatar-page">
      <h2>Your Avatar</h2>
  
      <div class="avatar-container">
        <!-- Display the Player's Current Avatar with Equipped Items -->
        <div class="current-avatar">
          <div class="avatar-wrapper">
            <img :src="getAvatarUrl()" alt="Base Avatar" class="avatar-image" />
            <img
              v-for="item in equippedItems"
              :key="item.item_id"
              :src="getImageUrl(item.image_url)"
              alt="Equipped Item"
              class="equipped-item-overlay"
            />
          </div>
        </div>
  
        <!-- Display Owned Items with Equip/Unequip Buttons -->
        <div class="owned-items">
          <h3>Your Owned Items</h3>
          <div v-if="ownedItems.length === 0" class="no-items">
            You don't own any items yet.
          </div>
          <div v-else class="items-grid">
            <div v-for="item in ownedItems" :key="item.item_id" class="item-card">
              <img :src="getImageUrl(item.image_url)" alt="Item Image" class="item-image" />
              <h4>{{ item.name }}</h4>
              <button v-if="isItemEquipped(item.item_id)" @click="toggleEquipItem(item)">Unequip</button>
              <button v-else @click="toggleEquipItem(item)">Equip</button>
            </div>
          </div>
          <p v-if="message">{{ message }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { userStore } from '../store/user';
  import { onMounted, ref } from 'vue';
  
  export default {
    setup() {
      const ownedItems = ref([]);
      const equippedItems = ref([]);
      const message = ref('');
  
      // Fetch Owned Items
      const fetchOwnedItems = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/catalog/owned/${userStore.id}`);
          ownedItems.value = response.data;
        } catch (error) {
          console.error('Failed to fetch owned items:', error);
          message.value = 'Failed to load owned items.';
        }
      };
  
      // Fetch Equipped Items
      const fetchEquippedItems = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/catalog/equipped/${userStore.id}`);
          equippedItems.value = response.data;
        } catch (error) {
          console.error('Failed to fetch equipped items:', error);
          message.value = 'Failed to load equipped items.';
        }
      };
  
      // Check if an item is equipped
      const isItemEquipped = (itemId) => {
        return equippedItems.value.some((item) => item.item_id === itemId);
      };
  
      // Toggle Equip/Unequip Item
      const toggleEquipItem = async (item) => {
        try {
          if (isItemEquipped(item.item_id)) {
            // Unequip Item
            await axios.post('http://localhost:5000/api/catalog/unequip', {
              userId: userStore.id,
              itemId: item.item_id,
            });
            message.value = 'Item unequipped successfully!';
          } else {
            // Equip Item
            await axios.post('http://localhost:5000/api/catalog/equip', {
              userId: userStore.id,
              itemId: item.item_id,
            });
            message.value = 'Item equipped successfully!';
          }
  
          // Refresh owned and equipped items
          await fetchOwnedItems();
          await fetchEquippedItems();
        } catch (error) {
          console.error('Failed to toggle equip/unequip item:', error);
          message.value = 'Failed to change item status.';
        }
      };
  
      // Get Base Avatar URL
      const getAvatarUrl = () => '/src/assets/baseAvatarSpaced.png';
  
      // Get Full Image URL
      const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/default-item.png');
  
      onMounted(() => {
        fetchOwnedItems();
        fetchEquippedItems();
      });
  
      return {
        ownedItems,
        equippedItems,
        message,
        toggleEquipItem,
        isItemEquipped,
        getAvatarUrl,
        getImageUrl,
      };
    },
  };
  </script>
  
  <style scoped>
  .avatar-page {
    padding: 2em;
    color: #fff;
  }
  
  .avatar-container {
    display: flex;
    gap: 2em;
    justify-content: center;
  }
  
  /* Avatar display section */
  .current-avatar {
    flex: 1;
    text-align: center;
  }
  
  .avatar-wrapper {
    position: relative;
    width: 300px;
    height: 400px;
    margin: 0 auto;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border: 2px solid #42b983;
    border-radius: 8px;
  }
  
  .equipped-item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }
  
  /* Owned items section */
  .owned-items {
    flex: 2;
  }
  
  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1em;
  }
  
  .item-card {
    background-color: #444;
    padding: 1em;
    border-radius: 8px;
    text-align: center;
  }
  
  .item-image {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-bottom: 0.5em;
  }
  
  button {
    background-color: #42b983;
    color: #fff;
    padding: 0.5em;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
  }
  
  button:hover {
    background-color: #369870;
  }
  
  .no-items {
    color: #ff4f4f;
    font-weight: bold;
    text-align: center;
  }
  </style>
  