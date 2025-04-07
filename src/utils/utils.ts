export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp) // 创建日期对象
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0') // 补充0，确保两位数

  return `${year}-${month}-${day}`
}
