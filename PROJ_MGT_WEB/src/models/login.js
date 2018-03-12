import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL } from '../utils'
import { message } from 'antd'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
  },

  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.stateCode === 'SUCCESS') {
        const from = queryURL('from')
        yield put({ type: 'app/query', payload: { data: data.data } })
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/pendingCase'))
        }
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data.stateCode
      }
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
  },
}
