<template>
    <div class="form-container">
      <h2>Sign In</h2>
      <form @submit.prevent="login">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p v-if="message">{{ message }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { userStore } from '../store/user';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        message: ''
      };
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    methods: {
      async login() {
        this.message = ''; // Clear any previous error message
  
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            username: this.username,
            password: this.password
          });
  
          // Debug log
          console.log('Login response:', response.data);
  
          // Update userStore and localStorage
          userStore.setUsername(this.username);
          localStorage.setItem('token', response.data.token);
  
          // Redirect to the dashboard
          this.router.push('/dashboard');
        } catch (error) {
          console.error('Login error:', error);
          this.message = error.response?.data?.message || 'Login failed. Please try again.';
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
  
  input, button {
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
  