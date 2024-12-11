<template>
  <div class="form-container">
    <h2>Sign In</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="message" class="error-message">{{ message }}</p>
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

        // Update userStore and localStorage
        userStore.setUser(response.data.id, this.username);
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
body {
  background-color: #1e1e1e;
  font-family: 'Arial', sans-serif;
  color: #fff;
  margin: 0;
  padding: 0;
}

.form-container {
  background-color: #272727;
  padding: 2em;
  border-radius: 12px;
  max-width: 400px;
  margin: 3em auto;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.form-container:hover {
  transform: translateY(-5px);
}

h2 {
  margin-bottom: 1em;
  font-size: 2em;
  color: #42b983;
}


input {
  width: calc(100% - 1.5em); /* Ensures input fields have padding without overflow */
  margin-bottom: 1em;
  padding: 0.75em;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #3c4043;
  color: #fff;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #42b983;
  outline: none;
}

button {
  width: 100%;
  padding: 0.75em;
  background-color: #42b983;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #369870;
}

.error-message {
  color: #ff4f4f;
  font-weight: bold;
  margin-top: 1em;
}
</style>
