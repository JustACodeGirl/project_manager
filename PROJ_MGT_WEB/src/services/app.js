import { request, config } from '../utils'
const { api } = config
const { user, userLogout, userLogin } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  window.localStorage.user = ''
  return { success: true, message: 'Logout', status: 200, user: {} }
}

export async function query (params) {
  if (Object.keys(params).length === 0) {
    if (window.localStorage.user) {
      return { success: true, message: 'OK', status: 200, user: JSON.parse(window.localStorage.user) }
    } else {
      return { success: true, message: 'Not Login', status: 200 }
    }
  } else {
    window.localStorage.user = JSON.stringify(params.data)
    return { success: true, message: 'OK', status: 200, user: params.data }
  }
  // return request({
  //   url: user.replace('/:id', ''),
  //   method: 'get',
  //   data: params,
  // })
}
