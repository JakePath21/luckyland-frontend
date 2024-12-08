<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/register">Register</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/catalog">Catalog</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
nav {
  padding: 1em;
  background-color: #f0f0f0;
}
nav a {
  margin-right: 1em;
  text-decoration: none;
  color: #42b983;
}
</style>
