import { request, config } from '../utils'
const { api } = config
import qs from 'qs'
const { getusers, createuser, deleteuser, updateuser, getentity, getlocation } = api

export async function query (params) {
  return request({
    url: getusers,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: createuser,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: deleteuser,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function update (params) {
  return request({
    url: updateuser,
    method: 'post',
    data: params,
  })
}

export async function entityQuery (params) {
  return request({
    url: getentity,
    method: 'get',
    data: params,
  })
}

export async function locationQuery (params) {
  return request({
    url: getlocation,
    method: 'get',
    data: params,
  })
}
