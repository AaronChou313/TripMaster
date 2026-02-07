<template>
  <div class="itinerary-container">
    <!-- 左侧行程列表 -->
    <div class="itinerary-list-section">
      <div class="section-header">
        <h2>行程列表</h2>
        <button @click="createNewItinerary" class="btn btn-primary">+ 新建行程</button>
      </div>
      
      <div class="itinerary-list">
        <div 
          v-for="itin in itineraries" 
          :key="itin.id"
          class="itinerary-item"
          :class="{ active: selectedItinerary?.id === itin.id }"
          @click="selectItinerary(itin)"
        >
          <div class="itinerary-info">
            <h3>{{ itin.name || '未命名行程' }}</h3>
            <p>{{ itin.date || '未设置日期' }}</p>
            <span class="poi-count">{{ itin.pois?.length || 0 }} 个景点</span>
          </div>
          <div class="itinerary-actions">
            <button @click.stop="deleteItinerary(itin.id)" class="btn-icon delete">🗑️</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧主要内容区 -->
    <div class="main-content">
      <!-- 行程编辑区域 -->
      <div class="edit-section">
        <div v-if="selectedItinerary" class="itinerary-editor">
          <div class="editor-header">
            <input 
              v-model="selectedItinerary.name" 
              placeholder="行程名称"
              class="itinerary-name-input"
            >
            <input 
              v-model="selectedItinerary.date" 
              type="date"
              class="itinerary-date-input"
            >
            <div class="view-toggle">
              <button 
                @click="currentView = 'edit'"
                :class="{ active: currentView === 'edit' }"
                class="toggle-btn"
              >编辑</button>
              <button 
                @click="currentView = 'preview'"
                :class="{ active: currentView === 'preview' }"
                class="toggle-btn"
              >预览</button>
            </div>
            <button @click="saveItinerary" class="btn btn-success">保存</button>
          </div>
          
          <textarea 
            v-model="selectedItinerary.description"
            placeholder="行程描述..."
            class="itinerary-description"
          ></textarea>
          
          <!-- 编辑视图 -->
          <div v-if="currentView === 'edit'" class="edit-view">
            <div class="section-title">
              <h3>行程景点</h3>
              <span>共 {{ selectedItinerary.pois?.length || 0 }} 个</span>
            </div>
            
            <!-- 景点编辑和可用景点左右排布 -->
            <div class="pois-layout">
              <!-- 已添加的景点列表 -->
              <div class="pois-in-itinerary-section">
                <div class="pois-in-itinerary">
                  <div 
                    v-for="(poi, index) in selectedItinerary.pois" 
                    :key="poi.id"
                    class="poi-in-itinerary-item"
                  >
                    <div class="poi-order">{{ index + 1 }}</div>
                    <div class="poi-details">
                      <h4>{{ poi.name }}</h4>
                      <textarea 
                        v-model="poi.description"
                        placeholder="景点描述..."
                        class="poi-description"
                      ></textarea>
                      <input 
                        v-model.number="poi.budget"
                        type="number"
                        placeholder="预算"
                        class="poi-budget"
                      >
                      
                      <!-- 交通安排（除了最后一个景点） -->
                      <div v-if="index < selectedItinerary.pois.length - 1" class="transport-section">
                        <h5>前往下一景点的交通</h5>
                        <select v-model="poi.transport.type" class="transport-type">
                          <option value="">选择交通方式</option>
                          <option value="driving">驾车</option>
                          <option value="riding">骑行</option>
                          <option value="walking">步行</option>
                          <option value="bus">公交</option>
                          <option value="train">火车</option>
                          <option value="flight">飞机</option>
                        </select>
                        <textarea 
                          v-model="poi.transport.description"
                          placeholder="交通描述..."
                          class="transport-description"
                        ></textarea>
                        <input 
                          v-model.number="poi.transport.budget"
                          type="number"
                          placeholder="交通预算"
                          class="transport-budget"
                        >
                      </div>
                    </div>
                    <div class="poi-actions">
                      <button 
                        v-if="index > 0"
                        @click="movePoiUp(index)"
                        class="btn-icon move-up"
                      >↑</button>
                      <button 
                        v-if="index < selectedItinerary.pois.length - 1"
                        @click="movePoiDown(index)"
                        class="btn-icon move-down"
                      >↓</button>
                      <button 
                        @click="removePoiFromItinerary(index)"
                        class="btn-icon delete"
                      >×</button>
                    </div>
                  </div>
                  
                  <div v-if="!selectedItinerary.pois?.length" class="empty-state">
                    请从右侧选择景点添加到行程中
                  </div>
                </div>
              </div>
              
              <!-- 可添加的景点列表 -->
              <div class="available-pois-section">
                <div class="available-pois">
                  <h3>可添加的景点</h3>
                  <div class="available-pois-list">
                    <div 
                      v-for="poi in availablePois" 
                      :key="poi.id"
                      class="available-poi-item"
                      @click="addPoiToItinerary(poi)"
                    >
                      <span>{{ poi.name }}</span>
                      <button class="btn-icon add">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 预览视图 -->
          <div v-else class="preview-view">
            <div class="timeline">
              <div 
                v-for="(poi, index) in selectedItinerary.pois" 
                :key="poi.id"
                class="timeline-item"
              >
                <div class="timeline-marker">{{ index + 1 }}</div>
                <div class="timeline-content">
                  <h4>{{ poi.name }}</h4>
                  <p v-if="poi.description">{{ poi.description }}</p>
                  <div class="timeline-budget" v-if="poi.budget">
                    预算: ¥{{ poi.budget }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-selection">
          请选择一个行程或创建新行程
        </div>
      </div>
      
      <!-- 地图显示区域 -->
      <div class="map-section">
        <div id="itinerary-map" ref="mapContainer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue';

export default {
  name: 'ItineraryView',
  setup() {
    // 响应式数据
    const itineraries = ref([]);
    const selectedItinerary = ref(null);
    const currentView = ref('edit');
    const availablePois = ref([]);
    const mapContainer = ref(null);
    let map = null;
    let routePolyline = null;

    // 创建新行程
    const createNewItinerary = () => {
      const newItinerary = {
        id: Date.now().toString(),
        name: '',
        date: '',
        description: '',
        pois: [],
        createdAt: new Date().toISOString()
      };
      console.log('=== 创建新行程 ===');
      console.log('创建的行程ID:', newItinerary.id);
      console.log('创建前行程列表长度:', itineraries.value.length);
      itineraries.value.push(newItinerary);
      console.log('创建后行程列表长度:', itineraries.value.length);
      console.log('创建后行程列表:', itineraries.value.map(itin => ({id: itin.id, name: itin.name})));
      selectItinerary(newItinerary);
    };

    // 选择行程
    const selectItinerary = (itinerary) => {
      // 保持原始对象引用，避免浅拷贝导致引用不一致
      selectedItinerary.value = itinerary;
      console.log('=== 选择行程 ===');
      console.log('选中的行程ID:', itinerary.id);
      console.log('选中的行程引用 === itineraries中的引用:', 
        itineraries.value.some(itin => itin === itinerary));
      drawRouteOnMap();
    };

    // 保存行程
    const saveItinerary = async () => {
      if (!selectedItinerary.value) {
        window.notificationService?.showWarning('请先选择一个行程');
        return;
      }

      try {
        let response;
        // 添加调试信息
        console.log('=== 行程保存开始 ===');
        console.log('当前选中行程ID:', selectedItinerary.value.id);
        console.log('当前选中行程引用 === itineraries中的引用:', 
          itineraries.value.some(itin => itin === selectedItinerary.value));
        console.log('当前行程列表:', itineraries.value.map(itin => ({id: itin.id, name: itin.name})));
        
        // 更准确的判断逻辑：
        // 1. 先从服务器获取最新的行程列表
        // 2. 检查当前选中的行程ID是否存在于服务器数据中
        let isExistingItinerary = false;
        try {
          const serverItinerariesResponse = await fetch('/api/itineraries');
          if (serverItinerariesResponse.ok) {
            const serverItineraries = await serverItinerariesResponse.json();
            isExistingItinerary = serverItineraries.some(itin => itin.id === selectedItinerary.value.id);
            console.log('服务器行程列表:', serverItineraries.map(itin => ({id: itin.id, name: itin.name})));
            console.log('当前行程ID在服务器中存在:', isExistingItinerary);
          }
        } catch (error) {
          console.error('检查服务器行程失败:', error);
          // 如果检查失败，默认认为是新建行程
          isExistingItinerary = false;
        }
        
        console.log('最终判断结果 - isExistingItinerary:', isExistingItinerary);
        
        if (isExistingItinerary) {
          // 更新现有行程
          console.log('更新现有行程:', selectedItinerary.value.id);
          console.log('发送的数据:', JSON.stringify(selectedItinerary.value, null, 2));
          response = await fetch(`/api/itineraries/${selectedItinerary.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedItinerary.value)
          });
        } else {
          // 创建新行程
          console.log('创建新行程');
          // 确保新行程有正确的ID和时间戳
          const newItineraryData = {
            ...selectedItinerary.value,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          console.log('发送的新行程数据:', JSON.stringify(newItineraryData, null, 2));
          console.log('新行程ID类型:', typeof newItineraryData.id, '值:', newItineraryData.id);
          response = await fetch('/api/itineraries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItineraryData)
          });
        }

        console.log('服务器响应状态:', response.status);
        
        if (response.ok) {
          const savedItinerary = await response.json();
          console.log('保存成功的行程数据:', savedItinerary);
          
          // 更新本地数据
          if (isExistingItinerary) {
            // 更新现有行程
            const index = itineraries.value.findIndex(itin => itin.id === savedItinerary.id);
            if (index !== -1) {
              itineraries.value[index] = savedItinerary;
            }
          } else {
            // 添加新行程 - 需要替换原来的临时行程
            // 通过ID匹配找到临时行程的索引
            const tempIndex = itineraries.value.findIndex(itin => itin.id === selectedItinerary.value.id);
            console.log('查找临时行程索引:', tempIndex);
            console.log('临时行程ID:', selectedItinerary.value.id);
            if (tempIndex !== -1) {
              // 替换临时行程
              console.log('替换位置:', tempIndex);
              console.log('替换前:', itineraries.value[tempIndex]);
              itineraries.value[tempIndex] = savedItinerary;
              console.log('替换后:', itineraries.value[tempIndex]);
            } else {
              // 如果找不到，就添加到末尾（这种情况不应该发生）
              console.warn('警告：找不到对应的临时行程项');
              console.log('当前行程列表IDs:', itineraries.value.map(itin => itin.id));
              itineraries.value.push(savedItinerary);
            }
          }
          // 更新选中的行程引用
          selectedItinerary.value = savedItinerary;
          console.log('最终行程列表:', itineraries.value.map(itin => ({id: itin.id, name: itin.name})));
          window.notificationService?.showSuccess('行程保存成功！');

        } else {
          const errorText = await response.text();
          console.error('服务器返回错误:', response.status, errorText);
          window.notificationService?.showError(`保存失败: ${response.status} ${errorText}`);
        }
      } catch (error) {
        console.error('保存行程失败:', error);
        window.notificationService?.showError(`保存失败，请重试: ${error.message}`);
      }
    };

    // 删除行程
    const deleteItinerary = async (id) => {
      if (window.confirm('确定要删除这个行程吗？')) {
        try {
          const response = await fetch(`/api/itineraries/${id}`, { method: 'DELETE' });
          if (response.ok) {
            itineraries.value = itineraries.value.filter(itin => itin.id !== id);
            if (selectedItinerary.value?.id === id) {
              selectedItinerary.value = null;
            }
            window.notificationService?.showSuccess('行程删除成功！');
          }
        } catch (error) {
          console.error('删除行程失败:', error);
          window.notificationService?.showError('删除失败，请重试');
        }
      }
    };

    // 添加景点到行程
    const addPoiToItinerary = (poi) => {
      if (!selectedItinerary.value.pois) {
        selectedItinerary.value.pois = [];
      }
      
      // 允许重复添加景点 - 移除重复检查
      selectedItinerary.value.pois.push({
        ...poi,
        description: '',
        budget: 0,
        transport: {
          type: '',
          description: '',
          budget: 0
        }
      });
      
      // 可选：显示提示信息
      window.notificationService?.showSuccess(`已添加 ${poi.name} 到行程中`);
    };

    // 从行程中移除景点
    const removePoiFromItinerary = (index) => {
      selectedItinerary.value.pois.splice(index, 1);
    };

    // 移动景点位置
    const movePoiUp = (index) => {
      if (index > 0) {
        const temp = selectedItinerary.value.pois[index];
        selectedItinerary.value.pois[index] = selectedItinerary.value.pois[index - 1];
        selectedItinerary.value.pois[index - 1] = temp;
      }
    };

    const movePoiDown = (index) => {
      if (index < selectedItinerary.value.pois.length - 1) {
        const temp = selectedItinerary.value.pois[index];
        selectedItinerary.value.pois[index] = selectedItinerary.value.pois[index + 1];
        selectedItinerary.value.pois[index + 1] = temp;
      }
    };

    // 在地图上绘制路线
    const drawRouteOnMap = () => {
      if (!map || !selectedItinerary.value?.pois?.length) return;

      // 清除之前的路线和标记
      if (routePolyline) {
        routePolyline.setMap(null);
      }
      
      // 清除之前的标记
      if (window.routeMarkers) {
        window.routeMarkers.forEach(marker => marker.setMap(null));
      }
      window.routeMarkers = [];

      const locations = selectedItinerary.value.pois.map(poi => {
        const [lng, lat] = poi.location.split(',').map(Number);
        return new AMap.LngLat(lng, lat);
      });

      if (locations.length > 1) {
        // 绘制路线 - 使用高德地图内置方向箭头
        routePolyline = new AMap.Polyline({
          path: locations,
          strokeColor: "#3366FF",
          strokeWeight: 6,
          strokeOpacity: 0.8,
          // 启用内置方向箭头
          showDir: true,
          dirColor: "#FFFFFF",  // 白色箭头
          dirSize: 10,          // 箭头大小
          geodesic: true,       // 使用大地曲线绘制
          isOutline: true,      // 显示轮廓线
          outlineColor: '#FFFFFF',
          borderWeight: 1
        });
        routePolyline.setMap(map);

        // 添加路线上的方向箭头标记（自定义箭头作为补充）
        // addDirectionArrows(locations);

        // 添加去重的景点标记
        addUniquePoiMarkers();

        // 调整地图视野
        map.setFitView([routePolyline]);
      } else if (locations.length === 1) {
        map.setCenter(locations[0]);
        map.setZoom(15);
        // 添加单一景点标记
        addUniquePoiMarkers();
      }
    };

    // 添加方向箭头标记
    const addDirectionArrows = (locations) => {
      for (let i = 0; i < locations.length - 1; i++) {
        const start = locations[i];
        const end = locations[i + 1];
        
        // 计算中点位置
        const midLng = (start.lng + end.lng) / 2;
        const midLat = (start.lat + end.lat) / 2;
        const midpoint = new AMap.LngLat(midLng, midLat);
        
        // 使用高德地图API计算更准确的方向角度
        // 方法1: 使用AMap.GeometryUtil.angleOfLine计算线段角度
        let angle;
        try {
          angle = AMap.GeometryUtil.angleOfLine([start, end]);
          // angleOfLine返回的角度是以正北为0度，顺时针为正
          // 转换为canvas绘图需要的角度（以正右为0度，逆时针为正）
          angle = 90 - angle;
          if (angle < 0) angle += 360;
        } catch (error) {
          // 如果API不可用，使用备用计算方法
          console.warn('AMap.GeometryUtil.angleOfLine不可用，使用备用方法');
          // 备用方法：考虑经纬度差异的修正计算
          const deltaLng = end.lng - start.lng;
          const deltaLat = end.lat - start.lat;
          
          // 考虑纬度对经度距离的影响
          const avgLat = (start.lat + end.lat) / 2;
          const lngFactor = Math.cos(avgLat * Math.PI / 180); // 纬度修正因子
          
          angle = Math.atan2(deltaLat, deltaLng * lngFactor) * 180 / Math.PI;
        }
        
        // 创建方向箭头标记
        const arrowMarker = new AMap.Marker({
          position: midpoint,
          icon: new AMap.Icon({
            size: new AMap.Size(24, 24),
            image: createArrowIcon(angle),
            imageSize: new AMap.Size(24, 24)
          }),
          offset: new AMap.Pixel(-12, -12),
          // 设置标记不响应鼠标事件，避免干扰
          clickable: false
        });
        
        arrowMarker.setMap(map);
        window.routeMarkers.push(arrowMarker);
      }
    };

    // 创建箭头图标
    const createArrowIcon = (angle) => {
      const canvas = document.createElement('canvas');
      canvas.width = 24;
      canvas.height = 24;
      const ctx = canvas.getContext('2d');
      
      // 清除画布
      ctx.clearRect(0, 0, 24, 24);
      
      // 旋转画布
      ctx.translate(12, 12);
      ctx.rotate(angle * Math.PI / 180);
      
      // 绘制箭头 - 使用更清晰的样式
      ctx.fillStyle = '#FF6600'; // 橙色箭头
      ctx.strokeStyle = '#FFFFFF'; // 白色边框
      ctx.lineWidth = 2;
      
      // 绘制箭头主体
      ctx.beginPath();
      ctx.moveTo(0, -10);  // 箭头顶点
      ctx.lineTo(-7, 6);   // 左侧点
      ctx.lineTo(-2, 6);   // 左内侧点
      ctx.lineTo(-2, 10);  // 左底部
      ctx.lineTo(2, 10);   // 右底部
      ctx.lineTo(2, 6);    // 右内侧点
      ctx.lineTo(7, 6);    // 右侧点
      ctx.closePath();
      
      ctx.fill();
      ctx.stroke();
      
      return canvas.toDataURL();
    };

    // 添加去重的景点标记
    const addUniquePoiMarkers = () => {
      // 使用Map来去重，以location为key
      const uniquePois = new Map();
      
      selectedItinerary.value.pois.forEach((poi, index) => {
        const locationKey = poi.location;
        if (!uniquePois.has(locationKey)) {
          uniquePois.set(locationKey, {
            ...poi,
            visitOrder: [index + 1] // 记录访问顺序
          });
        } else {
          // 如果已存在，添加访问顺序
          uniquePois.get(locationKey).visitOrder.push(index + 1);
        }
      });

      // 为每个唯一位置创建标记
      uniquePois.forEach((poiData, locationKey) => {
        const [lng, lat] = locationKey.split(',').map(Number);
        const position = new AMap.LngLat(lng, lat);
        
        // 创建标记内容
        let content = `<div style="
          background: #667eea;
          color: white;
          padding: 6px 10px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          white-space: nowrap;
          border: 2px solid white;
        ">${poiData.name}`;
        
        // 如果有多个访问顺序，显示所有顺序
        if (poiData.visitOrder.length > 1) {
          content += ` (${poiData.visitOrder.join(',')})`;
        } else {
          content += ` (${poiData.visitOrder[0]})`;
        }
        
        content += '</div>';

        const marker = new AMap.Marker({
          position: position,
          content: content,
          offset: new AMap.Pixel(-20, -15)
        });
        
        marker.setMap(map);
        window.routeMarkers.push(marker);
      });
    };

    // 加载数据
    const loadData = async () => {
      try {
        // 加载行程
        const itinResponse = await fetch('/api/itineraries');
        if (itinResponse.ok) {
          itineraries.value = await itinResponse.json();
        }

        // 加载兴趣点
        const poiResponse = await fetch('/api/pois');
        if (poiResponse.ok) {
          availablePois.value = await poiResponse.json();
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };

    // 初始化地图
    const initMap = () => {
      nextTick(() => {
        map = new AMap.Map(mapContainer.value, {
          zoom: 10,
          center: [116.397428, 39.90923]
        });
      });
    };

    // 监听行程变化，自动绘制路线
    watch(() => selectedItinerary.value?.pois, () => {
      drawRouteOnMap();
    }, { deep: true });

    // 组件挂载
    onMounted(() => {
      initMap();
      loadData();
    });

    return {
      itineraries,
      selectedItinerary,
      currentView,
      availablePois,
      mapContainer,
      createNewItinerary,
      selectItinerary,
      deleteItinerary,
      saveItinerary,
      addPoiToItinerary,
      removePoiFromItinerary,
      movePoiUp,
      movePoiDown
    };
  }
};
</script>

<style scoped>
.itinerary-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 80px);
  gap: 1rem;
  padding: 1rem;
  overflow: hidden; /* 防止整个容器滚动 */
}

.itinerary-list-section {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%; /* 占满整个高度 */
  overflow: hidden; /* 防止溢出 */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.section-header h2 {
  color: #333;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
}

.itinerary-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 允许flex子元素收缩 */
}

.itinerary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.itinerary-item:hover {
  background-color: #f8f9fa;
}

.itinerary-item.active {
  background-color: #e3f2fd;
  border-color: #667eea;
}

.itinerary-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.itinerary-info p {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.poi-count {
  font-size: 0.75rem;
  color: #999;
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.btn-icon:hover {
  transform: scale(1.1);
}

.btn-icon.delete:hover {
  background: #ff6b6b;
  color: white;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%; /* 占满剩余高度 */
  overflow: hidden; /* 防止主内容区域滚动 */
}

.edit-section {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%; /* 占满整个高度 */
  overflow: hidden; /* 防止溢出 */
}

.itinerary-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 关键：允许flex子元素收缩 */
  overflow-y: auto; /* 关键：在编辑器内部启用滚动 */
}

.editor-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.itinerary-name-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
}

.itinerary-date-input {
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
}

.view-toggle {
  display: flex;
  background: #f5f5f5;
  border-radius: 25px;
  padding: 2px;
  flex-shrink: 0; /* 防止切换按钮被压缩 */
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.itinerary-description {
  width: 100%;
  min-height: 80px;
  padding: 1rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  margin-bottom: 1rem;
  resize: vertical;
  font-family: inherit;
  flex-shrink: 0; /* 防止描述框被过度压缩 */
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-shrink: 0; /* 防止标题被压缩 */
}

.section-title h3 {
  color: #333;
}

/* 景点编辑区域左右排布 */
.edit-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pois-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

.pois-in-itinerary-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pois-in-itinerary {
  flex: 1;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.poi-in-itinerary-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: white;
}

.poi-order {
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.poi-details {
  flex: 1;
}

.poi-details h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.poi-description {
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
}

.poi-budget {
  width: 120px;
  padding: 0.5rem;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
}

/* 交通安排样式 */
.transport-section {
  margin-top: 1rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 6px;
  border-left: 3px solid #2196F3;
}

.transport-section h5 {
  margin-bottom: 0.5rem;
  color: #1976D2;
  font-size: 0.9rem;
}

.transport-type {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background: white;
}

.transport-description {
  width: 100%;
  min-height: 40px;
  padding: 0.5rem;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  resize: vertical;
  font-family: inherit;
  font-size: 0.85rem;
}

.transport-budget {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  background: white;
}

.poi-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

.available-pois-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.available-pois {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  min-height: 0;
}

.available-pois h3 {
  margin-bottom: 1rem;
  color: #333;
  flex-shrink: 0; /* 防止标题被压缩 */
}

.available-pois-list {
  flex: 1;
  overflow-y: auto;
}

.available-poi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  background: white;
}

.available-poi-item:hover {
  background-color: #e3f2fd;
}

.preview-view {
  padding: 1rem 0;
  flex: 1;
  overflow-y: auto;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #667eea;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -24px;
  top: 0;
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}

.timeline-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.timeline-content h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.timeline-content p {
  margin-bottom: 0.5rem;
  color: #666;
  line-height: 1.5;
}

.timeline-budget {
  font-weight: 600;
  color: #4CAF50;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 1.25rem;
}

.map-section {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%; /* 占满整个高度 */
}

#itinerary-map {
  width: 100%;
  height: 100%;
}
</style>