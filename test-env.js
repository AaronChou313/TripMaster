// 测试环境变量加载
require('dotenv').config();

console.log('=== 环境变量测试 ===');
console.log('process.env.VITE_AMAP_KEY:', process.env.VITE_AMAP_KEY);
console.log('所有环境变量:', Object.keys(process.env).filter(key => key.includes('AMAP') || key.startsWith('VITE_')));
console.log('==================');