import { request } from '../../utils';

export async function query () {
  return request('/user/getAll', {
    method: 'get',
  });
}

export async function create (params) {
  return request('/user/add', {
    method: 'post',
    data: JSON.stringify(params),
    contentType: 'application/json',
  });
}

export async function remove (params) {
  return request('/user/delete', {
    method: 'post',
    data: params,
  });
}

export async function update (params) {
  return request('/user/update', {
    method: 'post',
    data: JSON.stringify(params),
    contentType: 'application/json',
  });
}
