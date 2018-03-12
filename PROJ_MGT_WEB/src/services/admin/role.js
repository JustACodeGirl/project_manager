import { request, config } from '../../utils'
const { api } = config
const { user } = api

export async function query () {
  return request('/user/getAllRoles', {
    url: user,
    method: 'get',
  })
}

export async function create (params) {
  return request('/user/addRole', {
    method: 'post',
    data: JSON.stringify(params),
    contentType: 'application/json',
  })
}

export async function remove (params) {
  return request('/user/deleteRoleById', {
    method: 'post',
    data: params,
  })
}

export async function configSet (params) {
  return request('/user/allocationRight', {
    method: 'post',
    data: params,
  })
}

export async function getAllRights () {
  return request('/user/getAllRights', {
    method: 'get',
  })
}
