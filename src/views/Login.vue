<!-- src/views/Login.vue -->
<template>
    <div class="form-container">
      <h2>Sign In</h2>
      <form @submit.prevent="login">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      login() {
        console.log('Logging in...');
      },
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    background-color: #333;
    padding: 2em;
    border-radius: 8px;
    display: inline-block;
    margin: 2em auto;
  }
  input, button {
    display: block;
    margin: 1em 0;
    padding: 0.5em;
    width: 100%;
  }
  button {
    background-color: #42b983;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #369870;
  }
  </style>
  