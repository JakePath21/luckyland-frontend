<!-- src/views/Catalog.vue -->
<template>
    <div class="catalog-container">
      <h2>Catalog</h2>
      <div class="items-grid">
        <div v-for="item in items" :key="item.id" class="item-card">
          <img :src="item.image_url" alt="Item Image" />
          <h3>{{ item.name }}</h3>
          <p>Price: {{ item.price_currency1 }} Coins</p>
          <button @click="buyItem(item.id)">Buy</button>
        </div>
      </div>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        items: [],
        message: ''
      };
    },
    async created() {
      try {
        const response = await axios.get('http://localhost:5000/api/catalog/items');
        this.items = response.data;
      } catch (error) {
        this.message = 'Failed to load items.';
      }
    },
    methods: {
      async buyItem(itemId) {
        try {
          await axios.post('http://localhost:5000/api/catalog/buy', { itemId });
          this.message = 'Item purchased successfully!';
        } catch (error) {
          this.message = 'Failed to purchase item.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .catalog-container {
    padding: 2em;
    color: #fff;
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
  }
  
  .item-card img {
    max-width: 100%;
    height: auto;
    margin-bottom: 1em;
  }
  
  button {
    background-color: #42b983;
    color: #fff;
    padding: 0.5em;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #369870;
  }
  </style>
  