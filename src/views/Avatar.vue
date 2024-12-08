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
            <div v-for="item in ownedItems" :key="item.id" class="item-card">
                <img :src="getImageUrl(item.image_url)" alt="Item Image" class="item-image" />
                <!-- <h4>{{ item.name }} (ID: {{ item.item_id }})</h4> -->
                 <h4> {{ item.name }}</h4>
                <button v-if="item.equipped" @click="unequipItem(item.item_id)">Unequip</button>
                <button v-else @click="equipItem(item.item_id)">Equip</button>
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
                console.log('Owned items:', response.data); // Debugging line
                ownedItems.value = response.data;
                equippedItems.value = response.data.filter((item) => item.equipped);
            } catch (error) {
                console.error('Failed to fetch owned items:', error);
                message.value = 'Failed to load owned items.';
            }
        };

  
      // Equip Item
      const equipItem = async (itemId) => {
        try {
          console.log('Equipping item with item ID:', itemId); // Debug log
          await axios.post('http://localhost:5000/api/catalog/equip', {
            userId: userStore.id,
            itemId: itemId,
          });
          message.value = 'Item equipped successfully!';
          fetchOwnedItems(); // Refresh the list after equipping
        } catch (error) {
          console.error('Failed to equip item:', error);
          message.value = 'Failed to equip item.';
        }
      };
  
      // Unequip Item
      const unequipItem = async (itemId) => {
        try {
          console.log('Unequipping item with item ID:', itemId); // Debug log
          await axios.post('http://localhost:5000/api/catalog/unequip', {
            userId: userStore.id,
            itemId: itemId,
          });
          message.value = 'Item unequipped successfully!';
          fetchOwnedItems(); // Refresh the list after unequipping
        } catch (error) {
          console.error('Failed to unequip item:', error);
          message.value = 'Failed to unequip item.';
        }
      };
  
      // Get Base Avatar URL
      const getAvatarUrl = () => {
        return '/src/assets/baseAvatarSpaced.png';
      };
  
      // Get Full Image URL
      const getImageUrl = (imageUrl) => {
        return imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/baseAvatarSpaced.png';
      };
  
      onMounted(() => {
        fetchOwnedItems();
      });
  
      return {
        ownedItems,
        equippedItems,
        message,
        equipItem,
        unequipItem,
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
  