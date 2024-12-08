<template>
    <form @submit.prevent="register">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        message: ''
      };
    },
    methods: {
      async register() {
        try {
          await axios.post('http://localhost:5000/api/auth/register', {
            username: this.username,
            password: this.password
          });
          this.message = 'Registration successful!';
        } catch (error) {
          this.message = error.response.data.message || 'Registration failed';
        }
      }
    }
  };
  </script>
  