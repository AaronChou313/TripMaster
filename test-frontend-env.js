// 测试前端环境变量加载
console.log('=== 前端环境变量测试 ===');
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('VITE_AMAP_KEY:', process.env.VITE_AMAP_KEY);

// 模拟import.meta.env的行为
const importMetaEnv = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  VITE_AMAP_KEY: process.env.VITE_AMAP_KEY,
  BASE_URL: '/',
  MODE: process.env.NODE_ENV || 'development',
  DEV: process.env.NODE_ENV !== 'production',
  PROD: process.env.NODE_ENV === 'production'
};

console.log('模拟的import.meta.env:', importMetaEnv);
console.log('importMetaEnv.VITE_AMAP_KEY:', importMetaEnv.VITE_AMAP_KEY);