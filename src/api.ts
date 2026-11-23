import type { ApiResponse } from './types'

/**
 * 根据条形码查询商品信息
 * @param barcode 条形码字符串
 */
export async function fetchProductByBarcode(barcode: string): Promise<ApiResponse> {
  // 使用你提供的真实后端线上接口地址
  const url = `https://superlingo-server.onrender.com/api/v1/scan/${encodeURIComponent(barcode)}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Fetch product error:', error)
    return {
      code: 500,
      message: '网络请求失败，请检查网络或稍后重试'
    }
  }
}