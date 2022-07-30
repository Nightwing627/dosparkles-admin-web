<template>
  <v-toolbar class="d-flex justify-end px-3" dark>
    <v-toolbar-title
      @click="$router.push({ name: 'Dashboard' })"
      :class="{ active: $route.name === 'Dashboard' }"
      >Dashboard</v-toolbar-title
    >
    <v-toolbar-title class="mx-1">|</v-toolbar-title>
    <v-toolbar-title
      @click="$router.push({ name: 'Chat' })"
      :class="{ active: $route.name === 'Chat' }"
      >Chat</v-toolbar-title
    >
  </v-toolbar>
</template>

<script>
export default {};
</script>

<style scoped>
* {
   user-select: none;
}
.active {
  font-weight: bold;
}
    .fixed {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
    }
</style>

