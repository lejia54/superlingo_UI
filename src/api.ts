import type { ApiResponse } from './types'

/**
 * 根据条形码查询商品信息
 * @param barcode 条形码字符串
 */
export async function fetchProductByBarcode(barcode: string): Promise<ApiResponse> {
  const url = `https://superlingo.onrender.com/api/v1/scan/${encodeURIComponent(barcode)}`
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
      message: '网络请求失败，请稍后重试'
    }
  }
}