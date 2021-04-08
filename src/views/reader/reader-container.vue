<template>
  <div
    ref="container"
    class="container"
    :style="{ cursor: resizeState }"
    @mousemove.passive="resize"
    @touchmove.passive="resize"
  >
    <div
      class="resize-bar left-resize-bar"
      @mousedown="dragStart(-1)"
      @touchstart="dragStart(-1)"
      @dragstart.prevent
    ></div>
    <div ref="content" class="content" :style="{ width: contentWidth + 'px' }">
      <div
        v-for="(comic, index) in comics.path"
        :key="index"
        class="img-container"
      >
        <img :src="comic" :alt="comic" @dragstart.prevent class="comic-img" />
      </div>
    </div>
    <div
      class="resize-bar right-resize-bar"
      @mousedown="dragStart()"
      @touchstart="dragStart()"
      @dragstart.prevent
    ></div>
  </div>
</template>

<script lang="ts">
  import { Comic } from '@/interface';
  import request from '@/util/request';
  import {
    computed,
    defineComponent,
    onMounted,
    onUnmounted,
    reactive,
    Ref,
    ref,
  } from 'vue';

  /**默认宽度百分比 */
  const WIDTH_PERCENT = 0.9;

  /** 鼠标拖动方向 */
  enum DragDirection {
    Left,
    Right,
  }

  /**鼠标事件左键 */
  const LEFT_KEY = 1;
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
      const direction = ref(DragDirection.Left);
      // const resizeState = ref('unset');
      const container = (ref(null) as unknown) as Ref<HTMLDivElement>;
      const content = (ref(null) as unknown) as Ref<HTMLDivElement>;
      const resizeState = computed(() =>
        dragFlag.value ? 'ew-resize' : 'unset'
      );
      /**拖动事件开始时当前滚动高度的百分比 */
      const scrollTopPercent = ref(0);
      /**
       * 获取漫画的地址
       */
      async function getComicPath() {
        const winId = new URL(window.location.href).searchParams.get('winId');
        request('get-comic', Number(winId)).then((returnData: string[]) => {
          comics.path = returnData;
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
      function resize(mouseEvent: MouseEvent | TouchEvent) {
        if (dragFlag.value) {
          if (
            mouseEvent instanceof MouseEvent &&
            mouseEvent.buttons != LEFT_KEY
          ) {
            return;
          }
          console.table({
            scrollTopPercent,
            height: container.value.getBoundingClientRect().height,
            scrollY: window.scrollY,
          });
          let clientX;
          if (
            mouseEvent instanceof TouchEvent &&
            mouseEvent.touches.length === 1
          ) {
            clientX = mouseEvent.touches[0].clientX;
          } else if (mouseEvent instanceof MouseEvent) {
            clientX = mouseEvent.clientX;
          } else {
            return;
          }
          const containerWidth = container.value.getBoundingClientRect().width;
          if (direction.value == DragDirection.Left) {
            contentWidth.value = containerWidth - clientX * 2 - 6;
            return;
          }
          contentWidth.value = containerWidth - (containerWidth - clientX) * 2;
          // contentWidth.value += mouseEvent.movementX * 1.55 * direction.value;
        }
      }
      /**
       * 拖动开始回调函数
       * @param _e 事件
       * @param dir 拖动的方向
       */
      function dragStart(dir = 1) {
        direction.value = dir == 1 ? DragDirection.Right : DragDirection.Left;
        dragFlag.value = true;
        scrollTopPercent.value =
          window.scrollY / container.value.getBoundingClientRect().height;
        console.table({
          scrollTopPercent,
          height: container.value.getBoundingClientRect().height,
          scrollY: window.scrollY,
        });
      }

      function saveWidth() {
        // 获取宽度百分比
        const widthPercent =
          contentWidth.value / container.value.getBoundingClientRect().width;
        request('reader/save-width', widthPercent);
      }

      function dragEnd() {
        // 保存函数在更改宽度时才执行
        if (dragFlag.value) {
          window.scrollTo({
            left: 0,
            top:
              container.value.getBoundingClientRect().height *
              scrollTopPercent.value,
            behavior: 'smooth',
          });
          saveWidth();
        }
        dragFlag.value = false;
      }
      getComicPath();
      onMounted(() => {
        initWidth();
      });
      // 清除监听
      onUnmounted(() => {
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
      });
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchend', dragEnd);
      return {
        comics,
        contentWidth,
        dragFlag,
        initWidth,
        resizeState,
        container,
        content,
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

  .resize-bar {
    content: '';
    display: block;
    cursor: col-resize;
    cursor: ew-resize;
    background: transparent;
  }

  .left-resize-bar {
    border-right: 3px red solid;
    border-left: 8px transparent solid;
  }

  .right-resize-bar {
    left: 0;
    border-left: 3px red solid;
    border-right: 8px transparent solid;
  }
</style>
