<!-- FileUpload  -->
<template>
    <div class="card shadow-5 w-12 h-full p-4 border-round-3xl vertical-align-middle">
        <Toast />
        <FileUpload class="w-8 border-round-3xl" name="demo[]" url="/api/upload" @upload="onTemplatedUpload($event)" :multiple="true" accept=".stl" :maxFileSize="150000000" @select="onSelectedFiles">
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                    <div class="flex gap-2">
                        <Button @click="chooseCallback()" icon="pi pi-box" rounded outlined></Button>
                        <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                        <Button @click="resetUploadState(clearCallback)" icon="pi pi-refresh" rounded outlined severity="danger" :disabled="totalSizePercent === 0"></Button>
                    </div>
                    <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-6 h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]">
                        <span class="white-space-nowrap">{{ totalSize }}B / 100Mb</span> </ProgressBar>
                </div>
            </template>

            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div v-if="files.length > 0">
                    <h5>Pending</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card flex flex-row border-1 border-round-3xl p-2 surface-border align-items-left gap-2">
                            <div>
                                <img role="presentation" class="border-round-3xl h-9rem w-auto w-full" :alt="file.name" :src="file.previewURL" />
                            </div>
                            <div class="flex flex-column gap-2 p-2">
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Pending" severity="warning" />
                            <div class="flex gap-2">
                            <Button icon="pi pi-trash" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded  severity="danger" ></Button>
                            <Button @click="uploadEvent(uploadCallback)" icon="pi pi-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                        </div>
                    </div>
                        </div>
                    </div>
                </div>

                <div v-if="uploadedFiles.length > 0">
                    <h5>Completed</h5>
                    <div class="flex flex-wrap p-0 border-round-3xl sm:p-5 gap-5">
                        <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card flex flex-row border-1 border-round-3xl p-2 surface-border align-items-left gap-2">
                            <div>
                                <img role="presentation" class="border-round-3xl h-9rem w-auto w-full" :alt="file.name" :src="file.previewURL" />
                            </div>
                            <div class="flex flex-column gap-2 p-2">
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Completed" class="mt-3" severity="success" />
                            <div class="w-12 justify-content-evenly">
                            <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded  severity="danger" ></Button>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex align-items-center justify-content-center flex-column">
                    <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                    <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useToast } from "primevue/usetoast";
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Badge from 'primevue/badge';

import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import { useStore } from 'vuex';
const store = useStore();




const generateSTLPreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(500, 500);

      const loader = new STLLoader();
      const geometry = loader.parse(contents);
      const material = new THREE.MeshStandardMaterial({ color: 0xA27CF8 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
            //lighting
            const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4); // Adjust color and intensity

            // Directional Light (Sunlight)
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
            directionalLight.position.set(-50, 200, 100); // Adjust position

            // Fill Light (Soft light)
            const fillLight = new THREE.DirectionalLight(0xdddddd, 1.7);
            fillLight.position.set(50, 50, 30); // Adjust position

            // Rim Light (Subtle highlight)
            const rimLight = new THREE.SpotLight(0xffffff, 0.3, 0, Math.PI / 4, 1);
            rimLight.position.set(0, 100, -100); // Adjust position

            // Add lights to the scene
            scene.add(ambientLight, directionalLight, fillLight, rimLight);
      // Calculate the bounding box of the mesh
      const boundingBox = new THREE.Box3().setFromObject(mesh);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // Center the mesh
      mesh.position.set(-center.x, -center.y, -center.z);

      // Adjust camera position and orientation
      const cameraDistance = maxDim * 1.5;
      camera.position.set(0, 0, cameraDistance);
      camera.lookAt(0, 0, 0);

      // Rotate the camera to view from the front
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/1.8);
      camera.lookAt(0, 0, 0);
      

      // Render the scene
      renderer.render(scene, camera);

      // Get the data URL of the rendered image
      const dataURL = renderer.domElement.toDataURL();
      resolve(dataURL);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};
const $primevue = usePrimeVue();
const toast = useToast();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);


// Increase the limit to 100MB (100 * 1024 * 1024)
const maxFileSize = 150 * 1024 * 1024;

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  console.log(`Removing file: ${file.name}, size: ${file.size}`);
  totalSize.value -= file.size;
  if (totalSize.value < 0) {
    totalSize.value = 0;
  }
  totalSizePercent.value = (totalSize.value / maxFileSize) * 100;
  console.log(`File removed: ${file.name}, updated total size: ${totalSize.value}, percentage: ${totalSizePercent.value}`);
  removeFileCallback(index);

 if (file.name === store.state.currentSTLFileName) {
    store.dispatch('removeCurrentMesh');
  }
  // Dispatch the removeCurrentMesh action to remove the mesh from the scene
};

const onSelectedFiles = async (event) => {
  const selectedFiles = event.files;
  const validFiles = selectedFiles.filter(file => file.name.split('.').pop().toLowerCase() === 'stl');

  if (validFiles.length !== selectedFiles.length) {
    toast.add({ severity: 'error', summary: 'Invalid File Type', detail: 'Please select only .STL files.', life: 3000 });
    event.preventDefault();
    return;
  }

  for (const file of validFiles) {
    try {
      const previewURL = await generateSTLPreview(file);
      file.previewURL = previewURL;
    } catch (error) {
      console.error('Error generating STL preview:', error);
      // Handle the error, e.g., show an error message or fallback to a default preview image
      file.previewURL = 'path/to/default/preview.png';
    }
  }

  files.value = [...files.value, ...validFiles];
  totalSize.value += validFiles.reduce((acc, file) => acc + file.size, 0);
  totalSizePercent.value = (totalSize.value / maxFileSize) * 100;
  console.log(`Files selected, updated total size: ${totalSize.value}, percentage: ${totalSizePercent.value}`);
};




// Inside the uploadEvent function
const uploadEvent = async (callback) => {
    console.log(`Attempting to upload, total size: ${totalSize.value}, percentage: ${totalSizePercent.value}`);
    if (callback && typeof callback === "function") {
        await callback();
        // Iterate over files.value array and dispatch action for each file
        files.value.forEach(file => {
            store.dispatch('updateCurrentSTLFile', file);
        });
    } else {
        console.error("Upload callback is not a function", callback);
    }
};



const onTemplatedUpload = () => {
    toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

const resetUploadState = (clearCallback) => {
  if (typeof clearCallback === 'function') {
    clearCallback();
  }
  totalSize.value = 0;
  totalSizePercent.value = 0;
  // Dispatch an action to clear the current mesh
  store.dispatch('removeCurrentMesh');
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
</script>
