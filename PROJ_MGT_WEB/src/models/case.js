import { getToDo, getRelated, getCC, updateProjectProgress, updateIssueProgress, iaudit, isolve, ifinish, pfinish, iclose, pclose, pcomment, icomment } from '../services/case'
import { parse } from 'qs'
import { message } from 'antd'
import { routerRedux } from 'dva/router'

export default {

  namespace: 'pendingCase',

  state: {
    list: [],
    tabsnum: [],
    currentItem: {},
    modalVisible: false,
    inputVisible: 0,
    operateType: '',
    modalType: '',
    modalId: '',
    modalUpdateTime: '',
    modalStatus: '',
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
        if (location.pathname === '/pendingCase') {
          if (window.localStorage.caseInfo&&JSON.stringify(location.query)=="{}") {
            const caseInfo = JSON.parse(window.localStorage.caseInfo)
            dispatch({
              type: 'tabsChange',
              payload: {
                tabsnum: caseInfo.tabsnum,
                pageNo: caseInfo.pageNo,
                pageSize: caseInfo.pageSize,
              }
            })
          } else {
            dispatch({
              type: 'query',
              payload: location.query,
            })
          }
        }
      })
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      let data = {};
      const params ={
        pageNo:payload.pageNo,
        pageSize:payload.pageSize,
      };
      if(parseInt(payload.tabsnum, 10) === 3){
         data = yield call(getRelated, params);
      }
      else if(parseInt(payload.tabsnum, 10) === 2){
         data = yield call(getCC, params);
      }else{
         data = yield call(getToDo, params);
      }
      if (data.stateCode === 'SUCCESS') {
        if (data.data.results) {
          data.data.results.map((item, index) => {
            item.key = index + 1
            item.menu = item.menu ? item.menu.split(',') : []
          })
        }
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.results,
            pagination: {
              current: (payload && Number(payload.pageNo)) || 1,
              pageSize: (payload && Number(payload.pageSize)) || 10,
              total: data.data.totalRecords,
            },
            tabsnum: (window.localStorage.caseInfo && JSON.parse(window.localStorage.caseInfo).tabsnum) || 1,
          },
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    *tabsChange ({ payload }, { call, put }) {
      let data = {}
      if (parseInt(payload.tabsnum, 10) === 1) {
        data = yield call(getToDo, payload)
      } else if (parseInt(payload.tabsnum, 10) === 2) {
        data = yield call(getCC, payload)
      } else {
        data = yield call(getRelated, payload)
      }
      if (data.stateCode === 'SUCCESS') {
        if (data.data.results) {
          data.data.results.map((item, index) => {
            item.key = index + 1
            item.menu = item.menu ? item.menu.split(',') : []
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
            tabsnum: parseInt(payload.tabsnum, 10),
          },
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      }
    },
    *updateProjectProgress ({ payload }, { call, put }) {
      const data = yield call(updateProjectProgress, payload)
      const caseInfo = JSON.parse(window.localStorage.caseInfo)
      if (data.stateCode=="SUCCESS") {
        message.success('Edit Success')
        yield put({ type: 'hideInput' })
        yield put({
          type: 'query' ,
          payload: caseInfo
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    *updateIssueProgress ({ payload }, { call, put }) {
      const data = yield call(updateIssueProgress, payload)
      const caseInfo = JSON.parse(window.localStorage.caseInfo)
      if (data.stateCode=="SUCCESS") {
        message.success('Edit Success')
        yield put({ type: 'hideInput' })
        yield put({
          type: 'query',
          payload: caseInfo
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    *Audit ({ payload }, { call, put }) {
      const data = yield call(iaudit, payload);
      const caseInfo = JSON.parse(window.localStorage.caseInfo)
      if(data.stateCode=="TIMESTAMP_IS_NULL"){
        message.error('timestamp is null')
      }else if(data.stateCode=="OUT_OF_DATE"){
        message.error('Date is out of time,please refresh')
        yield put({ type: 'hideModal' })
      } else if (data.stateCode=="SUCCESS") {
        if (parseInt(payload.result, 10) === 1) {
          message.success('Approve Success')
        } else {
          message.success('Reject Success')
        }
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload:caseInfo
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    *Solve ({ payload }, { call, put }) {
      const data = yield call(isolve, payload);
      const caseInfo = JSON.parse(window.localStorage.caseInfo)
      if(data.stateCode=="TIMESTAMP_IS_NULL"){
        message.error('timestamp is null')
      }else if(data.stateCode=="OUT_OF_DATE"){
        message.error('Date is out of time,please refresh')
        yield put({ type: 'hideModal' })
      }
      else if (data.stateCode=="SUCCESS") {
        message.success('Solve Success')
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload:caseInfo
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    *Close ({ payload }, { call, put }) {
      let data
      const caseInfo = JSON.parse(window.localStorage.caseInfo)
      if (payload.type === 'Project') {
        data = yield call(pclose, payload)
      } else {
        data = yield call(iclose, payload)
      }
      if(data.stateCode=="TIMESTAMP_IS_NULL"){
        message.error('timestamp is null')
      }else if(data.stateCode=="OUT_OF_DATE"){
        message.error('Date is out of time,please refresh')
        yield put({ type: 'hideModal' })
      } else if (data.stateCode=="SUCCESS") {
        if (parseInt(payload.result, 10) === 1) {
          message.success('Close Success')
        } else {
          message.success('Rollback Success')
        }
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload:caseInfo

        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    *Finish ({ payload }, { call, put }) {
      let data;
      if (payload.type === 'Project') {
        data = yield call(pfinish, payload)
      } else {
        data = yield call(ifinish, payload)
      }
      const caseInfo = JSON.parse(window.localStorage.caseInfo)
      if(data.stateCode=="TIMESTAMP_IS_NULL"){
        message.error('timestamp is null')
      }else if(data.stateCode=="OUT_OF_DATE"){
        message.error('Date is out of time,please refresh')
        yield put({ type: 'hideModal' })
      } else if (data.stateCode=="SUCCESS") {
        message.success('Finish Success')
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload:caseInfo
        })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    *Comment ({ payload }, { call, put }) {
      let data
      if (payload.type === 'Project') {
        data = yield call(pcomment, payload)
      } else {
        data = yield call(icomment, payload)
      }
      if (data.stateCode=="SUCCESS") {
        message.success('Comment Success')
        yield put({ type: 'hideModal' })
      } else if (data.stateCode === 'InvalidAccessToken' || data.stateCode === 'NotLogin'){
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination, tabsnum } = action.payload
      window.localStorage.caseInfo = JSON.stringify({ tabsnum: tabsnum, pageNo: pagination.current, pageSize: pagination.pageSize })
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        tabsnum: parseInt(tabsnum, 10),
      }
    },

    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true, modalType: action.payload.modalType, modalId: action.payload.modalId, modalUpdateTime: action.payload.modalUpdateTime, operateType: action.payload.operateType, modalStatus: action.payload.modalStatus }
    },

    showInput (state, action) {
      return { ...state, inputVisible: parseInt(action.payload, 10) }
    },

    hideInput (state, action) {
      return { ...state, ...action.payload, inputVisible: 0 }
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
