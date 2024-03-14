<!-- AdminControls.vue   -->
<template>



    <div class="card shadow-5 w-12 h-22rem m-2 mb-4 border-round-3xl vertical-align-middle text-left gap-2">
        <TabView class="tabview-custom">
            <TabPanel>
                <template #header>
                    <div class="flex align-items-center gap-2">
                        <Avatar :image="sceneSettingsImage" shape="circle" />
                        <span class="font-bold white-space-nowrap">Scene Settings</span>
                    </div>
                </template>
<div class ="flex flex-row">
                <div  class="text-center flex flex-column w-3 justify-content-left justify-content-between py-4">
    <Dropdown class="flex flex-row p-2 border-round-xl" v-model="selectedSkybox" :options="skyboxOptions" placeholder="Choose Skybox" @change="updateEnvironmentProperty('Skybox', $event)" />
  <Dropdown class="flex flex-row p-2 border-round-xl"  v-model="selectedFloor" :options="floorOptions" placeholder="Choose Floor" @change="updateEnvironmentProperty('Floor', $event)" />
  <Dropdown class="flex flex-row p-2 border-round-xl" v-model="selectedHDR" :options="hdrOptions" placeholder="Choose HDR" @change="updateEnvironmentProperty('HDR', $event)" />
  </div>


  <div class="text-right flex flex-column w-6 justify-content-left justify-content-between px-8 py-4" >

        <div class="text-right flex flex-row justify-content-left vertical-align-middle" >
          <span class="w-6  mr-4 font-medium">Metalness</span>
          <Slider class="w-full p-2 border-round-md" v-model="metalness" @change="updateSphereProperty('metalness', metalness)" :min="0" :max="1" :step="0.01" />

        </div>
        <div class="text-right flex flex-row justify-content-left" >
                  <span class="w-6 mr-4 font-medium">Roughness</span>
                  <Slider class="w-full p-2 border-round-md"  v-model="roughness" :min="0" :max="1" :step="0.01" @change="updateSphereProperty('roughness', roughness)" />
        </div>

        <div class="text-right flex flex-row justify-content-left" >
            <span class="w-6  mr-4 font-medium">Sky Glow</span>
            <Slider class="w-full p-2 border-round-md" v-model="emissiveIntensity" :min="0" :max="1" :step="0.01" @change="updateSphereProperty('emissiveIntensity', emissiveIntensity)" />
        </div>


        <div class="text-right flex flex-row justify-content-left" >
            <span class="w-6 mr-4 font-medium">Opacity</span>
            <Slider class="w-full p-2 border-round-md" v-model="opacity" :min="0" :max="1" :step="0.01" @change="updateSphereProperty('opacity', opacity)" />
        </div>

        <div class="text-right flex flex-row justify-content-left" >
            <span class="w-6 mr-4 font-medium">HDR Intensity</span>
            <Slider class="w-full p-2 border-round-md" v-model="hdrIntensity" :min="0" :max="6" :step="0.1" @change="updateHDRIntensity" />
                  </div>

</div>


<div class="col-3 flex flex-column justify-content-between gap-6 py-4">

    <div class="flex flex-row justify-content-start ">
      <div class="w-full">
    <IconField iconPosition="left"> <InputIcon class="pi pi-palette px-1"> </InputIcon>
      <InputText class="w-12" id="sphereColor" v-model="sphereColor" @input="() => updateSphereProperty('sphereColor', sphereColor)" placeholder="Enter glow color" /></IconField>
    </div>
    <div class="w-11 p-2">
      <ColorPicker v-model="sphereColor" @change="value => updateSphereProperty('sphereColor', value)" />
      <span class="w-12 font-medium mx-2">Sky Color</span> 
    </div>
    </div>

    <div class="flex flex-row justify-content-start">
      <div class="w-full">
    <IconField iconPosition="left"> <InputIcon class="pi pi-palette px-1"> </InputIcon>
    <InputText class="w-12" id="floorColor" v-model="floorColor" @input="() => updateFloorColor(floorColor)" placeholder="Enter floor color" /> </IconField>
    </div>
    <div class="w-11 p-2 justify-content-end">
      <ColorPicker v-model="floorColor" @change="updateFloorColor" />
      <span class="w-8 font-medium mx-2">Floor Color</span> 
    </div>
    </div>


    <div class="flex flex-row justify-content-start">
      <div class="w-full">
    <IconField iconPosition="left"> <InputIcon class="pi pi-palette px-1"> </InputIcon>
      <InputText class="w-12" id="emissive" v-model="emissiveColor" @input="() => updateSphereProperty('emissiveColor', emissiveColor)" placeholder="Enter glow color" /></IconField>
    </div>
    <div class="w-11 p-2 justify-content-end">
      <ColorPicker v-model="emissiveColor" @change="updateSphereProperty('emissiveColor', $event)" />
      <span class="w-12 font-medium mx-2">Sky Glow</span> 
    </div>
    </div>

    



