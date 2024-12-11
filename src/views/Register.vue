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
      <p v-if="message" class="error-message">{{ message }}</p>
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
        this.message = error.response?.data?.message || 'Registration failed';
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

.form-container:hover {
  transform: translateY(-5px);
}

h2 {
  margin-bottom: 1em;
  font-size: 2em;
  color: #42b983;
}

input, select {
  width: calc(100% - 1.5em);
  margin-bottom: 1em;
  padding: 0.75em;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #3c4043;
  color: #fff;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

input:focus, select:focus {
  border-color: #42b983;
  outline: none;
}

button {
  width: calc(100% - 1.5em);
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
