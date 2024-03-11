//store.js 
import { createStore } from 'vuex';

const store = createStore({
  state: {
    selectedSkybox: 'lightbluesky.glb',
    selectedFloor: 'pinkfloor2.glb',
    selectedHDR:'spot1Lux.hdr',


    floorProperties: {
      floorColor: '',
    },

    sphereProperties: {
      sphereColor: '#8c52ff',
      metalness: 0.5,
      roughness: 0.2,
      emissiveIntensity: 0.02,
      opacity: 0.9,
      emissiveColor: '#ffffff'
    },
  },
  mutations: {
    updateSkybox(state, value) {
      state.selectedSkybox = value;
    },
    updateFloor(state, floor) {
      state.selectedFloor = floor;
    },
    updateHDR(state, value) {
      state.selectedHDR = value;
    },
  

    updateSphereProperty(state, { property, value }) {
      if (property in state.sphereProperties) {
        state.sphereProperties[property] = value;
      }
    },
    updateFloorColor(state, color) {
      state.floorProperties.floorColor = color;
    },
  
  
  
  },
  actions: {
  

    updateSphereColor({ commit }, { property, value }) {
      commit('updateSphereProperty', { property, value });
    },
   
    changeFloorColor({ commit }, color) {
      commit('updateFloorColor', color); // Committing the correct mutation
    },
    
    updateSkybox({ commit }, value) {
      commit('updateSkybox', value);
    },

    updateFloor({ commit, state }, newFloor) {
      if (newFloor !== state.selectedFloor) {
        commit('updateFloor', newFloor);
      } else {
        console.log('Ignoring redundant update for selectedFloor');
      }
    },
    
    updateHDR({ commit }, value) {
      commit('updateHDR', value );
    },

    // updateSphereColor({ commit }, color) { commit('updateSphereColor', color); },


  }
});

export default store;