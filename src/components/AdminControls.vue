<!-- AdminControls.vue  -->
<template>
<Card class="shadow-5 w-12 h-22rem m-2 mb-4 border-round-3xl vertical-align-middle text-left">

<template #content>
<div class="flex flex-row justify-content-evenly">

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
                <span class="w-6  mr-4 font-medium">Sky Glow Intensity</span>
                <Slider class="w-full p-2 border-round-md" v-model="emissiveIntensity" :min="0" :max="1" :step="0.01" @change="updateSphereProperty('emissiveIntensity', emissiveIntensity)" />
            </div>


          <div class="text-right flex flex-row justify-content-left" >
                <span class="w-6 mr-4 font-medium">Opacity</span>
                <Slider class="w-full p-2 border-round-md" v-model="opacity" :min="0" :max="1" :step="0.01" @change="updateSphereProperty('opacity', opacity)" />
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
  </template>
  </Card>




</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Dropdown from 'primevue/dropdown';
import ColorPicker from 'primevue/colorpicker';
import Slider from 'primevue/slider';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import { useEnvironmentLoader } from '@/composables/useEnvironmentLoader'; // Adjust path as needed

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';


const store = useStore();
const {  skyboxes, floors, hdrs  } = useEnvironmentLoader(/* scene, renderer */); // Pass your scene and renderer
// const { skyboxes, floors, hdrs } = useEnvironmentLoader(/* scene, renderer */); // Pass your scene and renderer


const selectedSkybox = computed({
  get: () => {
    const value = store.state.selectedSkybox;
    console.log('Getting selectedSkybox:', value); // Log retrieved value
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
    console.log('Getting selectedFloor:', value);
    return value;
  },
  set: (value) => {
    console.log('Setting selectedFloor:', value);
    console.log('Dispatching updateFloor:', value === 'No Floor' ? null : value);
    store.dispatch('updateFloor', value === 'No Floor' ? null : value);
  }
});

const selectedHDR = computed({
  get: () => {
    const value = store.state.selectedHDR;
    console.log('Getting selectedHDR:', value);
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
  console.log(`Color Picker/Text Input: Changing floor color to ${formattedColor}`);
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
