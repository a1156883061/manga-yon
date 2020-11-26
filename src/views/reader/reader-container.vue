<template>
  <div class="container">
    <div
      v-for="(comic, index) in comics.path"
      :key="index"
      class="img-container"
    >
      <img :src="comic" :alt="comic" class="comic-img" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Comic, IpcMsg } from '@/interface';
  // import { ipcRenderer } from 'electron';
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const comics: Comic = reactive({
        path: [],
        title: '',
      });
      async function getComicPath() {
        const winId = await window.ipcRenderer.invoke('get-win-id');
        window.ipcRenderer
          // eslint-disable-next-line no-undef
          .invoke(String(winId))
          .then((returnData: IpcMsg) => {
            if (returnData.code == 0) {
              comics.path = returnData.data;
              return;
            }
            getComicPath();
          });
      }
      getComicPath();
      return {
        comics,
      };
    },
  });
</script>

<style scoped>
  .comic-img {
    width: 100%;
  }
</style>
