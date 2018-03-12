import { create, remove, update } from '../services/user'
import { query } from '../services/query'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'

export default {

  namespace: 'query',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    statusOption: 'Project',
    statusSelect: true,
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} items`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/query') {

          if (location.search.length === 0) {
            dispatch({
              type: 'reset',
            })
          }
          window.localStorage.removeItem('caseInfo')
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      payload = parse(location.search.substr(1))
      let data = {}
      data = yield call(query, payload)
      if (data.stateCode === 'SUCCESS') {
        if (data.data.results) {
          data.data.results.map((item, index) => {
            item.num = index + 1
          })
        }
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.results,
            pagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.totalRecords,
            },
          },
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data.stateCode
      }
    },

    *'delete' ({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload })
      if (data.stateCode=="SUCCESS") {
        yield put({ type: 'query' })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
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

  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    typeChange (state, action) {
      return { ...state, statusOption: action.payload.taskType, statusSelect: false }
    },
    reset (state, action) {
      return { ...state, ...action.payload, statusSelect: true }
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    switchIsMotion (state) {
      localStorage.setItem('antdAdminUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },

}
