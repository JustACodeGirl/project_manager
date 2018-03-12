import { request, config } from '../utils'
const { api } = config
const { logquery, logget } = api

export async function query (params) {
  return request({
    url: logquery,
    method: 'get',
    data: params,
  })
}

export async function getLogs (params) {
  return request({
    url: logget,
    method: 'get',
    data: params,
  })
}
