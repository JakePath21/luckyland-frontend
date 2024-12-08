<template>
    <div class="catalog-container">
      <h2>Catalog</h2>
  
      <!-- Admin Actions -->
      <div v-if="rank === 1" class="admin-actions">
        <router-link to="/create-item">
          <button class="create-item-button">Create Item</button>
        </router-link>
      </div>
  
      <!-- Items Grid -->
      <div class="items-grid">
        <div
            v-for="item in items"
            :key="item.id"
            class="item-card"
            @click="viewItemDetails(item.id)"
        >
            <div class="mannequin-container">
            <img src="../assets/mannequin.png" alt="Mannequin" class="mannequin" />
            <img :src="getImageUrl(item.image_url)" alt="Item Image" class="item-overlay" />
            </div>
            <h3>{{ item.name }}</h3>
            <p>{{ getPriceText(item) }}</p>
            <div v-if="item.owned" class="owned-text">Owned</div>
            <button v-else @click.stop="openConfirmPopup(item)">Buy</button>
        </div>
        </div>

  
      <p v-if="message">{{ message }}</p>
  
      <!-- Confirmation Popup -->
      <div v-if="showPopup" class="popup-overlay">
        <div class="popup-content">
          <h3>Confirm Purchase</h3>
          <p>Are you sure you want to buy <strong>{{ selectedItem.name }}</strong> for {{ getPriceText(selectedItem) }}?</p>
          <div class="popup-actions">
            <button @click="confirmPurchase">Confirm</button>
            <button class="cancel-button" @click="closePopup">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { userStore } from '../store/user';
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const items = ref([]);
      const message = ref('');
      const rank = ref(0);
      const showPopup = ref(false);
      const selectedItem = ref(null);
      const router = useRouter();
  
      const fetchItems = async () => {
            try {
                // Fetch all items
                const response = await axios.get('http://localhost:5000/api/catalog/items');
                console.log('All items fetched:', response.data); // Debugging log
                const allItems = response.data;

                // Fetch the user's owned items
                const ownedResponse = await axios.get(`http://localhost:5000/api/catalog/owned/${userStore.id}`);
                console.log('Owned items fetched:', ownedResponse.data); // Debugging log
                const ownedItemIds = ownedResponse.data.map((item) => item.item_id);

                // Set the 'owned' property for each item
                items.value = allItems.map((item) => ({
                ...item,
                owned: ownedItemIds.includes(item.id),
                }));
                console.log('Items with ownership status:', items.value); // Debugging log
            } catch (error) {
                message.value = 'Failed to load items.';
                console.error('Fetch items error:', error);
            }
        };



  
      // Fetch user's rank
      const fetchRank = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/rank/${encodeURIComponent(userStore.username)}`);
          rank.value = response.data.rank;
        } catch (error) {
          console.error('Failed to fetch rank:', error);
        }
      };
  
      // Navigate to item detail page
      const viewItemDetails = (itemId) => {
            console.log('Navigating to item details with ID:', itemId); // Debugging log
            router.push(`/catalog/${itemId}`);
        };

  
      // Open confirmation popup
      const openConfirmPopup = (item) => {
        selectedItem.value = item;
        showPopup.value = true;
      };
  
      // Close confirmation popup
      const closePopup = () => {
        showPopup.value = false;
        selectedItem.value = null;
      };
  
      // Confirm purchase
      const confirmPurchase = async () => {
        try {
          await axios.post('http://localhost:5000/api/catalog/buy', {
            userId: userStore.id,
            itemId: selectedItem.value.id,
          });
  
          message.value = 'Item purchased successfully!';
  
          // Fetch updated user balance
          const response = await axios.get(`http://localhost:5000/api/auth/user/${encodeURIComponent(userStore.username)}`);
          userStore.setGold(response.data.gold);
          userStore.setTickets(response.data.tickets);
        } catch (error) {
          message.value = error.response?.data?.message || 'Failed to purchase item.';
          console.error('Purchase error:', error);
        } finally {
          closePopup();
        }
      };
  
      // Get formatted price text
      const getPriceText = (item) => {
        return item.currency_type === 'gold' ? `Price: ${item.cost} Gold` : `Price: ${item.cost} Tickets`;
      };
  
      // Get full image URL
      const getImageUrl = (imageUrl) => {
            console.log('Image URL:', imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/default-item.png'); // Debugging log
            return imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/default-item.png';
        };

      onMounted(() => {
        fetchItems();
        if (userStore.username) {
          fetchRank();
        }
      });
  
      return {
        items,
        message,
        rank,
        showPopup,
        selectedItem,
        openConfirmPopup,
        closePopup,
        confirmPurchase,
        getPriceText,
        getImageUrl,
        viewItemDetails,
      };
    },
  };
  </script>
  
  <style scoped>
.catalog-container {
  padding: 2em;
  color: #fff;
}

.admin-actions {
  margin-bottom: 1em;
  text-align: center;
}

.create-item-button {
  background-color: #42b983;
  color: #fff;
  padding: 0.75em 2em;
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
}

.item-card {
  background-color: #444;
  padding: 1em;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.item-card:hover {
  transform: scale(1.05);
  background-color: #555;
}

.mannequin-container {
  position: relative;
  width: 100%;
  height: 250px;
  margin-bottom: 1em;
}

.mannequin {
  width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 250px;
}

.item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
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

p {
  text-align: center;
  margin-top: 1em;
  color: #ff4f4f;
}

/* Popup Overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Popup Content */
.popup-content {
  background: #333;
  padding: 2em;
  border-radius: 8px;
  color: #fff;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
}

/* Popup Actions Buttons */
.popup-actions {
  margin-top: 1em;
  display: flex;
  justify-content: center;
  gap: 1em;
}

.popup-actions button {
  padding: 0.5em 1em;
  font-weight: bold;
}

.cancel-button {
  background-color: #ff4f4f;
}

.owned-text {
  color: #42b983;
  font-weight: bold;
  margin-top: 0.5em;
}


.cancel-button:hover {
  background-color: #e03c3c;
}

  </style>
  