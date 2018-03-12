import pathToRegexp from 'path-to-regexp'
import { query, create, remove, update } from '../../services/user'

export default {

  namespace: 'process',

  state: {
    commentsVisible: [],
    showIcon: true,
    hideIcon: false,
    editorVisible: false,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/user/:id').exec(location.pathname)
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
      const data = yield call(query, payload)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: other,
          },
        })
      } else {
        throw data
      }
    },
    *create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.stateCode=="SUCCESS") {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
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
    showComments (state, action) {
      const temp = state.commentsVisible
      temp.push(action.payload.id)
      return { ...state, commentsVisible: temp }
    },
    hideComments (state, action) {
      const temp2 = state.commentsVisible
      temp2.splice(temp2.indexOf(action.payload.id), 1)
      return { ...state, commentsVisible: temp2 }
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
  },
}
