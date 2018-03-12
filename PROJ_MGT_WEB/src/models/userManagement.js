import { query, create, remove, update, entityQuery, locationQuery } from '../services/users'
import { parse } from 'qs'
import { message } from 'antd'
import { routerRedux } from 'dva/router'

export default {

  namespace: 'userManagement',

  state: {
    list: [],
    item: {},
    entity: [],
    locations: [],
    modalVisible: false,
    modalType: 'create',
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} page`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/userManagement') {
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
      const data = yield call(query, payload)
      const entities = yield call(entityQuery, payload)
      if (data.stateCode === 'SUCCESS') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.results,
            entity: entities.data,
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
        throw data
      }
    },

    *getlocations ({ payload }, { call, put }) {
      const location = yield call(locationQuery, payload)
      if (location) {
        yield put({
          type: 'getLocation',
          payload: {
            locations: location.data,
          },
        })
      }
    },

    *delete ({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload })
      if (data.stateCode=="SUCCESS") {
        message.success('Delete User Success')
        yield put({ type: 'query' })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        message.error('Delete User failed')
        throw data
      }
    },

    *create ({ payload }, { call, put }) {
      const data = yield call(create, payload);
      if(data.stateCode=="MailDuplicated"){
        message.error('Email has existed!')
      }
      else if(data.stateCode=="UserDuplicated"){
        message.error('User Name has existed!')
      }
      else if (data.stateCode ==="SUCCESS") {
        message.success('Create Success')
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data.stateCode
      }
    },

    *update ({ payload }, { call, put }) {
      const data = yield call(update, payload)
      if(data.stateCode=="MailDuplicated"){
        message.error('Email has existed!')
      }
      else if(data.stateCode=="UserDuplicated"){
        message.error('User Name has existed!')
      }
      else if (data.stateCode === 'SUCCESS') {
        message.success('Update Success')
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data.stateCode
      }
    },

  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination, entity } = action.payload
      return { ...state,
        list,
        entity,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },

    getLocation (state, action) {
      const { locations } = action.payload
      let { item } = state
      console.log(item);
      item.location = ""
      console.log(item);
      return { ...state,
        item,
        locations,
      }
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
