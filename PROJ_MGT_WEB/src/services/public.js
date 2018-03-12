import { request, config } from '../utils'
const { api } = config
const { addproject, getproject, newissue, deleteAttachment, getopenproject } = api

export async function addProject (data) {
  return request({
    url: addproject,
    method: 'post',
    data,
  })
}

export async function getProject () {
  return request({
    url: getproject,
    method: 'get',
  })
}
export async function getOpenProject () {
  return request({
    url: getopenproject,
    method: 'get',
  })
}

export async function newIssue (data) {
  return request({
    url: newissue,
    method: 'post',
    data,
  })
}

export async function deleteAttach (id) {
  return request({
    url: deleteAttachment + '?attachmentId=' + id,
    method: 'post',
  })
}
