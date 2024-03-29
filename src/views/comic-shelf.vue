<template>
  <div class="container">
    <a-card class="mo-card">
      <a-card-grid class="mo-card-grid mo-card-grid-add">
        <div class="open-file-btn ant-btn" @click="addComic()">
          <icon-comic-shelf style="text-align:center" />
        </div>
        <div class="open-file-btn ant-btn" @click="addComicFolder">
          <folder-open-filled style="text-align:center;font-size: 50px" />
        </div>
      </a-card-grid>
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
    </a-card>
  </div>
</template>

<script lang="ts">
  import { DeleteFilled, FolderOpenFilled } from '@ant-design/icons-vue';
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
    components: { iconComicShelf, DeleteFilled, FolderOpenFilled },
    setup() {
      const comicSources = reactive<ComicSourceLoad[]>([]);
      async function addComic(
        channel: 'add-comic' | 'add-comic-folder' = 'add-comic'
      ) {
        const index = 0;
        comicSources.unshift({
          id: 0,
          isLoading: true,
          showActionFlag: false,
          path: [''],
          coverPath: '',
          title: '',
        });
        try {
          const newComic = ((await request(channel)) as unknown) as
            | ComicSourceLoad
            | ComicSourceLoad[];
          comicSources[index] = reactive(comicSources[index]);
          comicSources[index].isLoading = false;
          // 添加失败，删除占位元素
          if (typeof newComic == 'boolean') {
            comicSources.splice(index, 1);
            return;
          }
          if (!(newComic instanceof Array)) {
            newComic.isLoading = false;
            newComic.coverPath = newComic.path[0];
            comicSources[index] = newComic;
            return;
          }
          if (newComic.length > 0) {
            comicSources.splice(index, 1);
            newComic
              .map((eachComic) => {
                return Object.assign(eachComic, {
                  isLoading: false,
                  coverPath: eachComic.path[0],
                });
              })
              .forEach((eachComic) => comicSources.unshift(eachComic));
          } else {
            comicSources.splice(index, 1);
          }
        } catch {
          comicSources.splice(index, 1);
        }
      }

      /**
       * 从文件夹中添加漫画
       */
      async function addComicFolder() {
        addComic('add-comic-folder');
      }

      async function getComics() {
        const comics = (await request('get-store-comic')) as ComicSourceLoad[];
        comics.forEach((each) => {
          each.isLoading = false;
        });
        comicSources.push(...comics);
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
          console.error('delete fail');
        }
      }
      getComics();
      return {
        comicSources,
        addComic,
        addComicFolder,
        readComic,
        showContext,
        deleteComic,
      };
    },
  });
</script>

<style scoped>
  .container {
    /* background: linear-gradient(to right top, #65dfc9, #6cdbeb); */
    background: #f0f2f5;
  }

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
    background: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.3)
    );
    /* background-color: #b0b5be; */
  }

  /* .mo-card-grid:nth-child(2n) {
    background-color: #8a919e;
    background: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.3)
    );
  } */
  .cover-container {
    overflow: hidden;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .cover-container img {
    width: 100%;
  }

  .mo-card-grid ::v-deep(.ant-card-meta-title) {
    text-overflow: ellipsis;
    white-space: normal;
  }

  /* 居中封面图片 */
  .mo-card-grid ::v-deep(.ant-spin-nested-loading) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 90%;
  }

  .mo-card-grid ::v-deep(.ant-spin-container) {
    height: 100%;
  }

  .mo-card-grid-add {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
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

  .open-file-btn {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
