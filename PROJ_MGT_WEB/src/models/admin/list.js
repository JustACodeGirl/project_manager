import { create, remove, update, query } from '../../services/admin/list';
import { query as queryRoles } from '../../services/admin/role';

const isValid = data => data && data.stateCode === 'SUCCESS';

export default {
  namespace: 'adminList',
  state: {
    list: [],
    roleList: [],
    currentItem: {},
    modalVisible: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} items`,
      current: 1,
      total: null,
    },
    selectedRowKeys: [],
  },
  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload;
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        } };
    },
    queryRolesSuccess (state, action) {
      const { roleList } = action.payload;
      return { ...state, roleList };
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal (state) {
      return { ...state, modalVisible: false };
    },
    selectRowKeys (state, action) {
      return { ...state, selectedRowKeys: [...action.payload] };
    },
  },
  effects: {
    *query ({ payload }, { call, put }) {
      const data = yield call(query, payload);
      if (isValid(data)) {
        const { results, pageNo, totalRecords } = data.data;
        yield put({
          type: 'querySuccess',
          payload: {
            list: results,
            pagination: {
              current: pageNo + 1,
              total: totalRecords,
            },
          },
        });
      }
    },
    *queryRoles ({ payload }, { call, put }) {
      const data = yield call(queryRoles, payload);
      if (isValid(data)) {
        yield put({
          type: 'queryRolesSuccess',
          payload: {
            roleList: data.data,
          },
        });
      }
    },
    *'delete' ({ payload }, { call, put }) {
      yield call(remove, { roleId: payload.toString() });
      yield put({ type: 'selectRowKeys', payload: [] });
      yield put({ type: 'query' });
    },
    *create ({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield call(create, payload);
      yield put({ type: 'query' });
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      const id = yield select(({ adminList }) => (adminList.currentItem.id));
      const newAdmin = { ...payload, id };
      yield call(update, newAdmin);
      yield put({ type: 'query' });
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/admin/list') {
          dispatch({
            type: 'query',
            payload: location.query,
          });
        }
      });
      dispatch({
        type: 'queryRoles',
      });
    },
  },
};
