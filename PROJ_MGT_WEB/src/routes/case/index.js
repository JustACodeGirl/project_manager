import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Tab from './Tabs'
import List from './List'
import Modal from './Modal'
import { getOpenProject } from '../../services/public'

const Case = ({ location, dispatch, pendingCase, loading }) => {
  getOpenProject().then(function(res) {
    window.localStorage.openproj = res.data.length >=1 ? res.data.map(proj => proj.id + '&' + proj.projName) : []
  })
  const { list, pagination, currentItem, modalVisible, inputVisible, operateType, modalType, modalId, modalUpdateTime, modalStatus, isMotion, tabsnum } = pendingCase;
  const modalProps = {
    type: operateType,
    visible: modalVisible,
    maskClosable: false,
    width: 800,
    confirmLoading: loading.effects['user/update'],
    title: operateType,
    id: modalId,
    modalType: modalType,
    modalUpdateTime: modalUpdateTime,
    modalStatus: modalStatus,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      console.log(data.results || data.actualCost);
      if (data && data.comments && (data.result || (data.actualCost ? data.actualCost : true)) ) {
        dispatch({
          type: `pendingCase/${operateType}`,
          payload: data,
        })
      }
    },
    onCancel () {
      dispatch({
        type: 'pendingCase/hideModal',
      })
    },
  }

  const tabProps = {
    onChange (tabskey) {
      dispatch({
        type: 'pendingCase/tabsChange',
        payload: { tabsnum: tabskey },
      })
    },
  }

  const listProps = {
    dataSource: list,
    inputVisible,
    loading: loading.effects['user/query'],
    pagination,
    location,
    isMotion,
    tabsnum,
    updateProjectProgress (id, progress) {
      dispatch({
        type: 'pendingCase/updateProjectProgress',
        payload: {
          progress: parseInt(progress, 10),
          id: id,
        },
      })
    },
    updateIssueProgress (id, progress) {
      dispatch({
        type: 'pendingCase/updateIssueProgress',
        payload: {
          progress: parseInt(progress, 10),
          id: id,
        },
      })
    },
    showInput (id) {
      dispatch({
        type: 'pendingCase/showInput',
        payload: id,
      })
    },
    hideInput () {
      dispatch({
        type: 'pendingCase/hideInput',
        payload: {},
      })
    },
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          pageNo: page.current,
          pageSize: page.pageSize,
          tabsnum:tabsnum,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'pendingCase/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'pendingCase/showModal',
        payload: {
          operateType: 'update',
          currentItem: item,
        },
      })
    },
    onAdd (e) {
      const optype = e.target.text
      const id = e.target.dataset.id
      const modaltype = e.target.dataset.type
      const modalupdateTime = e.target.dataset.updatetime
      const status = e.target.dataset.status
      dispatch({
        type: 'pendingCase/showModal',
        payload: {
          operateType: optype,
          modalId: id,
          modalType: modaltype,
          modalUpdateTime: modalupdateTime,
          modalStatus: status
        },
      })
    },
  }

  return (
    <div className="content-inner">
      <Tab {...tabProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Case.propTypes = {
  pendingCase: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ pendingCase, loading }) => ({ pendingCase, loading }))(Case)
