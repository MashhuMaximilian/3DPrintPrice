<template>
  <div class="grid w-12 overflow-hidden ">
    <!-- Row 1 -->
    <div class="col-6 pl-2 ">
      <!-- Column 1: 60% width -->
      <ThreeViewer />
    </div>
    <div class="col-4">
      <!-- Column 2: 40% width -->
      <h1>Test</h1>
    </div>

    <!-- Row 2 -->
    <div class="flex flex-row w-12">
      <!-- Column 1: 100% width -->
      <AdminControls />
    </div>
  </div>
</template>


<script setup>
import ThreeViewer from '@/components/ThreeViewer.vue';
import AdminControls from '@/components/AdminControls.vue';
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
