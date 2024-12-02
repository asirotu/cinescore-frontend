<template>
  <div id="app" class="bg-secondary text-primary min-h-screen">
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    showHeader() {
      return !['/login', '/register'].includes(this.$route.path);
    },
  },
};
</script>

<style>
</style>


<style>
@import 'tailwindcss/tailwind.css';

#app {
  font-family:Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
