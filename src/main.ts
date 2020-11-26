import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import * as config from './config';

const Application = createApp(App);

config.registerComponents(Application);
Application.use(store)
  .use(router)
  .mount('#app');
