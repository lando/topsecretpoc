<template>
  <img
    alt="Lando logo"
    src="./assets/logo.png"
  >
  <app-navigation />
  <router-view />
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppNavigation from '/@/components/AppNavigation.vue';
import {useElectron} from '/@/use/electron';

export default defineComponent({
  name: 'App',
  components: {
    AppNavigation,
  },
  mounted() {
    const {consoleServer} = useElectron();
    consoleServer();
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img {
  width: 250px;
}
</style>
