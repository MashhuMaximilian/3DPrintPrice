//index.js
import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'), // Assumes you have a HomeView.vue component
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
