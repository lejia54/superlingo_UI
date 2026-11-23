<template>
  <div class="detail-container">
    <!-- 上半部分：核心商品信息卡片 -->
    <div class="card core-card">
      <div class="card-tip" v-if="novaInfo">
        说明：加工程度按 1 至 4 级递增，1为未加工，2为加工过的烹饪原料，3为加工食品，4为超加工食品。
      </div>

      <div class="core-content">
        <!-- 左侧图 -->
        <div class="img-wrapper" v-if="product.imageUrl">
          <img :src="product.imageUrl" :alt="product.nameZh || product.nameEn" />
        </div>
        
        <!-- 右侧文 -->
        <div class="info-wrapper">
          <div class="brand-name" v-if="cleanBrand">
            {{ cleanBrand }}
          </div>
          <div class="product-name-zh" v-if="product.nameZh">
            {{ product.nameZh }}
          </div>
          <div class="product-name-en" v-if="product.nameEn">
            {{ product.nameEn }}
          </div>
          <div class="barcode-text" v-if="product.barcode">
            条形码: <span>{{ product.barcode }}</span>
          </div>
          <div class="quantity-text" v-if="product.quantity">
            规格: {{ product.quantity }}
          </div>
          <div class="nova-tag-wrapper" v-if="novaInfo">
            <span class="nova-badge" :style="{ backgroundColor: novaInfo.bg, color: novaInfo.color }">
              {{ novaInfo.text }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 下半部分：Tab 详情卡片 -->
    <div class="card tab-card" v-if="hasAnyTabContent">
      <van-tabs v-model:active="activeTab" color="#2d3436" title-active-color="#2d3436">
        <!-- 成分列表 -->
        <van-tab title="成分列表" v-if="parsedIngredients.length > 0">
          <div class="tab-content-padded">
            <div 
              class="ingredient-item" 
              v-for="(item, index) in parsedIngredients" 
              :key="index"
            >
              <div 
                class="progress-bg" 
                v-if="item.hasPercent" 
                :style="{ width: `${Math.min(item.percent, 100)}%` }"
              ></div>
              <div class="ingredient-text">{{ item.text }}</div>
              <div class="ingredient-percent" v-if="item.hasPercent">
                {{ item.percentStr }}
              </div>
            </div>
          </div>
        </van-tab>

        <!-- 原料 -->
        <van-tab title="原料" v-if="product.origins">
          <div class="tab-content-padded plain-text">
            {{ product.origins }}
          </div>
        </van-tab>

        <!-- 所属类别 -->
        <van-tab title="类别" v-if="parsedCategories.length > 0">
          <div class="tab-content-padded">
            <div class="tags-matrix">
              <span 
                class="category-tag" 
                v-for="(cat, idx) in parsedCategories" 
                :key="idx"
                :style="{
                  backgroundColor: categoryColors[idx % categoryColors.length].bg,
                  color: categoryColors[idx % categoryColors.length].color
                }"
              >
                {{ cat }}
              </span>
            </div>
          </div>
        </van-tab>

        <!-- 可出售国家 -->
        <van-tab title="可售国家" v-if="cleanCountries">
          <div class="tab-content-padded plain-text">
            {{ cleanCountries }}
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 底部静态重扫按钮 -->
    <div class="footer-action">
      <van-button 
        color="#2d3436" 
        round 
        block 
        @click="$emit('rescan')"
      >
        继续扫码
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from './types'

const props = defineProps<{
  product: Product
}>()

defineEmits<{
  (e: 'rescan'): void
}>()

const activeTab = ref(0)

// 辅助工具：去掉字符串首尾的 [ 和 ]
const stripBrackets = (str?: string) => {
  if (!str) return ''
  return str.replace(/^\[|\]$/g, '').trim()
}

// 清洗品牌名称
const cleanBrand = computed(() => {
  if (!props.product.brands) return ''
  return props.product.brands.replace(/品牌/g, '').trim()
})

