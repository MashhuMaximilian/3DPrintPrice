//store.js 
import { createStore } from 'vuex';

const store = createStore({
  state: {
    hdrIntensity: 3, 
    selectedSkybox: 'lightbluesky.glb',
    selectedFloor: 'seamless__floor_tiled_texture_v.glb',
    selectedHDR:'moonlessgolf.hdr',
    

    currentSTLFile: null,
    currentSTLFileName: null,
    scene: null, 
    stlHeight: 0,
    stlUploadCompleted: false,

    


    floorProperties: {
      floorColor: '#f9f9f9',
    },

    sphereProperties: {
      sphereColor: '#544654',
      metalness: 0.5,
      roughness: 0.2,
      emissiveIntensity: 0.02,
      opacity: 0.8,
      emissiveColor: '#ffffff'
    },
  },
  mutations: {

    setSTLUploadCompleted(state, value) {
      state.stlUploadCompleted = value;
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

    setCurrentSTLFile(state, file) {
      state.currentSTLFile = file;
    },

    setCurrentSTLFileName(state, fileName) {
      state.currentSTLFileName = fileName;
    },
  
    clearCurrentSTLFile(state) {
      if (state.currentSTLFile) {
        state.scene.remove(state.currentSTLFile);
        state.currentSTLFile = null;
      }
    },

    setSTLHeight(state, height) {
      state.stlHeight = height;
    },

    setScene(state, newScene) {
      state.scene = newScene; // Make sure you have a `scene` state property if you use this
    },
  
  
  },
  actions: {
  
    updateCurrentSTLFile({ commit }, file) {
      commit('setCurrentSTLFile', file);
    },
    removeCurrentMesh({ commit }) {
      commit('setCurrentSTLFile', null);
      commit('setCurrentSTLFileName', null);
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
      commit('setHDRIntensity', value);
    },

    updateSTLHeight({ commit }, height) {
      commit('setSTLHeight', height); // Define a mutation `setSTLHeight` if you want to store the height in your state
    },
  


  }
});

export default store;