import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Catalog from '../views/Catalog.vue';

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
