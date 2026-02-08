import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import PoisView from './views/PoisView.vue';
import ItineraryView from './views/ItineraryView.vue';
import BudgetView from './views/BudgetView.vue';
import MemosView from './views/MemosView.vue'; // 恢复正常使用备忘录组件

// 调试环境变量
console.log('=== 环境变量调试信息 ===');
console.log('import.meta.env:', import.meta.env);
console.log('process.env:', process.env);
console.log('VITE_AMAP_KEY:', import.meta.env.VITE_AMAP_KEY);
console.log('所有以VITE_开头的环境变量:');
Object.keys(import.meta.env).forEach(key => {
  if (key.startsWith('VITE_')) {
    console.log(`${key}:`, import.meta.env[key]);
  }
});

// 路由配置 - 恢复正常使用备忘录组件
const routes = [
  { path: '/', redirect: '/pois' },
  { path: '/pois', component: PoisView, name: 'Pois' },
  { path: '/itinerary', component: ItineraryView, name: 'Itinerary' },
  { path: '/budget', component: BudgetView, name: 'Budget' },
  { path: '/memos', component: MemosView, name: 'Memos' } // 恢复正常使用
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 创建应用实例
const app = createApp(App);
app.use(router);
app.mount('#app');

// 全局通知服务
window.notificationService = {
  showSuccess(message) {
    console.log('Success:', message);
  },
  showError(message) {
    console.log('Error:', message);
  }
};