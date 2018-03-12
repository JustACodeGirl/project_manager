import { request, config } from '../utils'
import qs from 'qs'
const { api } = config
const { getToDoTask, getRelatedTask, getCCTask, taskInfo, projectOpen, projectUpdate, updateprojectprogress, updateissueprogress, projectInfo, projectActs, projectIssues, issueInfo, issueupdate, issueActs, iAudit, iSolve, iFinish, pFinish, iClose, pClose, iComment, pComment } = api

export async function queryInfo (id) {
  return request({
    url: taskInfo,
    method: 'get',
    data: id,
  })
}

export async function open (params) {
  return request({
    url: projectOpen,
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: projectUpdate,
    method: 'post',
    data: params,
  })
}

export async function updateIssue (params) {
  return request({
    url: issueupdate,
    method: 'post',
    data: params,
  })
}

export async function getToDo (params) {
  return request({
    url: getToDoTask,
    method: 'get',
    data: params,
  })
}

export async function getRelated (params) {
  return request({
    url: getRelatedTask,
    method: 'get',
    data: params,
  })
}

export async function getCC (params) {
  return request({
    url: getCCTask,
    method: 'get',
    data: params,
  })
}

export async function updateProjectProgress (params) {
  return request({
    url: updateprojectprogress,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function updateIssueProgress (params) {
  return request({
    url: updateissueprogress,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function projectDetail (params) {
  return request({
    url: projectInfo,
    method: 'get',
    data: params,
  })
}

export async function projectProcess (params) {
  return request({
    url: projectActs,
    method: 'get',
    data: params,
  })
}

export async function projectIssueList (params) {
  return request({
    url: projectIssues,
    method: 'get',
    data: params,
  })
}

export async function issueDetail (params) {
  return request({
    url: issueInfo,
    method: 'get',
    data: params,
  })
}

export async function issueProcess (params) {
  return request({
    url: issueActs,
    method: 'get',
    data: params,
  })
}

export async function iaudit (params) {
  return request({
    url: iAudit,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function isolve (params) {
  return request({
    url: iSolve,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function ifinish (params) {
  return request({
    url: iFinish,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function pfinish (params) {
  return request({
    url: pFinish,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function iclose (params) {
  return request({
    url: iClose,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function pclose (params) {
  return request({
    url: pClose,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function icomment (params) {
  return request({
    url: iComment,
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function pcomment (params) {
  return request({
    url: pComment,
    method: 'post',
    data: qs.stringify(params),
  })
}
