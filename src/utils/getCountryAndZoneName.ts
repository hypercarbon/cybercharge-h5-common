import regionList from '@/assets/data_region.json'

interface Zone {
  id: number
  country_id: number
  country_code: string
  name: string
  code: string
}

interface Country {
  id: number
  name: string
  code: string
  continent: string
  phone_code: string
  zones: Zone[]
}

export const getCountryAndZone = (
  country_code: number,
  zone_code: number,
): string | null => {
  // 找到匹配的国家
  const country = regionList.find(c => c.id === country_code)

  if (!country) {
    return null // 如果没有找到国家，返回 null
  }

  // 找到匹配的地区
  const zone = country.zones.find(z => z.id === zone_code)

  if (!zone) {
    return null // 如果没有找到地区，返回 null
  }

  // 拼接国家和地区的名称
  return `${country.name}, ${zone.name}`
}
