import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: 'Task Id',
      dataIndex: 'taskId',
      key: 'taskId',
      width: 150,
    }, {
      title: 'Task Type',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 100,
    }, {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 100,
    }, {
      title: 'Old Value',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 100,
    }, {
      title: 'New Value',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 100,
    }, {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
    }, {
      title: 'Operator',
      dataIndex: 'operator',
      key: 'operator',
      width: 250,
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }
  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
