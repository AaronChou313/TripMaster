<template>
  <div class="budget-container">
    <!-- <h1 class="page-title">预算管理</h1> -->
    
    <div class="budget-content">
      <!-- 左侧预算分类 -->
      <div class="budget-categories">
        <div class="category-section">
          <div class="section-header">
            <h2>行程预算</h2>
            <button @click="syncFromItineraries" class="btn btn-secondary">从行程同步</button>
          </div>
          <div class="budget-items">
            <div 
              v-for="item in itineraryBudgets" 
              :key="item.id"
              class="budget-item"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description || '无描述' }}</p>
              </div>
              <div class="item-amount">
                ¥{{ item.amount?.toLocaleString() || 0 }}
              </div>
              <div class="item-actions">
                <button @click="editBudget(item)" class="btn-icon edit">✏️</button>
                <button @click="deleteBudget(item.id)" class="btn-icon delete">🗑️</button>
              </div>
            </div>
          </div>
          <div class="category-total">
            小计: ¥{{ itineraryTotal.toLocaleString() }}
          </div>
        </div>
        
        <div class="category-section">
          <div class="section-header">
            <h2>交通预算</h2>
            <button @click="addTransportBudget" class="btn btn-primary">+ 添加</button>
          </div>
          <div class="budget-items">
            <div 
              v-for="item in transportBudgets" 
              :key="item.id"
              class="budget-item"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description || '无描述' }}</p>
              </div>
              <div class="item-amount">
                ¥{{ item.amount?.toLocaleString() || 0 }}
              </div>
              <div class="item-actions">
                <button @click="editBudget(item)" class="btn-icon edit">✏️</button>
                <button @click="deleteBudget(item.id)" class="btn-icon delete">🗑️</button>
              </div>
            </div>
          </div>
          <div class="category-total">
            小计: ¥{{ transportTotal.toLocaleString() }}
          </div>
        </div>
        
        <div class="category-section">
          <div class="section-header">
            <h2>住宿预算</h2>
            <button @click="addAccommodationBudget" class="btn btn-primary">+ 添加</button>
          </div>
          <div class="budget-items">
            <div 
              v-for="item in accommodationBudgets" 
              :key="item.id"
              class="budget-item"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description || '无描述' }}</p>
              </div>
              <div class="item-amount">
                ¥{{ item.amount?.toLocaleString() || 0 }}
              </div>
              <div class="item-actions">
                <button @click="editBudget(item)" class="btn-icon edit">✏️</button>
                <button @click="deleteBudget(item.id)" class="btn-icon delete">🗑️</button>
              </div>
            </div>
          </div>
          <div class="category-total">
            小计: ¥{{ accommodationTotal.toLocaleString() }}
          </div>
        </div>
        
        <div class="category-section">
          <div class="section-header">
            <h2>其他预算</h2>
            <button @click="addCustomBudget" class="btn btn-primary">+ 添加</button>
          </div>
          <div class="budget-items">
            <div 
              v-for="item in customBudgets" 
              :key="item.id"
              class="budget-item"
            >
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description || '无描述' }}</p>
              </div>
              <div class="item-amount">
                ¥{{ item.amount?.toLocaleString() || 0 }}
              </div>
              <div class="item-actions">
                <button @click="editBudget(item)" class="btn-icon edit">✏️</button>
                <button @click="deleteBudget(item.id)" class="btn-icon delete">🗑️</button>
              </div>
            </div>
          </div>
          <div class="category-total">
            小计: ¥{{ customTotal.toLocaleString() }}
          </div>
        </div>
      </div>
      
      <!-- 右侧图表和总预算区域 -->
      <div class="budget-sidebar">
        <!-- 总预算卡片 -->
        <div class="total-budget-card">
          <div class="budget-card">
            <h2>总预算</h2>
            <div class="amount">¥{{ totalBudget.toLocaleString() }}</div>
          </div>
        </div>
        
        <!-- 图表区域 -->
        <div class="budget-charts">
          <div class="chart-section">
            <h2>预算分布</h2>
            <canvas ref="pieChartRef" class="chart-canvas"></canvas>
          </div>
          
          <div class="chart-section">
            <h2>预算趋势</h2>
            <canvas ref="barChartRef" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 编辑模态框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingBudget?.id ? '编辑预算' : '添加预算' }}</h2>
        <form @submit.prevent="saveBudget">
          <div class="form-group">
            <label>项目名称</label>
            <input v-model="editingBudget.name" required class="form-input">
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="editingBudget.description" class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>金额</label>
            <input v-model.number="editingBudget.amount" type="number" required class="form-input">
          </div>
          <div class="form-group">
            <label>类别</label>
            <select v-model="editingBudget.category" class="form-select">
              <option value="itinerary">行程</option>
              <option value="transport">交通</option>
              <option value="accommodation">住宿</option>
              <option value="custom">其他</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="btn btn-secondary">取消</button>
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';

