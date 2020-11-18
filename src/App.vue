<template>
  <a-config-provider :locale="locale">
    <div id="nav">
      <router-view v-slot="{ Component }">
        <keep-alive include="HelloWorld">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </a-config-provider>
</template>

<script lang="ts">
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import moment from 'moment';
  import 'moment/dist/locale/zh-cn';
  import { defineComponent, ref, watch } from 'vue';

  moment.locale('zhCN');

  export default defineComponent({
    setup() {
      const locale = ref(zhCN);
      watch(locale, (newValue) => {
        moment.locale(newValue.locale);
      });
      return {
        locale,
      };
    },
  });
</script>

<style lang="less">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }

  #nav {
    padding-top: 16px;
    height: 100%;
  }
</style>
