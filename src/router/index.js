import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Catalog from '../views/Catalog.vue';
import CreateItem from '../views/CreateItem.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/catalog', component: Catalog },
  {
    path: '/catalog/:itemId',
    name: 'ItemDetail',
    component: () => import('../views/ItemDetail.vue'),
    props: true
  },  
  {
    path: '/catalog/edit/:itemId',
    name: 'EditItem',
    component: () => import('../views/EditItem.vue'),
    props: true,
  },  
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true } // Protect this route
  },
  { path: '/create-item', component: CreateItem, meta: { requiresAuth: true } },
  {
    path: '/avatar',
    name: 'Avatar',
    component: () => import('../views/Avatar.vue')
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to protect routes
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Redirect to login if not authenticated
    next('/login');
  } else {
    next(); // Proceed to the route
  }
});

export default router;
