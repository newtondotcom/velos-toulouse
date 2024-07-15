import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import './assets/index.css';
import App from './App.vue';
import Landing from './Landing.vue';
import Bikes from './Bikes.vue';

const routes = [
  { path: '/', component: Bikes },
  { path: '/landing', component: Landing },
];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
createApp(App).use(router).mount('#app');
