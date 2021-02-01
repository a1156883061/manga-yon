<template>
  <div>
    <a-card class="mo-card">
      <template v-if="comicSources != null && comicSources.length != 0">
        <a-card-grid
          class="mo-card-grid"
          v-for="(comic, index) in comicSources"
          :key="index"
          @click="readComic(comic.path, comic.title, comic.isLoading)"
          @contextmenu="showContext(comic)"
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
          <div class="action-container" v-if="comic.showActionFlag" @click.stop>
            <a-button type="danger" block @click="deleteComic(comic.id)">
              <template #icon>
                <delete-filled />
              </template>
            </a-button>
          </div>
        </a-card-grid>
      </template>
      <a-card-grid class="mo-card-grid mo-card-grid-add" @click="addComic">
        <icon-comic-shelf style="text-align:center" />
      </a-card-grid>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { DeleteFilled } from '@ant-design/icons-vue';
  import iconComicShelf from '@/components/icon/icon-comic-shelf.vue';
  import { ComicSource } from '@/interface';
  import request from '@/util/request';
  import { defineComponent, reactive, toRaw } from 'vue';

  interface ComicSourceLoad extends ComicSource {
    isLoading?: boolean;
    /**是否显示操作按钮 */
    showActionFlag: boolean;
  }

  export default defineComponent({
    components: { iconComicShelf, DeleteFilled },
    setup() {
      const comicSources = reactive<ComicSourceLoad[]>([]);
      async function addComic() {
        const index = comicSources.length;
        comicSources.push({
          id: 0,
          isLoading: true,
          showActionFlag: false,
          path: [''],
          coverPath: '',
          title: '',
        });
        const newComic = ((await request(
          'add-comic'
        )) as unknown) as ComicSourceLoad;
        comicSources[index] = reactive(comicSources[index]);
        comicSources[index].isLoading = false;
        if (typeof newComic == 'boolean') {
          comicSources.splice(index, 1);
          return;
        }
        newComic.isLoading = false;
        newComic.coverPath = newComic.path[0];
        comicSources[index] = newComic;
      }
      async function getComics() {
        const comics = (await request('get-store-comic')) as ComicSourceLoad[];
        comics.forEach((each) => {
          each.isLoading = false;
          comicSources.push(each);
        });
      }
      function readComic(
        comicPaths: string[],
        title: string,
        isLoading?: boolean
      ) {
        if (isLoading || isLoading == undefined) {
          return;
        }
        request('read-comic', toRaw(comicPaths), title);
      }
      function showContext(comicPath: ComicSourceLoad) {
        comicPath.showActionFlag = !comicPath.showActionFlag;
      }
      async function deleteComic(comicId: ComicSourceLoad['id']) {
        try {
          await request('comic-delete', comicId);
          const index = comicSources.findIndex(({ id }) => id == comicId);
          comicSources.splice(index, 1);
        } catch {
          console.log('delete fail');
        }
      }
      getComics();
      return {
        comicSources,
        addComic,
        readComic,
        showContext,
        deleteComic,
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
    position: relative;
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

  .action-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 100;
    padding: 24px;
    background: rgba(138, 145, 158, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
  }
</style>
