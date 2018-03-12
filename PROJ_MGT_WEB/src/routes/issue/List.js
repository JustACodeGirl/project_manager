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
      title: 'Issue Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      className: styles.avatar,
      render: (text, record) => <Link to={`issue/${record.id}`}>{text}</Link>,
    }, {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: 100,
    }, {
      title: 'Start Date',
      dataIndex: 'date',
      key: 'date',
      width: 200,
    }, {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      width: 100,
      render: (text, record) => <Link to={`project/${record.id}`}>{text}</Link>,
    }, {
      title: 'Operation',
      key: 'operate',
      width: 250,
      render: (text, record) => {
        return (
          <div>
            <Link to={`project/${record.id}`}>Configuration</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Link to={`process/${record.id}`}>process</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
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
