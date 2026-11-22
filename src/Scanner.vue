<template>
  <div class="scanner-container">
    <div class="scanner-wrapper">
      <div id="reader" class="reader-box"></div>
      <div class="scan-mask-tip">请将条形码或二维码放入框内</div>
    </div>

    <div class="action-area">
      <van-button 
        class="album-btn" 
        color="#2d3436" 
        round 
        block 
        @click="handleAlbumScan"
      >
        从相册选择识别
      </van-button>
      <input 
        ref="fileInputRef" 
        type="file" 
        accept="image/*" 
        style="display: none" 
        @change="onFileChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { showToast } from 'vant'

const emit = defineEmits<{
  (e: 'scan-success', barcode: string): void
}>()

const html5QrCode = ref<Html5Qrcode | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isScanning = ref(false)

// 初始化并启动摄像头扫码
const initScanner = async () => {
  try {
    html5QrCode.value = new Html5Qrcode('reader')
    const config = { fps: 10, qrbox: { width: 280, height: 180 } }
    
    isScanning.value = true
    await html5QrCode.value.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        handleScanSuccess(decodedText)
      },
      (_errorMessage) => {
        // 忽略扫描过程中的频繁未识别错误
      }
    )
  } catch (err) {
    console.error('摄像头启动失败:', err)
    showToast('无法调用摄像头，请检查权限或尝试从相册选择')
    isScanning.value = false
  }
}

// 停止摄像头底层流
const stopScanner = async () => {
  if (html5QrCode.value && isScanning.value) {
    try {
      await html5QrCode.value.stop()
      await html5QrCode.value.clear()
    } catch (e) {
      console.error('停止扫码器出错:', e)
    } finally {
      isScanning.value = false
    }
  }
}

// 成功扫码回调
const handleScanSuccess = (barcode: string) => {
  stopScanner().then(() => {
    emit('scan-success', barcode)
  })
}

// 点击从相册选择
const handleAlbumScan = async () => {
  // 先停止摄像头底层流，避免冲突
  await stopScanner()
  fileInputRef.value?.click()
}

// 处理相册图片解析
const onFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const qrScanner = new Html5Qrcode('reader')
  try {
    const decodedText = await qrScanner.scanFile(file, true)
    handleScanSuccess(decodedText)
  } catch (err) {
    console.error('相册识别失败:', err)
    showToast('未能在图片中识别出有效条码')
    initScanner()
  } finally {
    try {
      await qrScanner.clear()
    } catch {}
    target.value = ''
  }
}

onMounted(() => {
  initScanner()
})

onUnmounted(() => {
  stopScanner()
})
</script>

<style scoped lang="less">
.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 20px 16px;
  box-sizing: border-box;

  .scanner-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .reader-box {
      width: 100% !important;
      max-width: 500px;
      border-radius: 12px;
      overflow: hidden;
      background: #000;
      border: none !important;

      :deep(video) {
        width: 100% !important;
        object-fit: cover;
      }
    }

    .scan-mask-tip {
      margin-top: 16px;
      font-size: 14px;
      color: #636e72;
      text-align: center;
    }
  }

  .action-area {
    width: 100%;
    max-width: 500px;
    padding-bottom: 20px;

    .album-btn {
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  }
}
</style>