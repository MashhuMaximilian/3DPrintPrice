<template>

  <div class="flex flex-wrap w-12 overflow-x-hidden overflow-y-scroll">
  
    <!-- <div class="flex flex-row w-screen"> -->
    <!-- Row 1 -->
    <div class="max-h-30rem sm:col-12 flex-grow-1 md:col-5 ">
      <!-- Column 1: 60% width -->
      <ThreeViewer />
    </div>

    <div class="sm:col-12 py-2 my-2 md:col-7 flex-grow-1 max-h-30rem">
      <!-- Column 2: 40% width -->
      <FileUpload />
    </div>
  </div>

    <!-- Row 2 -->
    <div class="w-12 p-2 sm:my-3">
      <!-- Column 1: 100% width -->
      <AdminControls />
    </div>

  <!-- </div> -->
</template>


<script setup>
import ThreeViewer from '@/components/ThreeViewer.vue';
import AdminControls from '@/components/AdminControls.vue';
import FileUpload from '@/components/FileUpload.vue';






</script>

<style scoped>


.grid {
  margin: 0;
  padding: 0;
}

.col-6,
.col-12 {
  padding: 0; /* Remove padding if necessary */
  align-items: center;
  justify-content: center;
}

.grid{
  overflow-x:hidden;
  width:100%;
}


</style>
