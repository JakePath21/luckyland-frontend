<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/catalog">Catalog</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
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
}

nav a {
  color: #fff;
  text-decoration: none;
  margin: 0 1em;
  font-weight: bold;
}

nav a:hover {
  color: #42b983;
}

main {
  padding: 2em;
}
</style>
