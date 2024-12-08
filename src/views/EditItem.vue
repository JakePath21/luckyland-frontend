<template>
    <div class="edit-item-container" v-if="item">
      <h2>Edit Item</h2>
      <form @submit.prevent="updateItem" class="edit-item-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="item.name" required />
        </div>
  
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="item.description" required></textarea>
        </div>
  
        <div class="form-group">
          <label for="cost">Cost:</label>
          <input type="number" id="cost" v-model="item.cost" required min="0" />
        </div>
  
        <div class="form-group">
          <label for="currencyType">Currency Type:</label>
          <select id="currencyType" v-model="item.currency_type" required>
            <option value="gold">Gold</option>
            <option value="tickets">Tickets</option>
          </select>
        </div>
  
        <div class="form-actions">
          <button type="submit" class="update-button">Update Item</button>
          <button type="button" class="cancel-button" @click="cancelEdit">Cancel</button>
        </div>
  
        <p v-if="message" class="message">{{ message }}</p>
      </form>
    </div>
    <div v-else class="loading">Loading...</div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  export default {
    setup() {
      const item = ref(null);
      const message = ref('');
      const router = useRouter();
      const route = useRoute();
      const itemId = route.params.itemId;
  
      // Fetch item details
      const fetchItem = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/catalog/items/${itemId}`);
          item.value = response.data;
        } catch (error) {
          console.error('Failed to fetch item:', error);
          message.value = 'Failed to load item details.';
        }
      };
  
      // Update item details
      const updateItem = async () => {
        try {
          await axios.put(`http://localhost:5000/api/catalog/update/${itemId}`, {
            name: item.value.name,
            description: item.value.description,
            cost: item.value.cost,
            currency_type: item.value.currency_type,
          });
          message.value = 'Item updated successfully!';
          setTimeout(() => {
            router.push(`/catalog/${itemId}`);
          }, 1000);
        } catch (error) {
          console.error('Failed to update item:', error);
          message.value = 'Failed to update item.';
        }
      };
  
      // Cancel and return to the item detail page
      const cancelEdit = () => {
        router.push(`/catalog/${itemId}`);
      };
  
      onMounted(() => {
        fetchItem();
      });
  
      return {
        item,
        message,
        updateItem,
        cancelEdit,
      };
    },
  };
  </script>
  
  <style scoped>
  .edit-item-container {
    max-width: 600px;
    margin: 2em auto;
    padding: 2em;
    background: #333;
    color: #fff;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1em;
  }
  
  .form-group {
    margin-bottom: 1.5em;
  }
  
  label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="number"],
  textarea,
  select {
    width: 100%;
    padding: 0.75em;
    background: #444;
    color: #fff;
    border: 1px solid #555;
    border-radius: 6px;
    font-size: 1em;
  }
  
  textarea {
    resize: vertical;
    height: 100px;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .update-button,
  .cancel-button {
    background-color: #42b983;
    color: #fff;
    padding: 0.75em 2em;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    font-weight: bold;
    font-size: 1em;
  }
  
  .cancel-button {
    background-color: #ff4f4f;
  }
  
  .update-button:hover {
    background-color: #369870;
  }
  
  .cancel-button:hover {
    background-color: #e03c3c;
  }
  
  .message {
    text-align: center;
    margin-top: 1em;
    color: #42b983;
    font-weight: bold;
  }
  
  .loading {
    text-align: center;
    font-size: 1.5em;
    color: #fff;
  }
  </style>
  