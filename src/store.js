//store.js 
import { createStore } from 'vuex';

const store = createStore({
  state: {
    selectedSkybox: null,
    selectedFloor: null,
    selectedHDR: null,


    floorProperties: {
      floorColor: '',
    },

    sphereProperties: {
      sphereColor: '#8c52ff',
      metalness: 0.5,
      roughness: 0.2,
      emissiveIntensity: 0.02,
      envMapIntensity: 0.5,
      opacity: 0.9,
      emissiveColor: '#ffffff'
    },
  },
  mutations: {
    updateSkybox(state, skybox) { state.selectedSkybox = skybox; },
  

    updateFloor(state, floor) { state.selectedFloor = floor === 'No Floor' ? null : floor;},
    updateHDR(state, hdr) { console.log('Mutating HDR state with:', hdr); state.selectedHDR = hdr === 'No HDR' ? null : hdr; },



    updateSphereProperty(state, { property, value }) {
      if (property in state.sphereProperties) {
        state.sphereProperties[property] = value;
      }
    },

    updateFloorColor(state, color) {
      console.log(`Mutation: Changing floor color to ${color}`);
      state.floorProperties.floorColor = color;
    },
  
  
  
  },
  actions: {
  

    updateSphereColor({ commit }, { property, value }) {
      commit('updateSphereProperty', { property, value });
    },
   
    changeFloorColor({ commit }, color) {
      console.log(`Action: Request to change floor color to ${color}`);
      commit('updateFloorColor', color); // Committing the correct mutation
    },
    
    updateSkybox({ commit }, skybox) { commit('updateSkybox', skybox); },
    updateFloor({ commit }, floor) { commit('updateFloor', floor); },
    updateHDR({ commit }, hdr) { commit('updateHDR', hdr); },

    // updateSphereColor({ commit }, color) { commit('updateSphereColor', color); },


  }
});

export default store;