<template>
    <div class="item-detail" v-if="item">
      <div class="item-card">
        <div class="item-image-container">
          <img :src="getImageUrl(item.image_url)" alt="Item Image" class="item-image" />
        </div>
        <div class="item-info">
          <h2>{{ item.name }}</h2>
          <p class="item-type">Type: {{ item.item_type }}</p>
          <p class="description">{{ item.description }}</p>
          <div class="details-row">
            <h3 class="price">Price: {{ item.cost }} {{ item.currency_type }}</h3>
            <div class="action-button">
              <div v-if="item.owned" class="owned-text">Owned</div>
              <button v-else @click="openConfirmPopup" class="buy-button">Buy</button>
            </div>
          </div>
  
        <!-- Admin Actions -->
        <div v-if="rank === 1" class="admin-actions">
          <button @click="goToEditPage" class="edit-button">Edit</button>
          <button @click="deleteItem" class="delete-button">Delete</button>
        </div>
      </div>
    </div>
  
      <!-- Confirmation Popup -->
      <div v-if="showPopup" class="popup-overlay">
        <div class="popup-content">
          <h3>Confirm Purchase</h3>
          <p>Are you sure you want to buy <strong>{{ item.name }}</strong> for {{ item.cost }} {{ item.currency_type }}?</p>
          <div class="popup-actions">
            <button @click="confirmPurchase">Confirm</button>
            <button class="cancel-button" @click="closePopup">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading">Loading...</div>
  </template>
  
  <script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { userStore } from '../store/user';
import { useRouter } from 'vue-router';

export default {
  props: ['itemId'],
  setup(props) {
    const item = ref(null);
    const showPopup = ref(false);
    const rank = ref(0); // Add rank state
    const router = useRouter();

    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/catalog/items/${props.itemId}`);
        const ownedResponse = await axios.get(`http://localhost:5000/api/catalog/owned/${userStore.id}`);
        const ownedItemIds = ownedResponse.data.map((ownedItem) => ownedItem.item_id);

        item.value = { ...response.data, owned: ownedItemIds.includes(response.data.id) };
      } catch (error) {
        console.error('Failed to fetch item:', error);
      }
    };

    // Fetch the user's rank
    const fetchRank = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/rank/${encodeURIComponent(userStore.username)}`);
        rank.value = response.data.rank;
      } catch (error) {
        console.error('Failed to fetch rank:', error);
      }
    };

    const openConfirmPopup = () => {
      showPopup.value = true;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    const confirmPurchase = async () => {
      try {
        await axios.post('http://localhost:5000/api/catalog/buy', {
          userId: userStore.id,
          itemId: props.itemId,
        });
        item.value.owned = true;
        closePopup();
        alert('Item purchased successfully!');
      } catch (error) {
        console.error('Failed to buy item:', error);
      }
    };

    const goToEditPage = () => {
      router.push(`/catalog/edit/${props.itemId}`);
    };

    const deleteItem = async () => {
      if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

      try {
        await axios.delete(`http://localhost:5000/api/catalog/delete/${props.itemId}`);
        alert('Item deleted successfully.');
        router.push('/catalog');
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item.');
      }
    };

    const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/default-item.png');

    onMounted(() => {
      fetchItem();
      fetchRank(); // Fetch rank when component mounts
    });

    return {
      item,
      getImageUrl,
      showPopup,
      openConfirmPopup,
      closePopup,
      confirmPurchase,
      goToEditPage,
      deleteItem,
      rank, // Return rank
    };
  },
};
  </script>
  
  <style scoped>
  .item-detail {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: #fff;
    padding: 2em;
  }
  
  .item-card {
    background: #333;
    padding: 3em;
    border-radius: 16px;
    display: flex;
    gap: 3em;
    width: 80%;
    max-width: 1000px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  }
  
  .item-image-container {
    width: 300px;
    height: 400px;
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }
  
  .item-image {
    max-width: 100%;
    max-height: 100%;
  }
  
  .item-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }
  
  .item-info h2 {
    font-size: 2em;
    margin-bottom: 0.5em;
  }
  
  .description {
    font-size: 1.2em;
    margin-bottom: 2em;
    line-height: 1.5;
  }
  
  .details-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .price {
    font-size: 1.5em;
    font-weight: bold;
  }
  
  .action-button {
    display: flex;
    align-items: center;
  }
  
  .buy-button {
    background: #008000;
    color: #fff;
    padding: 0.7em 2em;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-size: 1em;
  }
  
  .buy-button:hover {
    background: #006400;
  }
  
  .owned-text {
    color: #42b983;
    font-weight: bold;
    font-size: 1.5em;
  }
  
  .loading {
    text-align: center;
    font-size: 1.5em;
  }
  
 /* Admin Actions */
.admin-actions {
  position: absolute;
  top: 1em;
  left: 1em;
  display: flex;
  gap: 1em;
  z-index: 10;
}

.edit-button,
.delete-button {
  background-color: #ffa500;
  color: #fff;
  padding: 0.5em 1em;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1em;
}

.delete-button {
  background-color: #ff4f4f;
}

.edit-button:hover {
  background-color: #e69500;
}

.delete-button:hover {
  background-color: #e03c3c;
}

/* Ensure the item-card has position relative */
.item-card {
  position: relative;
  background: #333;
  padding: 3em;
  border-radius: 16px;
  display: flex;
  gap: 3em;
  width: 80%;
  max-width: 1000px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
}

  
  /* Popup Styles */
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
  
  .popup-actions {
    margin-top: 1em;
    display: flex;
    justify-content: center;
    gap: 1em;
  }
  
  .cancel-button {
    background-color: #ff4f4f;
  }

  .item-type {
  font-size: 0.9em;
  color: #bbb;
  margin-bottom: 1em;
}
  
  .cancel-button:hover {
    background-color: #e03c3c;
  }
  </style>
  