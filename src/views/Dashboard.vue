<template>
    <div class="dashboard">
      <h2>Welcome, {{ userStore.username }}!</h2>
      <p>This is your dashboard.</p>
    </div>
  </template>
  
  <script>
  import { userStore } from '../store/user';
  import { useRouter } from 'vue-router';
  import { onBeforeMount } from 'vue';
  
  export default {
    setup() {
      const router = useRouter();
  
      // Redirect to login if the user is not logged in
      onBeforeMount(() => {
        if (!userStore.username) {
          router.push('/login');
        }
      });
  
      return { userStore };
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    text-align: center;
    color: #fff;
    margin-top: 2em;
  }
  
  h2 {
    font-size: 2em;
  }
  
  p {
    font-size: 1.2em;
  }
  </style>
  