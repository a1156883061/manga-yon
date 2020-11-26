import { createApp } from 'vue';
import reader from './reader.vue';
// import router from './router';
// import store from './store';

const Application = createApp(reader);

Application.mount('#app');
