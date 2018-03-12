import pathToRegexp from 'path-to-regexp'
import { issueDetail } from '../services/case'
import { routerRedux } from 'dva/router'

export default {

  namespace: 'editIssue',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/editIssue/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      const data = yield call(issueDetail, payload)
      if (data.stateCode === 'SUCCESS') {
        yield put({
          type: 'querySuccess',
          payload: {
            data: data.data,
          },
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    *openProject ({
      payload,
    }, { call, put }) {
      const data = yield call(open, payload)
      if (data.stateCode === 'SUCCESS') {
        yield put({
          type: 'querySuccess',
          payload: {
            data: data.data,
          },
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}