export default {
  name: 'BudgetView',
  setup() {
    // 响应式数据
    const budgets = ref([]);
    const showEditModal = ref(false);
    const editingBudget = ref({});
    const pieChartRef = ref(null);
    const barChartRef = ref(null);
    let pieChart = null;
    let barChart = null;

    // 计算属性
    const itineraryBudgets = computed(() => 
      budgets.value.filter(b => b.category === 'itinerary')
    );
    
    const transportBudgets = computed(() => 
      budgets.value.filter(b => b.category === 'transport')
    );
    
    const accommodationBudgets = computed(() => 
      budgets.value.filter(b => b.category === 'accommodation')
    );
    
    const customBudgets = computed(() => 
      budgets.value.filter(b => b.category === 'custom')
    );
    
    const itineraryTotal = computed(() => 
      itineraryBudgets.value.reduce((sum, b) => sum + (b.amount || 0), 0)
    );
    
    const transportTotal = computed(() => 
      transportBudgets.value.reduce((sum, b) => sum + (b.amount || 0), 0)
    );
    
    const accommodationTotal = computed(() => 
      accommodationBudgets.value.reduce((sum, b) => sum + (b.amount || 0), 0)
    );
    
    const customTotal = computed(() => 
      customBudgets.value.reduce((sum, b) => sum + (b.amount || 0), 0)
    );
    
    const totalBudget = computed(() => 
      itineraryTotal.value + transportTotal.value + accommodationTotal.value + customTotal.value
    );

    // 从行程同步预算（按行程统计）
    const syncFromItineraries = async () => {
      try {
        const response = await fetch('/api/itineraries');
        if (response.ok) {
          const itineraries = await response.json();
          let syncedCount = 0;
          
          // 先清空现有的行程预算
          budgets.value = budgets.value.filter(b => b.category !== 'itinerary');
          
          itineraries.forEach(itin => {
            if (itin.pois && itin.pois.length > 0) {
              // 计算该行程的总预算（景点预算 + 交通预算）
              let itineraryTotalBudget = 0;
              
              // 计算景点预算
              itin.pois.forEach(poi => {
                if (poi.budget > 0) {
                  itineraryTotalBudget += poi.budget;
                }
              });
              
              // 计算交通预算
              itin.pois.forEach((poi, index) => {
                if (index < itin.pois.length - 1 && poi.transport && poi.transport.budget > 0) {
                  itineraryTotalBudget += poi.transport.budget;
                }
              });
              
              // 如果总预算大于0，则添加到行程预算中
              if (itineraryTotalBudget > 0) {
                budgets.value.push({
                  id: `itinerary_${itin.id}`,
                  name: itin.name || `行程-${itin.id}`,
                  description: itin.description || `日期: ${itin.date || '未设置'}`,
                  amount: itineraryTotalBudget,
                  category: 'itinerary',
                  sourceType: 'itinerary',
                  sourceId: itin.id,
                  createdAt: new Date().toISOString()
                });
                syncedCount++;
              }
            }
          });
          
          if (syncedCount > 0) {
            await saveBudgets();
            window.notificationService?.showSuccess(`成功同步了 ${syncedCount} 个行程预算`);
          } else {
            window.notificationService?.showInfo('没有需要同步的行程预算');
          }
        }
      } catch (error) {
        console.error('同步失败:', error);
        window.notificationService?.showError('同步失败，请重试');

      }
    };

    // 添加交通预算
    const addTransportBudget = () => {
      editingBudget.value = {
        id: null,
        name: '',
        description: '',
        amount: 0,
        category: 'transport'
      };
      showEditModal.value = true;
    };

    // 添加住宿预算
    const addAccommodationBudget = () => {
      editingBudget.value = {
        id: null,
        name: '',
        description: '',
        amount: 0,
        category: 'accommodation'
      };
      showEditModal.value = true;
    };

    // 添加自定义预算
    const addCustomBudget = () => {
      editingBudget.value = {
        id: null,
        name: '',
        description: '',
        amount: 0,
        category: 'custom'
      };
      showEditModal.value = true;
    };

    // 编辑预算
    const editBudget = (budget) => {
      editingBudget.value = { ...budget };
      showEditModal.value = true;
    };

    // 保存预算
    const saveBudget = async () => {
      try {
        let response;
        const budgetData = { ...editingBudget.value };
        
        if (budgetData.id) {
          // 更新现有预算
          response = await fetch(`/api/budgets/${budgetData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budgetData)
          });
        } else {
          // 创建新预算
          budgetData.id = Date.now().toString();
          budgetData.createdAt = new Date().toISOString();
          response = await fetch('/api/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budgetData)
          });
        }

        if (response.ok) {
          await loadBudgets();
          closeEditModal();
          window.notificationService?.showSuccess('预算保存成功！', 8000);
        }
      } catch (error) {
        console.error('预算保存失败:', error);
        window.notificationService?.showError('保存失败，请重试', 8000);
      }
    };

    // 删除预算
    const deleteBudget = async (id) => {
      // 使用非阻塞确认
      if (window.confirm('确定要删除这个预算项目吗？')) {
        try {
          const response = await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
          if (response.ok) {
            await loadBudgets();
            window.notificationService?.showSuccess('预算删除成功！', 8000);
          }
        } catch (error) {
          console.error('删除失败:', error);
          window.notificationService?.showError('删除失败，请重试', 8000);
        }
      }
    };

    // 关闭编辑模态框
    const closeEditModal = () => {
      showEditModal.value = false;
      editingBudget.value = {};
    };

    // 保存所有预算
    const saveBudgets = async () => {
      try {
        // 这里可以批量保存所有预算
        // 为了简化，逐个保存
        for (const budget of budgets.value) {
          if (!budget.createdAt) {
            await fetch('/api/budgets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(budget)
            });
          }
        }
      } catch (error) {
        console.error('预算保存失败:', error);
      }
    };

    // 加载预算数据
    const loadBudgets = async () => {
      try {
        const response = await fetch('/api/budgets');
        if (response.ok) {
          budgets.value = await response.json();
        }
      } catch (error) {
        console.error('预算加载失败:', error);
      }
    };

    // 绘制饼图
    const drawPieChart = () => {
      if (!pieChartRef.value) return;

      const ctx = pieChartRef.value.getContext('2d');
      const centerX = pieChartRef.value.width / 2;
      const centerY = pieChartRef.value.height / 2;
      const radius = Math.min(centerX, centerY) - 50;

      // 清除画布
      ctx.clearRect(0, 0, pieChartRef.value.width, pieChartRef.value.height);

      const data = [
        { label: '行程', value: itineraryTotal.value, color: '#FF6384' },
        { label: '交通', value: transportTotal.value, color: '#36A2EB' },
        { label: '住宿', value: accommodationTotal.value, color: '#4BC0C0' },
        { label: '其他', value: customTotal.value, color: '#FFCE56' }
      ];

      const total = data.reduce((sum, item) => sum + item.value, 0);
      if (total === 0) {
        // 没有数据时显示文本
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('暂无预算数据', centerX, centerY);
        return;
      }

      let startAngle = 0;
      
      data.forEach(item => {
        if (item.value <= 0) return;
        
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // 绘制标签
        const midAngle = startAngle + sliceAngle / 2;
        const labelX = centerX + (radius + 30) * Math.cos(midAngle);
        const labelY = centerY + (radius + 30) * Math.sin(midAngle);
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.label}: ${Math.round((item.value/total)*100)}%`, labelX, labelY);
        
        startAngle += sliceAngle;
      });
    };

    // 绘制柱状图
    const drawBarChart = () => {
      if (!barChartRef.value) return;

      const ctx = barChartRef.value.getContext('2d');
      const width = barChartRef.value.width;
      const height = barChartRef.value.height;
      
      // 清除画布
      ctx.clearRect(0, 0, width, height);

      const data = [
        { label: '行程', value: itineraryTotal.value, color: '#FF6384' },
        { label: '交通', value: transportTotal.value, color: '#36A2EB' },
        { label: '住宿', value: accommodationTotal.value, color: '#4BC0C0' },
        { label: '其他', value: customTotal.value, color: '#FFCE56' }
      ];

      const maxValue = Math.max(...data.map(d => d.value));
      if (maxValue === 0) {
        // 没有数据时显示文本
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('暂无预算数据', width/2, height/2);
        return;
      }

      const barWidth = width / (data.length + 1);
      const chartHeight = height - 60;
      
      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = (index + 1) * barWidth - barWidth/2;
        const y = height - 40 - barHeight;
        
        // 绘制柱子
        ctx.fillStyle = item.color;
        ctx.fillRect(x - 20, y, 40, barHeight);
        
        // 绘制数值
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`¥${item.value.toLocaleString()}`, x, y - 5);
        
        // 绘制标签
        ctx.fillText(item.label, x, height - 20);
      });
    };

    // 组件挂载时初始化
    onMounted(async () => {
      await loadBudgets();
      
      // 自动同步行程预算
      await syncFromItineraries();
      
      // 初始化图表
      nextTick(() => {
        if (pieChartRef.value) {
          pieChartRef.value.width = pieChartRef.value.offsetWidth;
          pieChartRef.value.height = 300;
        }
        if (barChartRef.value) {
          barChartRef.value.width = barChartRef.value.offsetWidth;
          barChartRef.value.height = 300;
        }
        
        drawPieChart();
        drawBarChart();
      });
    });

    // 监听预算变化，重新绘制图表
    const watchBudgets = () => {
      drawPieChart();
      drawBarChart();
    };

    return {
      budgets,
      showEditModal,
      editingBudget,
      pieChartRef,
      barChartRef,
      itineraryBudgets,
      transportBudgets,
      accommodationBudgets,
      customBudgets,
      itineraryTotal,
      transportTotal,
      accommodationTotal,
      customTotal,
      totalBudget,
      syncFromItineraries,
      addTransportBudget,
      addAccommodationBudget,
      addCustomBudget,
      editBudget,
      saveBudget,
      deleteBudget,
      closeEditModal
    };
  }
};
</script>