// 加工程度动态样式与文案（当 novaGroup 为 0 或空时返回 null 自动隐藏）
const novaInfo = computed(() => {
  const group = props.product.novaGroup
  switch (group) {
    case 1:
      return { bg: '#e8f5e9', color: '#2e7d32', text: '加工程度 1级（未加工）' }
    case 2:
      return { bg: '#fffde7', color: '#f57f17', text: '加工程度 2级（烹饪原料）' }
    case 3:
      return { bg: '#fff3e0', color: '#ef6c00', text: '加工程度 3级（加工食品）' }
    case 4:
      return { bg: '#ffebee', color: '#c62828', text: '加工程度 4级（超加工食品）' }
    default:
      return null
  }
})

// 解析成分列表（去掉首尾 [] 后按逗号拆分）
const parsedIngredients = computed(() => {
  const cleaned = stripBrackets(props.product.ingredients)
  if (!cleaned) return []
  
  const rawList = cleaned.split(/[,;，；]/).map(s => s.trim()).filter(Boolean)
  const regex = /(\d+(?:\.\d+)?%)/

  return rawList.map(item => {
    const match = item.match(regex)
    let percentNum = 0
    if (match) {
      percentNum = parseFloat(match[1])
    }
    return {
      text: item,
      hasPercent: !!match,
      percent: percentNum,
      percentStr: match ? match[1] : ''
    }
  })
})

// 解析所属类别（读取 categoriesTags 并去掉首尾 []）
const parsedCategories = computed(() => {
  const cleaned = stripBrackets(props.product.categoriesTags)
  if (!cleaned) return []
  return cleaned.split(/[,，]/).map(s => s.trim()).filter(Boolean)
})

// 解析可售国家（读取 countriesTags 并去掉首尾 []）
const cleanCountries = computed(() => {
  return stripBrackets(props.product.countriesTags)
})

const categoryColors = [
  { bg: '#e3f2fd', color: '#1976d2' },
  { bg: '#e8f5e9', color: '#388e3c' },
  { bg: '#fff3e0', color: '#f57c00' },
  { bg: '#ffebee', color: '#d32f2f' },
  { bg: '#f3e5f5', color: '#7b1fa2' }
]

const hasAnyTabContent = computed(() => {
  return (
    parsedIngredients.value.length > 0 ||
    !!props.product.origins ||
    parsedCategories.value.length > 0 ||
    !!cleanCountries.value
  )
})
</script>

<style scoped lang="less">
.detail-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;

  .card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    padding: 16px;
    box-sizing: border-box;
  }

  .core-card {
    .card-tip {
      font-size: 12px;
      color: #b2bec3;
      line-height: 1.5;
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px dashed #dfe6e9;
    }

    .core-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;

      .img-wrapper {
        flex-shrink: 0;
        width: 130px;
        height: 130px;
        border-radius: 8px;
        overflow: hidden;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .info-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;

        .brand-name {
          font-size: 16px;
          font-weight: 700;
          color: #2d3436;
        }

        .product-name-zh {
          font-size: 15px;
          font-weight: 600;
          color: #2d3436;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-name-en {
          font-size: 13px;
          color: #636e72;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .barcode-text {
          font-size: 12px;
          color: #b2bec3;
          font-family: monospace;

          span {
            color: #636e72;
          }
        }

        .quantity-text {
          font-size: 12px;
          color: #636e72;
        }

        .nova-tag-wrapper {
          margin-top: 4px;

          .nova-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 500;
            padding: 2px 8px;
            border-radius: 4px;
          }
        }
      }
    }
  }

  .tab-card {
    padding: 0;
    overflow: hidden;

    :deep(.van-tabs__nav) {
      background: transparent;
    }

    .tab-content-padded {
      padding: 16px;

      &.plain-text {
        font-size: 14px;
        color: #2d3436;
        line-height: 1.6;
      }

      .ingredient-item {
        position: relative;
        padding: 8px 12px;
        margin-bottom: 8px;
        border-radius: 6px;
        background: #f8f9fa;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .progress-bg {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: rgba(46, 125, 50, 0.12);
          z-index: 1;
        }

        .ingredient-text {
          position: relative;
          z-index: 2;
          font-size: 13px;
          color: #2d3436;
          flex: 1;
          padding-right: 12px;
          word-break: break-all;
        }

        .ingredient-percent {
          position: relative;
          z-index: 2;
          font-size: 13px;
          font-weight: 600;
          color: #2e7d32;
          flex-shrink: 0;
        }
      }

      .tags-matrix {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .category-tag {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 6px;
        }
      }
    }
  }

  .footer-action {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>