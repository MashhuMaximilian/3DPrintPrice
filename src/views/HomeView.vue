<template>

  <div class="grid w-12 overflow-hidden m-4 p-4 ">
  
    <!-- Row 1 -->
    <div class="col-6 h-auto">
      <!-- Column 1: 60% width -->
      <ThreeViewer />
    </div>
    <div class="col-6  h-auto pl-2">
      <!-- Column 2: 40% width -->
      <FileUpload />
    </div>

    <!-- Row 2 -->
    <div class="flex flex-row w-12 p-2">
      <!-- Column 1: 100% width -->
      <AdminControls />
    </div>
  </div>
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