<style scoped>
.budget-container {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
}

.budget-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  height: calc(100vh - 150px);
}

.budget-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.budget-categories::-webkit-scrollbar {
  width: 6px;
}

.budget-categories::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.budget-categories::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.budget-categories::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.budget-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
}

/* 总预算卡片样式 */
.total-budget-card {
  flex-shrink: 0;
}

.budget-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.budget-card h2 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.amount {
  font-size: 2rem;
  font-weight: 700;
}

.budget-charts {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.budget-charts::-webkit-scrollbar {
  width: 6px;
}

.budget-charts::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.budget-charts::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.budget-charts::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.chart-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.chart-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.25rem;
}

.chart-canvas {
  width: 100%;
  height: 250px;
  background: #f8f9fa;
  border-radius: 10px;
  display: block;
}

.budget-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  color: #333;
  font-size: 1.5rem;
}

.budget-items {
  margin-bottom: 1rem;
}

.budget-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.budget-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.item-info {
  flex: 1;
}

.item-info h3 {
  color: #333;
  margin-bottom: 0.25rem;
}

.item-info p {
  color: #666;
  font-size: 0.9rem;
}

.item-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4CAF50;
  min-width: 120px;
  text-align: right;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  transform: scale(1.1);
}

.btn-icon.edit:hover {
  background: #ffc107;
  color: #333;
}

.btn-icon.delete:hover {
  background: #dc3545;
  color: white;
}

.category-total {
  font-weight: 700;
  color: #333;
  text-align: right;
  padding: 1rem;
  border-top: 2px solid #f0f0f0;
  font-size: 1.1rem;
}

.budget-charts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.chart-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.chart-canvas {
  width: 100%;
  height: 300px;
  background: #f8f9fa;
  border-radius: 10px;
  display: block;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 1200px) {
  .budget-content {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .budget-sidebar {
    order: -1;
    height: auto;
  }
  
  .budget-charts {
    overflow-y: visible;
  }
}
</style>