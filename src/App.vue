<!-- app.vue  -->
<template>
    <div id="app">

    <div class="flex flex-row justify-content-end mr-4 my-2">
      <ToggleButton v-model="isDarkMode" onLabel="" offLabel="" onIcon="pi pi-moon" offIcon="pi pi-sun" @change="toggleTheme" class="w-3rem" />
    </div>
 <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
 <HomeView   />
 
    </div>
</template>

<script setup>
import HomeView from './views/HomeView.vue'
import ToggleButton from 'primevue/togglebutton'

import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';

const PrimeVue = usePrimeVue();
const isDarkMode = ref(false); // Tracks the theme mode

function toggleTheme() {
  if (isDarkMode.value) {
    // Switch to dark theme
    PrimeVue.changeTheme('aura-light-purple', 'aura-dark-purple', 'theme-link', () => {
      console.log('Theme switched to dark');
    });
  } else {
    // Switch to light theme
    PrimeVue.changeTheme('aura-dark-purple', 'aura-light-purple', 'theme-link', () => {
      console.log('Theme switched to light');
    });
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2px;
  margin: -0.3rem;
  padding: 0.5rem;
}


.dark-theme {
  background-color: var(--primary-color); /* Use the primary color from the dark theme */
}

.light-theme {
  --text-color: #2c3e50; /* Dark text color for light themes */
  background: var(--primary-300); /* Use the background color from the light theme */
}
</style>
