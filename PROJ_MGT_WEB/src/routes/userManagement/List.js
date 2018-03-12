import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Popconfirm } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { constant } from '../../utils'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  const handleClick = (e) => {
    onEditItem(JSON.parse(e.target.dataset.resource))
  }

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userCode',
      key: 'userCode',
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span>{constant.USERTYPE[text - 1]}</span>,
    }, {
      title: 'Office Tel',
      dataIndex: 'officeTel',
      key: 'officeTel',
    }, {
      title: 'Entity',
      dataIndex: 'entity',
      key: 'entity',
    }, {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    }, {
      title: 'Operation',
      key: 'operate',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={onDeleteItem.bind(this, record.id)}>
              <a href="#" style={{ color: 'red' }}>Delete</a>
            </Popconfirm>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a data-resource={JSON.stringify(record)} onClick={handleClick}>Edit</a>
          </div>
        )
      },
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
