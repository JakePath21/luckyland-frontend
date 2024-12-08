import { createRouter, createWebHistory } from 'vue-router';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import Catalog from '../components/Catalog.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/catalog', component: Catalog },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
