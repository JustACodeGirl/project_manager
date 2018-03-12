import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import AdminUserList from '../../components/common/list'
import AdminUserSearch from '../../components/common/search'
import AdminUserModal from '../../components/admin/userModal'

function AdminList ({ location, dispatch, adminList }) {
  const { list, roleList, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = adminList
  const userModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    roles: roleList,
    onOk (data) {
      dispatch({
        type: `adminList/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'adminList/hideModal',
      })
    },
  }

  const onEditItem = (item) => {
    dispatch({
      type: 'adminList/showModal',
      payload: {
        modalType: 'update',
        currentItem: item,
      },
    })
  }

  const adminListProps = {
    dataSource: list,
    pagination,
    location,
    onPageChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          pageNo: page.current - 1,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'adminList/delete',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (_selectedRowKeys) => {
        dispatch({
          type: 'adminList/selectRowKeys',
          payload: _selectedRowKeys,
        })
      },
    },
    columns: [
      {
        title: '用户名',
        dataIndex: 'userCode',
        key: 'userCode',
      }, {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
      }, {
        title: '角色',
        dataIndex: 'roleNames',
        key: 'roleNames',
      }, {
        title: '操作',
        key: 'operation',
        width: 150,
        render: (text, record) => (
          <span onClick={(e) => { e.stopPropagation() }}>
            <a onClick={() => { onEditItem(record) }}>编辑</a>
          </span>
        ),
      },
    ],
  }

  const adminSearchProps = {
    selectedRowKeys,
    showSearch: false,
    placeHolder: '用户名/姓名/角色',
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin/list',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/admin/list',
      }))
    },
    onAdd () {
      dispatch({
        type: 'adminList/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onDeleteItems (ids) {
      dispatch({
        type: 'adminList/delete',
        payload: ids[0],
      })
    },
    onReload () {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
        },
      }))
    },
  }

  const AdminUserModalGen = () =>
    <AdminUserModal {...userModalProps} />

  return (
    <div className="content-inner">
      <AdminUserSearch {...adminSearchProps} />
      <AdminUserList {...adminListProps} />
      <AdminUserModalGen />
    </div>
  )
}

AdminList.propTypes = {
  adminList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ adminList, loading }) => ({ adminList, loading: loading.models.adminList }))(AdminList)
