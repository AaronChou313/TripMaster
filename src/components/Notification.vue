<template>
  <div class="notification-container">
    <transition-group name="notification" tag="div">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="['notification', `notification--${notification.type}`]"
      >
        <div class="notification__content">
          <span class="notification__message">{{ notification.message }}</span>
          <button 
            class="notification__close" 
            @click="removeNotification(notification.id)"
          >
            ×
          </button>
        </div>
        <div class="notification__progress" :style="{ width: notification.progress + '%' }"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'Notification',
  setup() {
    const notifications = ref([]);
    let notificationId = 0;

    const addNotification = (message, type = 'info', duration = 3000) => {
      const id = ++notificationId;
      const notification = {
        id,
        message,
        type,
        progress: 100
      };
      
      notifications.value.push(notification);
      
      // 进度条动画
      const interval = setInterval(() => {
        notification.progress -= 2;
        if (notification.progress <= 0) {
          clearInterval(interval);
          removeNotification(id);
        }
      }, duration / 50);

      // 自动移除
      setTimeout(() => {
        removeNotification(id);
      }, duration);

      return id;
    };

    const removeNotification = (id) => {
      const index = notifications.value.findIndex(n => n.id === id);
      if (index > -1) {
        notifications.value.splice(index, 1);
      }
    };

    const showSuccess = (message, duration) => {
      return addNotification(message, 'success', duration);
    };

    const showError = (message, duration) => {
      return addNotification(message, 'error', duration);
    };

    const showInfo = (message, duration) => {
      return addNotification(message, 'info', duration);
    };

    const showWarning = (message, duration) => {
      return addNotification(message, 'warning', duration);
    };

    // 提供全局访问
    const notificationService = {
      showSuccess,
      showError,
      showInfo,
      showWarning,
      addNotification,
      removeNotification
    };

    // 挂载到window对象以便全局使用
    onMounted(() => {
      window.notificationService = notificationService;
    });

    onUnmounted(() => {
      delete window.notificationService;
    });

    return {
      notifications,
      removeNotification
    };
  }
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: 320px;
}

.notification {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  overflow: hidden;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.notification.notification--success {
  border-left: 4px solid #4CAF50;
}

.notification.notification--error {
  border-left: 4px solid #f44336;
}

.notification.notification--info {
  border-left: 4px solid #2196F3;
}

.notification.notification--warning {
  border-left: 4px solid #FF9800;
}

.notification-enter-active,
.notification-leave-active {
  transform: translateX(0);
  opacity: 1;
}

.notification-enter-from,
.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.notification__message {
  flex: 1;
  font-size: 14px;
  color: #333;
  margin-right: 8px;
}

.notification__close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.notification__close:hover {
  background: #f5f5f5;
  color: #666;
}

.notification__progress {
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.06s linear;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-container {
    width: calc(100% - 40px);
    right: 20px;
    left: 20px;
  }
}
</style>