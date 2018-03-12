import { request, config } from '../utils'
const { api } = config
const { taskQuery } = api

export async function query (params) {
  return request({
    url: taskQuery,
    method: 'get',
    data: params,
  })
}
