//store.js 
import { createStore } from 'vuex';

const store = createStore({
  state: {
    hdrIntensity: 3, 
    selectedSkybox: 'lightbluesky.glb',
    selectedFloor: 'seamless__floor_tiled_texture_v.glb',
    selectedHDR:'moonlessgolf.hdr',
    currentSTLFile: null,


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

    setCurrentSTLFile(state, file) {
      state.currentSTLFile = file;
    },
  
    updateSkybox(state, value) {
      state.selectedSkybox = value;
    },
    updateFloor(state, floor) {
      state.selectedFloor = floor;
    },
    updateHDR(state, value) {
      state.selectedHDR = value;
    },

    setHDRIntensity(state, value) {
      console.log('Mutation: setHDRIntensity', value);
      state.hdrIntensity = value;
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
  
    uploadSTLFile({ commit }, file) {
      commit('setCurrentSTLFile', file);
    },

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
      commit('updateHDR', value === 'No HDR' ? null : value);
    },

    updateHDRIntensity({ commit }, value) {
      console.log('Action: updateHDRIntensity', value);

      commit('setHDRIntensity', value);
    },
  


  }
});

export default store;