</div>
</div>

            </TabPanel>
            <TabPanel>
                <template #header>
                    <div class="flex align-items-center gap-2">
                        <Avatar :image="modelSettingsImage" shape="circle" />
                        <span class="font-bold white-space-nowrap">Model Settings</span>
                    </div>
                </template>
                <p class="m-0">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                </p>
            </TabPanel>
        </TabView>
    </div>









</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Dropdown from 'primevue/dropdown';
import ColorPicker from 'primevue/colorpicker';
import Slider from 'primevue/slider';
import InputText from 'primevue/inputtext';
import { useEnvironmentLoader } from '@/composables/useEnvironmentLoader'; // Adjust path as needed

import sceneSettingsImage from '@/internalAssets/sceneSettings.png';
import modelSettingsImage from '@/internalAssets/modelSettings.png';


import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Avatar from 'primevue/avatar';


const store = useStore();
const hdrIntensity = computed({
      // Getter returns the current state value
      get: () => store.state.hdrIntensity,
      // Setter dispatches an action to update the state
      set: (value) => store.dispatch('updateHDRIntensity', value)
    });

const {  skyboxes, floors, hdrs  } = useEnvironmentLoader(/* scene, renderer */); // Pass your scene and renderer
// const { skyboxes, floors, hdrs } = useEnvironmentLoader(/* scene, renderer */); // Pass your scene and renderer

function updateHDRIntensity(value) {
  store.dispatch('updateHDRIntensity', parseFloat(value));
}

const selectedSkybox = computed({
  get: () => {
    const value = store.state.selectedSkybox;
    return value;
  },
  set: (value) => {
    console.log('Setting selectedSkybox:', value); // Log assigned value
    store.dispatch('updateSkybox', value);
  }
});

const selectedFloor = computed({
  get: () => {
    const value = store.state.selectedFloor;
    return value;
  },
  set: (value) => {
    console.log('Setting selectedFloor:', value);
    store.dispatch('updateFloor', value === 'No Floor' ? null : value);
  }
});

const selectedHDR = computed({
  get: () => {
    const value = store.state.selectedHDR;
    return value;
  },
  set: (value) => {
    console.log('Setting selectedHDR:', value);
    store.dispatch('updateHDR', value);
  }
});

const sphereColor = ref('#8c32ff');
const emissiveColor = ref('#ffffff');


// Define properties as reactive references
const metalness = ref(0.7);
const roughness = ref(0.4);
const emissiveIntensity = ref(0.01);
const opacity = ref(0.9);

const floorColor = ref('#8c52ff');

const normalizeDropdownEventValue = (event) => {
  if (event && typeof event === 'object' && event.value) {
    return event.value;
  }
  return event;
};

const updateEnvironmentProperty = (property, event) => {
  const value = normalizeDropdownEventValue(event);
  store.dispatch(`update${property}`, value);
};


// Existing method for updating sphere properties
function updateSphereProperty(property, value) {
  store.dispatch('updateSphereColor', { property, value });

}

// Adjusted to handle both direct string inputs and objects with a value property
const updateFloorColor = (colorInput) => {
  const colorValue = typeof colorInput === 'string' ? colorInput : colorInput.value;
  // Remove '#' if present
  const formattedColor = colorValue.startsWith('#') ? colorValue.slice(1) : colorValue;
  store.dispatch('changeFloorColor', formattedColor);
};


// Computed properties for dropdown options
const skyboxOptions = computed(() => ['No Skybox', ...skyboxes.value]);
const floorOptions = computed(() => ['No Floor', ...floors.value]);
const hdrOptions = computed(() => ['No HDR', ...hdrs.value]);

// Define update functions that dispatch actions to the store


</script>

<style scoped>

.slider {
  width: 300px;
  padding: 0.5em;
  margin: 0.5em;
  border-radius: 5px;
}



.label{
  color: #333333;
  font-weight: 500;
}

.dpdown{
  width:100%;
  margin: 1em 0em 1em 0em;
  padding: 1em;}


</style>
