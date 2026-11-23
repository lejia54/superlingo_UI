import type { ApiResponse } from './types'

export async function fetchProductByBarcode(barcode: string): Promise<ApiResponse> {
  const url = `https://superlingo-server.onrender.com/api/v1/scan/${encodeURIComponent(barcode)}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (response.status === 404) {
      return {
        code: 404,
        message: '未找到商品信息'
      }
    }

    if (!response.ok) {
      return {
        code: response.status,
        message: '服务器响应异常'
      }
    }

    const result = await response.json()

    // 兼容你后端实际返回的 {"product": {...}} 格式
    if (result && result.product) {
      return {
        code: 200,
        message: 'success',
        data: result.product
      }
    }

    // 兼容万一后端某些情况返回 {"code": 200, "data": {...}}
    if (result && result.code === 200 && result.data) {
      return result
    }

    return {
      code: 404,
      message: '未找到商品信息'
    }
  } catch (error) {
    console.error('Fetch product error:', error)
    return {
      code: 500,
      message: '网络请求失败，请检查网络或稍后重试'
    }
  }
}