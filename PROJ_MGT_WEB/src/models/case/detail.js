import pathToRegexp from 'path-to-regexp'
import { projectDetail, projectProcess, projectIssueList, issueDetail, issueProcess, downloadAttach } from '../../services/case'

export default {

  namespace: 'caseDetail',

  state: {
    data: {},
    process: [],
    issueList: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/case/:id').exec(location.pathname)
        const type = location.search.substring(location.search.indexOf('=') + 1, location.search.length)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1], taskType: type } })
        } else {
          dispatch({ type: 'clear', payload: { data: {}, process: [], issueList: [] } })
        }
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      let data
      let process
      let issueList
      if (payload.taskType === 'Project') {
        data = yield call(projectDetail, { id: payload.id })
        process = yield call(projectProcess, { id: payload.id, pageSize: 999 })
        issueList = yield call(projectIssueList, { id: payload.id })
      } else {
        data = yield call(issueDetail, { id: payload.id })
        process = yield call(issueProcess, { id: payload.id, pageSize: 999 })
        issueList = []
      }
      const { success, message, status, ...other } = data
      const { stateCode, ...acts } = process
      const { ...list } = issueList
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: other.data,
            process: acts.data.results,
            issueList: list.data,
          },
        })
      } else {
        throw data
      }
    },

    *download ({ payload }, { call }) {
      yield call(downloadAttach, { id: payload.attachmentId })
    },
  },

  reducers: {
    clear (state, { payload }) {
      const { data, process, issueList } = payload
      return {
        ...state,
        data,
        process,
        issueList,
      }
    },
    querySuccess (state, { payload }) {
      const { data, process, issueList } = payload
      return {
        ...state,
        data,
        process,
        issueList,
      }
    },
  },
}
