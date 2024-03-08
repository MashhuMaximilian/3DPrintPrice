import 'primevue/resources/primevue.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons
import 'primeflex/primeflex.css';

import App from './App.vue';
import PrimeVue from 'primevue/config';
//main.js
import { createApp } from 'vue';
import firebaseApp from '../firebaseStorage';
import router from './router';
import store from './store'; // Import the store from the file you defined it in

console.log(firebaseApp); // If you want to ensure it's imported correctly



const app = createApp(App);
app.use(PrimeVue, { unstyled: false });
app.use(PrimeVue, { ripple: true });

app.use(store); // Inject the store into the Vue application
app.use(router);

// Change the theme



// Globally register all PrimeVue components
// (Note: You may need to import components explicitly if using Vue 3)

app.mount('#app');
