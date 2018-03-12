import { create, remove, config, query, getAllRights } from '../../services/admin/role'

const isValid = data => data && data.stateCode === 'SUCCESS'

export default {
  namespace: 'adminRoles',
  state: {
    list: [],
    rights: [],
    currentItem: {},
    modalVisible: 0,
    selectedRowKeys: [],
  },
  reducers: {
    querySuccess (state, action) {
      const { list } = action.payload
      return { ...state, list }
    },
    queryRightsSuccess (state, action) {
      const { rights } = action.payload
      return { ...state, rights }
    },
    showAddModal (state, action) {
      return { ...state, ...action.payload, modalVisible: 1 }
    },
    showEditModal (state, action) {
      return { ...state, ...action.payload, modalVisible: 2 }
    },
    hideModal (state) {
      return { ...state, modalVisible: 0 }
    },
    selectRowKeys (state, action) {
      return { ...state, selectedRowKeys: [...action.payload] }
    },
  },
  effects: {
    *query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (isValid(data)) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
          },
        })
      }
    },
    *create ({ payload }, { call, put }) {
      yield put({ type: 'hideModal' })
      yield call(create, payload)
      yield put({ type: 'query' })
    },
    *'delete' ({ payload }, { call, put }) {
      yield call(remove, { roleId: payload.toString() })
      yield put({ type: 'selectRowKeys', payload: [] })
      yield put({ type: 'query' })
    },
    *config ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      const id = yield select(({ adminRoles }) => adminRoles.currentItem.id)
      yield call(config, { roleId: id, rightIds: payload.toString() })
      yield put({ type: 'query' })
    },
    *getAllRights ({ payload }, { call, put }) {
      const data = yield call(getAllRights, payload)
      if (isValid(data)) {
        yield put({
          type: 'queryRightsSuccess',
          payload: {
            rights: data.data,
          },
        })
      }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      dispatch({ type: 'getAllRights' })
      history.listen(location => {
        if (location.pathname === '/admin/role') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },
}
