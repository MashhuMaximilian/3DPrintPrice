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
    originalModelHeight: 0,
    originalSTLVolume: 0,

    


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
    setCurrentSTLFile(state, { file, fileName }) {
      state.currentSTLFile = file;
      state.currentSTLFileName = fileName;
      state.stlUploadCompleted = !!file;
    },
    setSTLHeight(state, height) {
      state.stlHeight = height;
    },

    setOriginalModelHeight(state, height) {
      state.originalModelHeight = height;
    },

    setOriginalSTLVolume(state, volume) {
      state.originalSTLVolume = volume;
    },
    
    clearSTL(state) {
      state.currentSTLFile = null;
      state.currentSTLFileName = null;
      state.stlHeight = 0;
      state.stlUploadCompleted = false;
      // Potentially clear the STL from the scene here if not handled elsewhere
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


    setScene(state, newScene) {
      state.scene = newScene; // Make sure you have a `scene` state property if you use this
    },
  
  
  },
  actions: {
  
    updateSTLVolume({ commit }, volumeInMl) {
      commit('setOriginalSTLVolume', volumeInMl);
      // You may want to log here to ensure this action is called
      console.log('Updated volume in store:', volumeInMl);
    },
    
    updateSTLFile({ commit }, { file, fileName, height }) {
      commit('setCurrentSTLFile', { file, fileName });
      commit('setSTLHeight', height);
    },
    
    removeSTLFile({ commit }) {
      commit('clearSTL');
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


  
  }
});

export default store;