import { request, config } from '../utils'
const { api } = config
const { getUserInfo, updatePassword } = api

export async function userInfo (params) {
  return request({
    url: getUserInfo,
    method: 'get',
    data: params,
  })
}

export async function changepassword (params) {
  return request({
    url: updatePassword,
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: user,
    method: 'patch',
    data: params,
  })
}
