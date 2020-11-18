<template>
  <a-layout id="layout-trigger">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      style="background: #fafafa"
    >
      <div class="logo" />
      <menu-unfold-outlined
        v-if="collapsed"
        class="trigger"
        @click="() => (collapsed = !collapsed)"
      />
      <menu-fold-outlined
        v-else
        class="trigger"
        @click="() => (collapsed = !collapsed)"
      />
      <a-menu theme="light" mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="1">
          <user-outlined />
          <span>nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span>nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span>nav 3</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content :class="comicList">
        Content
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  // import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
  import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  } from '@ant-design/icons-vue';
  export default defineComponent({
    name: 'Home',
    components: {
      UserOutlined,
      VideoCameraOutlined,
      UploadOutlined,
      MenuUnfoldOutlined,
      MenuFoldOutlined,
    },
    setup() {
      const selectedKeys = ref(['1']);
      const collapsed = ref(false);
      const comicList = ref('comic-list');

      return {
        selectedKeys,
        collapsed,
        comicList,
      };
    },
  });
</script>

<style scoped>
  #layout-trigger {
    height: 100%;
  }

  #layout-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #layout-trigger .trigger:hover {
    color: #1890ff;
  }

  .comic-list {
    margin-left: '16px';
    margin-right: '16px';
    padding: '24px';
    background: '#fff';
    min-height: '280px';
  }
</style>
