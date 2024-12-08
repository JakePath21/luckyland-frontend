<template>
    <div>
      <h2>Catalog</h2>
      <div v-for="item in items" :key="item.id">
        <p>{{ item.name }} - {{ item.price_currency1 }} Coins</p>
        <img :src="item.image_url" alt="Item Image" />
        <button @click="buyItem(item.id)">Buy</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        items: []
      };
    },
    async created() {
      const response = await axios.get('http://localhost:5000/api/catalog/items');
      this.items = response.data;
    },
    methods: {
      buyItem(id) {
        alert(`Buying item with ID: ${id}`);
      }
    }
  };
  </script>
  