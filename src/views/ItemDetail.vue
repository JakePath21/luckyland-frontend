<template>
    <div class="item-detail" v-if="item">
      <div class="item-card">
        <div class="item-image-container">
          <img :src="getImageUrl(item.image_url)" alt="Item Image" class="item-image" />
        </div>
        <div class="item-info">
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <h3 class="price">Price: {{ item.cost }} {{ item.currency_type }}</h3>
          <button @click="buyItem" class="buy-button">Buy</button>
        </div>
      </div>
    </div>
    <div v-else class="loading">Loading...</div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  
  export default {
    props: ['itemId'],
    setup(props) {
      const item = ref(null);
  
      const fetchItem = async () => {
            try {
                console.log(`Fetching item with ID: ${props.itemId}`);
                const response = await axios.get(`http://localhost:5000/api/catalog/items/${props.itemId}`);
                console.log('Item fetched successfully:', response.data);
                item.value = response.data;
            } catch (error) {
                console.error('Failed to fetch item:', error);
            }
        };



  
      const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/default-item.png');
  
      const buyItem = async () => {
        try {
          await axios.post('http://localhost:5000/api/catalog/buy', {
            userId: 1, // Replace with the actual user ID or fetch from the userStore
            itemId: props.itemId,
          });
          alert('Item purchased successfully!');
        } catch (error) {
          console.error('Failed to buy item:', error);
        }
      };
  
      onMounted(() => {
        fetchItem();
      });
  
      return { item, getImageUrl, buyItem };
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
  }
  
  .item-card {
    background: #333;
    padding: 2em;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 2em;
  }
  
  .item-image-container {
    width: 200px;
    height: 300px;
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
  
  .item-image {
    max-width: 100%;
    max-height: 100%;
  }
  
  .item-info {
    text-align: left;
  }
  
  .price {
    font-size: 1.5em;
    margin: 1em 0;
  }
  
  .buy-button {
    background: #008000;
    color: #fff;
    padding: 0.7em 1.5em;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-size: 1em;
  }
  
  .buy-button:hover {
    background: #006400;
  }
  
  .loading {
    text-align: center;
    font-size: 1.5em;
  }
  </style>
  