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
      envMapIntensity: 0.5,
      opacity: 0.9,
      emissiveColor: '#ffffff'
    },
  },
  mutations: {
    updateSkybox(state, value) {
      state.selectedSkybox = value;
      console.log('Updated state.selectedSkybox:', value);
    },
    updateFloor(state, floor) {
      state.selectedFloor = floor;
      console.log('Updated state.selectedFloor:', floor);
    },
    updateHDR(state, value) {
      state.selectedHDR = value;
      console.log('Updated state.selectedHDR:', value);
    },
  

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
    
    updateSkybox({ commit }, value) {
      console.log('Received value in updateSkybox:', value);
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
      console.log('Received value in updateHDR:', value);
      commit('updateHDR', value === 'No HDR' ? null : value);
    },

    // updateSphereColor({ commit }, color) { commit('updateSphereColor', color); },


  }
});

export default store;