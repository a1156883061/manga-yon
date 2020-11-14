import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import * as config from './config';

// import { Button, DatePicker } from 'ant-design-vue';
// import 'ant-design-vue/lib/button/style/css';
// import 'ant-design-vue/lib/date-picker/style/css.js';
// import 'ant-design-vue/dist/antd.css';

const Application = createApp(App);

config.registerComponents(Application);
Application.use(store)
  .use(router)
  .mount('#app');
