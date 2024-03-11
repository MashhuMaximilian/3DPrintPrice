import 'primevue/resources/primevue.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons
import 'primeflex/primeflex.css';

import App from './App.vue';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';
import firebaseApp from '../firebaseStorage'; // Adjust the path as needed
import router from './router';
import store from './store';

console.log(firebaseApp); // This line is just to verify that Firebase app is imported and initialized

const app = createApp(App);
app.use(PrimeVue, { unstyled: false, ripple: true });
app.use(store);
app.use(router);

app.mount('#app');
