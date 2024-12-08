<template>
  <div id="app">
    <nav>
      <div class="nav-links">
        <template v-if="!userStore.username">
          <router-link to="/register">Register</router-link>
          <router-link to="/login">Login</router-link>
          <router-link to="/catalog">Catalog</router-link>
        </template>
        <template v-else>
          <router-link to="/dashboard">Home</router-link>
          <router-link to="/catalog">Catalog</router-link>
        </template>
      </div>
      <div v-if="userStore.username" class="user-info">
        <div class="currencies">
          <div class="currency gold">
            <img src="./assets/goldicon.png" alt="Gold" />
            <span>{{ userStore.gold }}</span>
          </div>
          <div class="currency tickets">
            <img src="./assets/ticketicon.png" alt="Tickets" />
            <span>{{ userStore.tickets }}</span>
          </div>
        </div>
        <span>Welcome, {{ userStore.username }}!</span>
        <button @click="logout">Logout</button>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { userStore } from './store/user';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();

    const logout = () => {
      userStore.clearUsername();
      router.push('/login');
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${encodeURIComponent(userStore.username)}`);
        const { tickets, gold } = response.data;
        userStore.setTickets(tickets);
        userStore.setGold(gold);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    onMounted(() => {
      console.log('Current username:', userStore.username);  // Debug log
      if (userStore.username) {
        fetchUserData();
      }
    });


    return { userStore, logout };
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #222;
  color: #fff;
}

#app {
  text-align: center;
}

nav {
  background-color: #333;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  margin: 0 1em;
  font-weight: bold;
}

.nav-links a:hover {
  color: #42b983;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5em;
  color: #42b983;
}

.user-info button {
  background: none;
  border: none;
  color: #ff4f4f;
  cursor: pointer;
  font-weight: bold;
}

.user-info button:hover {
  color: #ff7878;
}

.user-info .currencies {
  display: flex;
  gap: 1em;          /* Space between the currency elements */
  margin-right: 1em; /* Push the currencies a bit to the left */
}

.currency {
  display: flex;
  align-items: center;
  gap: 0.25em;       /* Space between the icon and the number */
}

.currency img {
  width: 20px;       /* Icon width */
  height: 20px;      /* Icon height */
  object-fit: contain;
}

/* Gold currency styling */
.currency.gold span {
  font-weight: bold;
  color: gold;
}

/* Tickets currency styling */
.currency.tickets span {
  font-weight: bold;
  color: red;
}


main {
  padding: 2em;
}
</style>
