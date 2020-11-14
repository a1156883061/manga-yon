import { Button, DatePicker } from 'ant-design-vue';
import 'ant-design-vue/lib/button/style/css';
import 'ant-design-vue/lib/date-picker/style/css.js';
import { App } from 'vue';

function registerComponents(app: App) {
  app.use(Button).use(DatePicker);
}
export { registerComponents };
