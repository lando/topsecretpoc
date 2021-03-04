<template>
  <p>
    For a guide and recipes on how to configure / customize this project,<br>
    check out the
    <a
      href="https://github.com/cawa-93/vite-electron-builder"
      rel="noopener"
      target="_blank"
    >vite-electron-builder documentation</a>.
  </p>

  <p>
    <a
      href="https://vitejs.dev/guide/features.html"
      target="_blank"
    >Vite Documentation</a> |
    <a
      href="https://v3.vuejs.org/"
      target="_blank"
    >Vue 3 Documentation</a>
  </p>

  <hr>
  <p class="server-status">
    The server is <code>{{ serverOn ? 'ON' : 'OFF' }}</code>.
  </p>
  <button @click="toggleServer">
    turn server {{ serverOn ? 'off' : 'on' }}
  </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useElectron} from '/@/use/electron';

const {launchServer, killServer, pingServer, statusServer} = useElectron();

export default defineComponent({
  name: 'HelloWorld',
  data() {
    return {
      serverOn: false,
    };
  },
  mounted() {
    this.checkServer();
    statusServer((e, status) => {
      this.serverOn = status.on;
    });
  },
  methods: {
    async checkServer() {
      const response = await pingServer();
      if (response.data === 'pong' && response.status === 200) this.serverOn = true;
      else this.serverOn = false;
    },
    toggleServer() {
      if (!this.serverOn) launchServer();
      else killServer();
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
p.server-status {
  font-size: 24px;
}
</style>
