<template>
    <div class="create-item">
      <h2>Create New Catalog Item</h2>
      <form @submit.prevent="createItem">
        <div class="form-group">
          <label for="name">Item Name</label>
          <input type="text" v-model="name" id="name" required />
        </div>
  
        <div class="form-group">
          <label for="description">Description</label>
          <textarea v-model="description" id="description" required></textarea>
        </div>
  
        <div class="form-group">
          <label for="cost">Cost</label>
          <input type="number" v-model="cost" id="cost" min="0" required />
        </div>
  
        <div class="form-group">
          <label for="currencyType">Currency Type</label>
          <select v-model="currencyType" id="currencyType" required>
            <option value="gold">Gold</option>
            <option value="tickets">Tickets</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="image">Item Image</label>
          <input type="file" @change="handleImageUpload" id="image" accept="image/*" />
        </div>
  
        <button type="submit">Create Item</button>
  
        <p v-if="message" :class="{ error: isError, success: !isError }">{{ message }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        description: '',
        cost: 0,
        currencyType: 'gold',
        image: null,
        message: '',
        isError: false,
      };
    },
    methods: {
      handleImageUpload(event) {
        this.image = event.target.files[0];
      },
      async createItem() {
        try {
          if (!this.image) {
            this.message = 'Please upload an image.';
            this.isError = true;
            return;
          }
  
          const formData = new FormData();
          formData.append('name', this.name);
          formData.append('description', this.description);
          formData.append('cost', this.cost);
          formData.append('currencyType', this.currencyType);
          formData.append('image', this.image);
  
          await axios.post('http://localhost:5000/api/catalog/create', formData);
  
          this.message = 'Item created successfully!';
          this.isError = false;
  
          // Reset form fields after successful creation
          this.resetForm();
          this.$router.push('/catalog');
        } catch (error) {
          this.message = error.response?.data?.message || 'Failed to create item';
          this.isError = true;
        }
      },
      resetForm() {
        this.name = '';
        this.description = '';
        this.cost = 0;
        this.currencyType = 'gold';
        this.image = null;
      },
    },
  };
  </script>
  
  <style scoped>
  .create-item {
    max-width: 500px;
    margin: 2em auto;
    padding: 2em;
    background-color: #333;
    color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .form-group {
    margin-bottom: 1em;
  }
  
  label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.75em;
    border-radius: 4px;
    border: none;
    background-color: #444;
    color: #fff;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: 2px solid #42b983;
  }
  
  button {
    background-color: #42b983;
    color: #fff;
    padding: 0.75em 2em;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 4px;
    width: 100%;
  }
  
  button:hover {
    background-color: #369870;
  }
  
  p {
    margin-top: 1em;
    font-weight: bold;
    text-align: center;
  }
  
  .error {
    color: #ff4f4f;
  }
  
  .success {
    color: #42b983;
  }
  </style>
  