<template>
  <div>
    <a-card class="mo-card">
      <template v-if="comicSources != null && comicSources.length != 0">
        <a-card-grid
          class="mo-card-grid"
          v-for="(comic, index) in comicSources"
          :key="index"
          @click="readComic(comic.path, comic.title, comic.isLoading)"
        >
          <a-spin
            :spinning="comic.isLoading"
            :delay="300"
            size="large"
            class="mo-spin"
          >
            <div class="cover-container">
              <img :src="comic.coverPath" :alt="comic.title" />
            </div>
          </a-spin>
          <a-card-meta :title="comic.title"></a-card-meta>
        </a-card-grid>
      </template>
      <a-card-grid class="mo-card-grid mo-card-grid-add" @click="addComic">
        <icon-comic-shelf style="text-align:center" />
      </a-card-grid>
    </a-card>
  </div>
</template>

<script lang="ts">
  import iconComicShelf from '@/components/icon/icon-comic-shelf.vue';
  // import { ipcRenderer } from 'electron';
  import { ComicSource } from '@/interface';
  import convertToSafeFile from '@/util/convert-to-safe-file';
  import { defineComponent, reactive, ref, toRaw } from 'vue';

  interface ComicSourceLoad extends ComicSource {
    isLoading?: boolean;
  }

  export default defineComponent({
    components: { iconComicShelf },
    setup() {
      const comicSources = reactive<ComicSourceLoad[]>([]);
      async function addComic() {
        const index = comicSources.length;
        comicSources.push({
          isLoading: true,
          path: [''],
          coverPath: '',
          title: '',
        });
        const newComic = (await window.ipcRenderer.invoke(
          'add-comic'
        )) as ComicSourceLoad;
        comicSources[index] = reactive(comicSources[index]);
        comicSources[index].isLoading = false;
        if (typeof newComic == 'boolean') {
          comicSources.splice(index, 1);
          return;
        }
        newComic.coverPath = convertToSafeFile(newComic.coverPath);
        newComic.isLoading = false;
        for (let index = 0; index < newComic.path.length; index++) {
          newComic.path[index] = convertToSafeFile(newComic.path[index]);
        }
        comicSources[index] = newComic;
      }
      async function getComics() {
        console.log('get comics is coding');
      }
      function readComic(
        comicPaths: string[],
        title: string,
        isLoading?: boolean
      ) {
        console.log('is loading', isLoading);
        if (isLoading || isLoading == undefined) {
          return;
        }
        window.ipcRenderer.invoke('read-comic', toRaw(comicPaths), title);
      }
      getComics();
      return {
        comicSources,
        addComic,
        readComic,
      };
    },
  });
</script>

<style scoped>
  .mo-card {
    background-color: transparent;
  }

  .mo-card ::v-deep(.ant-card-body) {
    display: grid;
    grid-template-columns: repeat(auto-fill, 320px);
    justify-content: center;
  }

  .mo-card ::v-deep(.ant-card-body::before) {
    content: none;
  }
  .mo-card-grid {
    cursor: pointer;
    user-select: none;
    width: 320px;
    height: 510px;
    background-color: #b0b5be;
  }

  .mo-card-grid:nth-child(2n) {
    background-color: #8a919e;
  }
  .cover-container {
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .cover-container img {
    width: 100%;
  }

  .mo-card-grid ::v-deep(.ant-card-meta-title) {
    text-overflow: ellipsis;
    white-space: normal;
  }

  .mo-card-grid-add {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mo-card-grid ::v-deep(.ant-spin-nested-loading) {
    height: 90%;
  }
</style>
