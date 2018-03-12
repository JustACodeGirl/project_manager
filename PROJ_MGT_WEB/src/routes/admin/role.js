import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import AdminRoleList from '../../components/common/list'
import AdminRoleSearch from '../../components/common/search'
import RoleAddModal from '../../components/admin/roleAddModal'
import RoleEditModal from '../../components/admin/roleEditModal'

function AdminRole ({ location, dispatch, adminRoles, loading }) {
  const { list, rights, currentItem, modalVisible, selectedRowKeys } = adminRoles
  const roleAddModalProps = {
    item: {},
    visible: modalVisible === 1,
    onOk (data) {
      dispatch({
        type: 'adminRoles/create',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'adminRoles/hideModal',
      })
    },
  }
  const roleEditModalProps = {
    item: currentItem,
    rights,
    visible: modalVisible === 2,
    onOk (data) {
      dispatch({
        type: 'adminRoles/config',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'adminRoles/hideModal',
      })
    },
  }

  const onEditItem = (item) => {
    dispatch({
      type: 'adminRoles/showEditModal',
      payload: {
        modalType: 'update',
        currentItem: item,
      },
    })
  }

  const roleListProps = {
    dataSource: list,
    loading,
    location,
    onPageChange (page) {
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
        type: 'adminRoles/delete',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (_selectedRowKeys) => {
        dispatch({
          type: 'adminRoles/selectRowKeys',
          payload: _selectedRowKeys,
        })
      },
    },
    columns: [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
      }, {
        title: '描述',
        dataIndex: 'roleDesc',
        key: 'roleDesc',
      }, {
        title: '操作',
        key: 'operation',
        width: 150,
        render: (text, record) => (
          <span onClick={(e) => { e.stopPropagation() }}>
            <a onClick={() => { onEditItem(record) }}>配置角色权限</a>
          </span>
        ),
      },
    ],
  }

  const roleSearchProps = {
    selectedRowKeys,
    showSearch: false,
    placeHolder: '输入角色名称',
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin/role',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/admin/role',
      }))
    },
    onAdd () {
      dispatch({
        type: 'adminRoles/showAddModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onDeleteItems (ids) {
      dispatch({
        type: 'adminRoles/delete',
        payload: ids[0],
      })
    },
    onReload () {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
        },
      }))
    },
  }

  const RoleAddModalGen = () =>
    <RoleAddModal {...roleAddModalProps} />

  const RoleEditModalGen = () =>
    <RoleEditModal {...roleEditModalProps} />

  return (
    <div className="content-inner">
      <AdminRoleSearch {...roleSearchProps} />
      <AdminRoleList {...roleListProps} />
      <RoleAddModalGen />
      <RoleEditModalGen />
    </div>
  )
}

AdminRole.propTypes = {
  adminRoles: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ adminRoles, loading }) => ({ adminRoles, loading: loading.models.adminRoles }))(AdminRole)
