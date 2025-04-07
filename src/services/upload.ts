import type { Result } from '@/types/utils'
import axios from 'axios'
import { API_BASE_URL } from '@/config/constants'

// 上传图片
export interface UploadResult {
  url: string
}
export const uploadImage = (file: File): Promise<Result<UploadResult>> => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form',
    },
  })
  const formData = new FormData()
  const uploadFile =
    file instanceof Blob ? file : new Blob([file], { type: 'image/jpeg' })

  formData.append('upload', uploadFile, 'upload.jpg') // 使用 "upload" 字段名，并指定文件名
  return axiosInstance.post('/api/common/upload', formData)
}
