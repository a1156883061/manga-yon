<template>
  <div
    ref="container"
    class="container"
    :style="{ cursor: resizeState }"
    @mousemove.passive="resize"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div
      class="resize-bar left-resize-bar"
      @mousedown="dragStart(-1)"
      @dragstart.prevent
    ></div>
    <div class="content" :style="{ width: contentWidth + 'px' }">
      <div
        v-for="(comic, index) in comics.path"
        :key="index"
        class="img-container"
      >
        <img :src="comic" :alt="comic" class="comic-img" />
      </div>
    </div>
    <div
      class="resize-bar right-resize-bar"
      @mousedown="dragStart"
      @dragstart.prevent
    ></div>
  </div>
</template>

<script lang="ts">
  import { Comic, IpcMsg } from '@/interface';
  import request from '@/util/request';
  import { defineComponent, onMounted, reactive, Ref, ref } from 'vue';

  /**默认宽度百分比 */
  const WIDTH_PERCENT = 0.9;

  export default defineComponent({
    setup() {
      /** 显示的漫画数据 */
      const comics: Comic = reactive({
        path: [],
        title: '',
      });
      /** 显示宽度 */
      const contentWidth = ref(0);
      const dragFlag = ref(false);
      const direction = ref(1);
      const resizeState = ref('unset');
      const container = (ref(null) as unknown) as Ref<HTMLDivElement>;
      /**
       * 获取漫画的地址
       */
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
      /**
       * 初始化宽度
       */
      async function initWidth() {
        const width = container.value.getBoundingClientRect().width;
        try {
          let widthPercent = await request('reader/get-width');
          if (widthPercent > WIDTH_PERCENT) {
            widthPercent = WIDTH_PERCENT;
          }
          contentWidth.value = width * widthPercent;
        } catch {
          contentWidth.value = width * WIDTH_PERCENT;
        }
      }
      /**
       * 鼠标拖动改变宽度
       */
      function resize(mouseEvent: MouseEvent) {
        if (dragFlag.value) {
          if (mouseEvent.buttons != 1) {
            return;
          }
          console.log('dir', direction.value);
          console.log('mouse', mouseEvent);
          contentWidth.value += mouseEvent.movementX * 1.55 * direction.value;
          console.log('width', contentWidth.value);
        }
      }
      /**
       * 拖动开始回调函数
       * @param _e 事件
       * @param dir 拖动的方向
       */
      function dragStart(_e: Event, dir = 1) {
        direction.value = dir;
        dragFlag.value = true;
        resizeState.value = 'ew-resize';
      }

      function saveWidth() {
        // 获取宽度百分比
        const widthPercent =
          contentWidth.value / container.value.getBoundingClientRect().width;
        console.table({
          parentWidth: container.value.getBoundingClientRect().width,
          contentWidth,
          percent: widthPercent,
        });
        request('reader/save-width', widthPercent);
      }

      function dragEnd() {
        // 保存函数在更改宽度时才执行
        if (dragFlag.value) {
          saveWidth();
        }
        dragFlag.value = false;
        resizeState.value = 'unset';
      }
      getComicPath();
      onMounted(() => {
        initWidth();
      });
      return {
        comics,
        contentWidth,
        dragFlag,
        initWidth,
        resizeState,
        container,
        resize,
        dragStart,
        dragEnd,
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
    user-select: none;
  }

  .resize {
    position: relative;
  }

  .left-resize-bar,
  .right-resize-bar {
    content: '';
    display: block;
    width: 3px;
    cursor: col-resize;
    cursor: ew-resize;
    background: red;
  }

  .right-resize-bar {
    left: 0;
  }
</style>
