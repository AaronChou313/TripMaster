<template>
  <div id="app">
    <header class="app-header">
      <h1>TripMaster 旅行规划助手</h1>
      <nav class="nav-menu">
        <router-link to="/pois" class="nav-link">地点管理</router-link>
        <router-link to="/itinerary" class="nav-link">行程规划</router-link>
        <router-link to="/budget" class="nav-link">预算管理</router-link>
        <router-link to="/memos" class="nav-link">备忘事项</router-link>
      </nav>
      <!-- <div class="data-actions">
        <button @click="exportData" class="btn btn-secondary">导出数据</button>
        <label class="btn btn-secondary">
          导入数据
          <input type="file" @change="importData" accept=".json" style="display: none;">
        </label>
      </div> -->
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <Notification />
  </div>
</template>

<script>
import { ref } from 'vue';
import Notification from './components/Notification.vue';

export default {
  name: 'App',
  components: {
    Notification
  },
  setup() {
    const exportData = async () => {
      try {
        const [poisRes, itinerariesRes, budgetsRes] = await Promise.all([
          fetch('/api/pois'),
          fetch('/api/itineraries'),
          fetch('/api/budgets')
        ]);

        if (poisRes.ok && itinerariesRes.ok && budgetsRes.ok) {
          const [pois, itineraries, budgets] = await Promise.all([
            poisRes.json(),
            itinerariesRes.json(),
            budgetsRes.json()
          ]);

          const exportData = {
            pois,
            itineraries,
            budgets,
            exportTime: new Date().toISOString(),
            version: '1.0'
          };

          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `tripmaster-export-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          
          window.notificationService?.showSuccess('数据导出成功！');
        } else {
          window.notificationService?.showError('导出失败，请重试');
        }
      } catch (error) {
        console.error('Export failed:', error);
        window.notificationService?.showError('导出失败，请重试');
      }
    };

    const importData = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importData = JSON.parse(text);

        // 验证数据结构
        if (!importData.pois || !importData.itineraries || !importData.budgets) {
          window.notificationService?.showError('数据格式不正确');
          return;
        }

        // 逐个导入数据
        const importPromises = [];

        // 导入POIs
        importData.pois.forEach(poi => {
          importPromises.push(
            fetch('/api/pois', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(poi)
            })
          );
        });

        // 导入Itineraries
        importData.itineraries.forEach(itin => {
          importPromises.push(
            fetch('/api/itineraries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(itin)
            })
          );
        });

        // 导入Budgets
        importData.budgets.forEach(budget => {
          importPromises.push(
            fetch('/api/budgets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(budget)
            })
          );
        });

        await Promise.all(importPromises);
        
        window.notificationService?.showSuccess('数据导入成功！页面将刷新以应用更改。');
        setTimeout(() => {
          location.reload();
        }, 1500);
      } catch (error) {
        console.error('Import failed:', error);
        window.notificationService?.showError('导入失败，请检查文件格式');
      }

      // 重置文件输入
      event.target.value = '';
    };

    return {
      exportData,
      importData
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.app-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 0.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.data-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.app-main {
  padding: 0.5rem 2rem;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 添加Notification组件的全局样式 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>