<template>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
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
      async login() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            username: this.username,
            password: this.password
          });
          localStorage.setItem('token', response.data.token);
          this.message = 'Login successful!';
        } catch (error) {
          this.message = error.response.data.message || 'Login failed';
        }
      }
    }
  };
  </script>
  