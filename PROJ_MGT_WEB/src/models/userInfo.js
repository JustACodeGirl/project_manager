import { userInfo, changepassword } from '../services/user'
import { query } from '../services/users'
import { parse } from 'qs'
import { routerRedux } from 'dva/router'
import { message } from 'antd'

export default {

  namespace: 'userInfo',

  state: {
    data: {},
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const id = JSON.parse(window.localStorage.user).id
        if (location.pathname === '/userInfo') {
          dispatch({
            type: 'query',
            payload: { id: id },
          })
        }
      })
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      const data = yield call(userInfo, payload)
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

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.stateCode=="SUCCESS") {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },

    *changePassword ({ payload }, { call, put }) {
      const data = yield call(changepassword, { oldPassword: payload.oldPassword, newPassword: payload.newPassword })
      if (data.stateCode === 'SUCCESS') {
        yield put({ type: 'hideModal' })
        message.success('ChangePassword Success')
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data.stateCode
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
      const { data } = action.payload
      return { ...state,
        data,
      }
    },

    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
  },

}
