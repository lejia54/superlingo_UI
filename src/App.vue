<template>
  <div class="app-container">
    <div class="app-content-wrapper">
      <!-- 顶栏 -->
      <van-nav-bar
        title="美亚商品智能扫码助手"
        :left-text="currentView !== 'scanner' ? '返回扫码' : ''"
        :left-arrow="currentView !== 'scanner'"
        @click-left="handleBackToScanner"
        class="custom-nav"
      />

      <!-- 主视图区域 -->
      <div class="main-view">
        <transition name="fade" mode="out-in">
          <!-- 1. 扫码页 -->
          <Scanner 
            v-if="currentView === 'scanner'" 
            @scan-success="handleScanSuccess" 
          />

          <!-- 2. 商品详情页 -->
          <ProductDetail 
            v-else-if="currentView === 'detail' && productData" 
            :product="productData" 
            @rescan="handleBackToScanner" 
          />

          <!-- 3. 404 / 异常空白页 -->
          <div v-else-if="currentView === 'not-found'" class="empty-view">
            <van-empty description="商品未录入" />
            <div class="empty-action">
              <van-button 
                color="#2d3436" 
                round 
                block 
                @click="handleBackToScanner"
              >
                返回扫码
              </van-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showLoadingToast, closeToast, showToast } from 'vant'
import { fetchProductByBarcode } from './api'
import type { Product } from './types'
import Scanner from './Scanner.vue'
import ProductDetail from './ProductDetail.vue'

type ViewState = 'scanner' | 'detail' | 'not-found'

const currentView = ref<ViewState>('scanner')
const productData = ref<Product | null>(null)
let isRequesting = false

// 处理扫码成功
const handleScanSuccess = async (barcode: string) => {
  if (isRequesting) return
  isRequesting = true

  const _toast = showLoadingToast({
    message: '正在查询商品...',
    forbidClick: true,
    duration: 0
  })

  try {
    const res = await fetchProductByBarcode(barcode)
    closeToast()

    if (res.code === 200 && res.data) {
      productData.value = res.data
      currentView.value = 'detail'
    } else if (res.code === 404) {
      productData.value = null
      currentView.value = 'not-found'
    } else {
      showToast(res.message || '查询失败')
      currentView.value = 'scanner'
    }
  } catch (err) {
    closeToast()
    showToast('网络异常，请重试')
    currentView.value = 'scanner'
  } finally {
    isRequesting = false
  }
}

// 返回扫码页
const handleBackToScanner = () => {
  productData.value = null
  currentView.value = 'scanner'
}
</script>

<style scoped lang="less">
.app-container {
  min-height: 100vh;
  background-color: #f2f2f6;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .app-content-wrapper {
    width: 100%;
    max-width: 600px;
    min-height: 100vh;
    background-color: #f2f2f6;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;

    .custom-nav {
      background-color: #ffffff;
      flex-shrink: 0;

      :deep(.van-nav-bar__title) {
        font-weight: 600;
        color: #252b2d;
      }
    }

    .main-view {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-y: auto;

      .empty-view {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px 20px;

        .empty-action {
          width: 100%;
          max-width: 300px;
          margin-top: 24px;
        }
      }
    }
  }
}

/* 淡入淡出过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>