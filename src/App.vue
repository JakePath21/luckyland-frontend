<template>
  <div id="app">
    <nav>
      <!-- Logo Section -->
      <div class="logo-container">
        <img src="/src/assets/logo.png" alt="Site Logo" class="site-logo" />
      </div>

      <div class="nav-links">
        <template v-if="!userStore.username">
          <router-link to="/register">Register</router-link>
          <router-link to="/login">Login</router-link>
          <router-link to="/catalog">Catalog</router-link>
        </template>
        <template v-else>
          <router-link to="/dashboard">Home</router-link>
          <router-link to="/catalog">Catalog</router-link>
          <router-link to="/avatar">Avatar</router-link>
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
        <div class="username-section">
          <span>Welcome, {{ userStore.username }}!</span>
          <span v-if="rank > 0" :class="getRankClass(rank)">
            <img :src="getRankIcon(rank)" :alt="getRankName(rank)" class="badge-icon" />
            {{ getRankName(rank) }}
          </span>
        </div>
        <button @click="logout">Logout</button>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue';
import { userStore } from './store/user';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    let socket = null;
    const rank = ref(0);

    const logout = () => {
      userStore.clearUser();
      router.push('/login');
      if (socket) {
        socket.disconnect();
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${encodeURIComponent(userStore.username)}`);
        const { tickets, gold } = response.data;
        userStore.setTickets(tickets);
        userStore.setGold(gold);

        // Fetch rank
        const rankResponse = await axios.get(`http://localhost:5000/api/auth/rank/${encodeURIComponent(userStore.username)}`);
        rank.value = rankResponse.data.rank;
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    const getRankName = (rank) => {
      switch (rank) {
        case 1:
          return 'Admin';
        case 2:
          return 'Moderator';
        default:
          return '';
      }
    };

    const getRankClass = (rank) => {
      switch (rank) {
        case 1:
          return 'badge admin-badge';
        case 2:
          return 'badge moderator-badge';
        default:
          return '';
      }
    };

    const getRankIcon = (rank) => {
      switch (rank) {
        case 1:
          return '/src/assets/adminicon.png';
        case 2:
          return '/src/assets/modicon.png';
        default:
          return '';
      }
    };

    onMounted(() => {
      if (userStore.username) {
        fetchUserData();
        socket = io('http://localhost:5000');
        socket.emit('fetchBalance', userStore.username);
        socket.on('balanceUpdate', (data) => {
          userStore.setGold(data.gold);
          userStore.setTickets(data.tickets);
        });
      }
    });

    onUnmounted(() => {
      if (socket) {
        socket.disconnect();
      }
    });

    return { userStore, logout, rank, getRankName, getRankClass, getRankIcon };
  }
};
</script>

<style>

/* Logo Section */
.logo-container {
  background-color: #222;
  padding: 0.3em 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

/* Reduce Logo Size */
.site-logo {
  height: 30px;
  object-fit: contain;
}

body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #222;
  color: #fff;
}

#app {
  text-align: center;
}

/* Navigation Bar */
nav {
  background-color: #333;
  padding: 0.5em 1em;
  display: flex;
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

/* User Info Section */
.user-info {
  display: flex;
  align-items: center;
  gap: 1.5em;
  margin-left: auto; /* Push user info to the right */
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
  gap: 1em;
  margin-right: 1em;
}

.currency {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.currency img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.currency.gold span {
  font-weight: bold;
  color: gold;
}

.currency.tickets span {
  font-weight: bold;
  color: red;
}

.username-section {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

/* Rank Badges */
.badge {
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.2em 0.5em;
  border-radius: 5px;
  font-weight: bold;
  color: #fff;
}

.badge-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.admin-badge {
  background-color: #88010169;
}

.moderator-badge {
  background-color: #00566180;
}

main {
  padding: 2em;
}
</style>
