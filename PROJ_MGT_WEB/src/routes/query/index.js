import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import QueryInput from '../../components/query/queryInput'
import List from './List'
import Modal from './Modal'
import Filter from './Filter'

const Query = ({ location, dispatch, query, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, statusOption, statusSelect } = query
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['user/update'],
    title: `${modalType === 'create' ? 'Create Project' : 'Update Project'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `query/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'query/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['user/query'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          pageNo: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'user/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'query/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const filterProps = {
    isMotion,
    statusOption,
    statusSelect,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          pageNo: 1,
          pageSize,
        },
      }))
    },
    taskTypeChange (value) {
      dispatch({
        type: 'query/typeChange',
        payload: {
          taskType: value,
        },
      })
    },
    reset () {
      dispatch({
        type: 'query/reset',
        payload: {},
      })
    },
    onAdd () {
      dispatch({
        type: 'user/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'user/switchIsMotion' })
    },
  }

  const queryInputProps = {
    onSimpleSearch: (queryInfo) => {
      dispatch({
        type: 'analyse/simpleQuery',
        payload: { keyWord: queryInfo },
      })
    },
    onAdvanceSearch: (queryInfo) => {
      dispatch({
        type: 'analyse/advanceQuery',
        payload: { cond: queryInfo },
      })
    },
    onExport: (queryInfo) => {
      dispatch({
        type: 'analyse/exportData',
        payload: { cond: queryInfo },
      })
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Query.propTypes = {
  query: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ query, loading }) => ({ query, loading }))(Query)
