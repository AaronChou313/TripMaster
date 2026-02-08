# 旅行规划大师 TripMaster

一个基于Vue 3和Node.js的旅行规划Web应用，集成高德地图API，帮助用户轻松规划旅行路线和管理预算。

## 功能特性

### 🗺️ 景点筛选界面
- **地图搜索**：通过搜索框查找景点，在地图上直观显示搜索结果
- **兴趣点管理**：一键添加/移除兴趣点，实时更新列表
- **交互体验**：点击搜索结果自动定位地图，支持快速添加到兴趣点

### 📋 行程规划界面
- **行程管理**：创建、编辑、删除和排序多个行程
- **智能规划**：拖拽式景点排序，自动生成最优路线
- **详细信息**：为每个景点添加描述和预算信息
- **路线可视化**：实时在地图上显示行程路线

### 💰 预算管理界面
- **分类预算**：景点、交通、住宿等多类别预算管理
- **数据同步**：自动从行程中同步景点预算
- **可视化统计**：饼图和柱状图展示预算分布
- **灵活调整**：支持手动添加和修改各类预算

### 📝 备忘事项界面
- **Markdown编辑**：支持Markdown语法的富文本编辑器
- **实时预览**：编辑时可随时切换预览模式查看效果
- **快捷工具栏**：提供常用Markdown语法快捷插入按钮
- **分类管理**：可创建多个备忘录，按时间排序管理
- **数据持久化**：备忘录内容自动保存到本地JSON文件

### 📤 数据导出导入
- **完整备份**：一键导出所有规划数据为JSON文件
- **无缝迁移**：支持导入历史数据继续规划
- **离线使用**：无需网络连接即可查看已有数据

## 技术架构

### 前端技术栈
- **Vue 3**：现代化的渐进式JavaScript框架
- **Vue Router 4**：官方路由管理器
- **高德地图API**：强大的地图服务和地点搜索
- **Webpack 5**：模块打包工具

### 后端技术栈
- **Node.js + Express**：轻量级Web应用框架
- **RESTful API**：标准化的接口设计
- **JSON文件存储**：简单可靠的本地数据持久化

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/trip-master.git
cd trip-master
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的高德地图API密钥：
```env
AMAP_API_KEY=your_amap_api_key_here
AMAP_API_URL=https://restapi.amap.com/v3
PORT=3000
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 `http://localhost:8080`

### 生产部署

1. **构建前端**
```bash
npm run build
```

2. **启动生产服务器**
```bash
npm start
```

访问 `http://localhost:3000`

## 项目结构

```
trip-master/
├── src/                    # 前端源码
│   ├── views/             # 页面组件
│   │   ├── PoisView.vue   # 景点筛选界面
│   │   ├── ItineraryView.vue # 行程规划界面
│   │   ├── BudgetView.vue # 预算管理界面
│   │   └── MemosView.vue  # 备忘事项界面
│   ├── App.vue           # 主应用组件
│   └── main.js           # 应用入口
├── public/               # 静态资源
├── data/                 # 数据存储目录
│   ├── pois.json        # 兴趣点数据
│   ├── itineraries.json # 行程数据
│   ├── budgets.json     # 预算数据
│   └── memos.json       # 备忘录数据
├── server.js            # 后端服务器
├── webpack.config.js    # Webpack配置
└── package.json         # 项目配置
```

## API接口文档

### 兴趣点管理
- `GET /api/pois` - 获取所有兴趣点
- `POST /api/pois` - 添加兴趣点
- `DELETE /api/pois/:id` - 删除兴趣点

### 行程管理
- `GET /api/itineraries` - 获取所有行程
- `POST /api/itineraries` - 创建行程
- `PUT /api/itineraries/:id` - 更新行程
- `DELETE /api/itineraries/:id` - 删除行程

### 预算管理
- `GET /api/budgets` - 获取所有预算
- `POST /api/budgets` - 添加预算
- `PUT /api/budgets/:id` - 更新预算
- `DELETE /api/budgets/:id` - 删除预算

### 备忘录管理
- `GET /api/memos` - 获取所有备忘录
- `POST /api/memos` - 创建备忘录
- `PUT /api/memos/:id` - 更新备忘录
- `DELETE /api/memos/:id` - 删除备忘录

### 数据管理
- `GET /api/export` - 导出所有数据
- `POST /api/import` - 导入数据

### 地图服务
- `GET /api/amap/place/text` - 搜索地点（代理高德API）

## 使用指南

### 景点筛选
1. 在搜索框输入景点关键词
2. 查看左侧搜索结果列表和地图标记
3. 点击"+"按钮将景点添加到兴趣点
4. 在右侧管理您的兴趣点列表

### 行程规划
1. 点击"新建行程"创建行程
2. 从兴趣点列表中添加景点到行程
3. 调整景点顺序和添加详细信息
4. 在地图上查看生成的路线
5. 切换编辑/预览模式查看不同视图

### 预算管理
1. 点击"从行程同步"自动导入景点预算
2. 手动添加交通、住宿等其他预算
3. 查看饼图了解预算分布
4. 通过柱状图监控各项支出

### 备忘事项
1. 点击"新建备忘录"创建新的备忘事项
2. 在编辑器中输入标题和内容（支持Markdown语法）
3. 使用工具栏快捷插入常用格式
4. 点击"预览"按钮查看渲染效果
5. 备忘录自动保存，可随时查看和编辑

### 数据备份
1. 点击导航栏"导出数据"保存当前规划
2. 使用"导入数据"恢复历史规划
3. 导出文件包含所有兴趣点、行程、预算和备忘录信息

## 注意事项

- 请妥善保管您的高德地图API密钥
- 数据存储在本地JSON文件中，请定期备份重要数据
- 建议在现代浏览器中使用以获得最佳体验
- 如遇API调用限制，请检查高德地图开发者控制台

## 贡献指南

欢迎提交Issue和Pull Request来改进项目！

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解更多详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至：zhoumy0313@gmail.com

---

✨ 享受您的智能旅行规划之旅！