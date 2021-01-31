<template>
  <div class="container">
    <div class="content resize">
      <div
        v-for="(comic, index) in comics.path"
        :key="index"
        class="img-container"
      >
        <img :src="comic" :alt="comic" class="comic-img" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Comic, IpcMsg } from '@/interface';
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const comics: Comic = reactive({
        path: [],
        title: '',
      });
      async function getComicPath() {
        const winId = new URL(window.location.href).searchParams.get('winId');
        window.ipcRenderer
          .invoke('get-comic', Number(winId))
          .then((returnData: IpcMsg) => {
            if (returnData.code == 0) {
              comics.path = returnData.data;
              return;
            }
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

  .container {
    display: flex;
    justify-content: center;
    background: #292d3e;
  }

  .content {
    width: 90%;
    max-width: 98%;
    min-width: 300px;
  }

  .resize {
    position: relative;
  }

  .resize::before {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    width: 3px;
    height: 100vh;
    background: red;
  }
</style>
