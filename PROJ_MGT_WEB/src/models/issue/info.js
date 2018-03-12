import pathToRegexp from 'path-to-regexp'
import { issueDetail } from '../../services/case'

export default {

  namespace: 'issueInfo',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/issueInfo/:id').exec(location.pathname)
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
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: data.data,
          },
        })
      } else {
        throw data
      }
    },
    *openProject ({
      payload,
    }, { call, put }) {
      const data = yield call(open, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: data.data,
          },
        })
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
