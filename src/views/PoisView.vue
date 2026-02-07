<template>
  <div class="pois-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <input 
          v-model="searchKeyword" 
          @keyup.enter="searchPOIs"
          placeholder="搜索景点..." 
          class="search-input"
        >
        <button @click="searchPOIs" class="search-btn">搜索</button>
      </div>
      
      <!-- 搜索结果列表 -->
      <div class="results-list">
        <div 
          v-for="place in searchResults" 
          :key="place.id"
          class="result-item"
          @click="centerMap(place.location)"
        >
          <div class="result-info">
            <h3>{{ place.name }}</h3>
            <p>{{ place.address || '地址未知' }}</p>
          </div>
          <button 
            @click.stop="addPoi(place)"
            class="add-btn"
            :disabled="isPoiExists(place.id)"
          >
            {{ isPoiExists(place.id) ? '✓' : '+' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 地图区域 -->
    <div class="map-section">
      <div id="map-container" ref="mapContainer"></div>
    </div>
    
    <!-- 兴趣点列表 -->
    <div class="pois-section">
      <h2>我的兴趣点 ({{ pois.length }})</h2>
      <div class="pois-list">
        <div 
          v-for="poi in pois" 
          :key="poi.id"
          class="poi-item"
        >
          <div class="poi-info">
            <h3>{{ poi.name }}</h3>
            <p>{{ poi.address || '地址未知' }}</p>
          </div>
          <button @click="removePoi(poi.id)" class="remove-btn">-</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';

export default {
  name: 'PoisView',
  setup() {
    // 响应式数据
    const searchKeyword = ref('');
    const searchResults = ref([]);
    const pois = ref([]);
    const mapContainer = ref(null);
    let map = null;
    let markers = [];
    const isSearching = ref(false);

    // 检查POI是否已存在
    const isPoiExists = (id) => {
      return pois.value.some(poi => poi.id === id);
    };

    // 搜索POI
    const searchPOIs = async () => {
      console.log('搜索按钮被点击'); // 调试日志
      console.log('搜索关键词:', searchKeyword.value); // 调试日志
      
      // 临时硬编码API密钥进行测试
      const apiKey = 'e953f2ed40d6ba23010ade13fe41d628';
      console.log('使用硬编码API密钥:', apiKey);
      
      if (!searchKeyword.value.trim()) {
        console.log('搜索关键词为空');
        window.notificationService?.showWarning('请输入搜索关键词');
        return;
      }

      isSearching.value = true;
      searchResults.value = [];
      console.log('开始搜索...');

      try {
        // 使用高德地图API搜索
        const apiUrl = `https://restapi.amap.com/v3/place/text?key=${apiKey}&keywords=${encodeURIComponent(searchKeyword.value)}&city=北京&offset=20&page=1&extensions=all`;
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('响应状态:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API响应数据:', data);
          
          if (data.status === '1' && data.pois) {
            searchResults.value = data.pois.map(poi => ({
              id: poi.id,
              name: poi.name,
              address: poi.address,
              location: poi.location,
              tel: poi.tel,
              type: poi.type,
              typecode: poi.typecode
            }));
            console.log('搜索结果数量:', searchResults.value.length);
            if (searchResults.value.length === 0) {
              window.notificationService?.showInfo('未找到相关地点');
            }
          } else {
            console.error('API返回错误:', data);
            window.notificationService?.showError(`搜索失败: ${data.info || '未知错误'}`);
          }
        } else {
          const errorText = await response.text();
          console.error('HTTP错误:', response.status, errorText);
          window.notificationService?.showError(`搜索失败: ${response.status}`);
        }
      } catch (error) {
        console.error('Search failed:', error);
        window.notificationService?.showError(`搜索失败: ${error.message}`);
      } finally {
        isSearching.value = false;
        console.log('搜索完成');
      }
    };

    // 标记搜索结果
    const markSearchResults = () => {
      // 清除之前的标记
      markers.forEach(marker => marker.setMap(null));
      markers = [];

      searchResults.value.forEach((place, index) => {
        const [lng, lat] = place.location.split(',').map(Number);
        const marker = new AMap.Marker({
          position: [lng, lat],
          title: place.name,
          label: {
            content: place.name,
            offset: new AMap.Pixel(10, -10)
          }
        });
        
        marker.setMap(map);
        markers.push(marker);
        
        // 第一个结果居中显示
        if (index === 0) {
          map.setCenter([lng, lat]);
          map.setZoom(14);
        }
      });
    };

    // 居中地图到指定位置
    const centerMap = (location) => {
      const [lng, lat] = location.split(',').map(Number);
      map.setCenter([lng, lat]);
      map.setZoom(16);
    };

    // 添加兴趣点
    const addPoi = async (place) => {
      if (isPoiExists(place.id)) return;

      try {
        const response = await fetch('/api/pois', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(place)
        });
        
        if (response.ok) {
          const newPoi = await response.json();
          pois.value.push(newPoi);
          loadPois(); // 重新加载以确保数据同步
        }
      } catch (error) {
        console.error('添加兴趣点失败:', error);
      }
    };

    // 移除兴趣点
    const removePoi = async (id) => {
      try {
        const response = await fetch(`/api/pois/${id}`, { method: 'DELETE' });
        if (response.ok) {
          pois.value = pois.value.filter(poi => poi.id !== id);
          loadPois(); // 重新加载以确保数据同步
        }
      } catch (error) {
        console.error('移除兴趣点失败:', error);
      }
    };

    // 加载兴趣点
    const loadPois = async () => {
      try {
        const response = await fetch('/api/pois');
        if (response.ok) {
          pois.value = await response.json();
        }
      } catch (error) {
        console.error('加载兴趣点失败:', error);
      }
    };

    // 初始化地图
    const initMap = () => {
      nextTick(() => {
        map = new AMap.Map(mapContainer.value, {
          zoom: 10,
          center: [116.397428, 39.90923] // 默认北京
        });
      });
    };

    // 组件挂载时初始化
    onMounted(() => {
      initMap();
      loadPois();
    });

    return {
      searchKeyword,
      searchResults,
      pois,
      mapContainer,
      isPoiExists,
      searchPOIs,
      centerMap,
      addPoi,
      removePoi
    };
  }
};
</script>

<style scoped>
.pois-container {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  height: calc(100vh - 80px);
  gap: 1rem;
  padding: 1rem;
  overflow: hidden; /* 防止整个容器滚动 */
}

.search-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%; /* 占满整个高度 */
}

.search-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-shrink: 0; /* 防止搜索框被压缩 */
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 25px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #667eea;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.search-btn:hover {
  transform: translateY(-2px);
}

.results-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 允许flex子元素收缩 */
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.result-info p {
  font-size: 0.875rem;
  color: #666;
}

.add-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.add-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.add-btn:disabled {
  background: #667eea;
  color: white;
  cursor: default;
}

.map-section {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%; /* 占满整个高度 */
}

#map-container {
  width: 100%;
  height: 100%;
}

.pois-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%; /* 占满整个高度 */
}

.pois-section h2 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.25rem;
  flex-shrink: 0; /* 防止标题被压缩 */
}

.pois-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 允许flex子元素收缩 */
}

.poi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.poi-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.poi-info p {
  font-size: 0.875rem;
  color: #666;
}

.remove-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #ff6b6b;
  background: white;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.remove-btn:hover {
  background: #ff6b6b;
  color: white;
  transform: scale(1.1);
}
</style>