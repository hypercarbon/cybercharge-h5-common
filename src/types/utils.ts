export interface Result<Data = null> {
  code: number
  data: Data
  msg: string | null
}

// TODO: 分页接口请求参数
export interface PageProps {}

// TODO: 分页接口返回数据
export interface PageResData<DataItem = null> {}
