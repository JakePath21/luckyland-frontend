<!-- src/views/Register.vue -->
<template>
    <div class="form-container">
      <h2>Create Your Account</h2>
      <form @submit.prevent="register">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <select v-model="gender" required>
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button type="submit">Register</button>
        <p v-if="message">{{ message }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        gender: '',
        message: ''
      };
    },
    methods: {
      async register() {
        try {
          await axios.post('http://localhost:5000/api/auth/register', {
            username: this.username,
            password: this.password,
            gender: this.gender
          });
          this.message = 'Registration successful! You can now log in.';
        } catch (error) {
          this.message = error.response.data.message || 'Registration failed';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .form-container {
    background-color: #333;
    padding: 2em;
    border-radius: 8px;
    max-width: 400px;
    margin: 2em auto;
    color: #fff;
  }
  
  input, select, button {
    display: block;
    width: 100%;
    margin-bottom: 1em;
    padding: 0.75em;
    border-radius: 4px;
    border: none;
  }
  
  button {
    background-color: #42b983;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #369870;
  }
  
  p {
    color: #ff4f4f;
  }
  </style>
  