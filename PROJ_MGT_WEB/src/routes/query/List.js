import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { Link } from 'dva/router'
import { getProject } from '../../services/public'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  getProject().then(function(res) {
    window.localStorage.proj = res.data.map(proj => proj.id + '&' + proj.projName)
  })
  const handleClick = (record, e) => {
    onEditItem(record)
  }

  let columns = [
    {
      title: 'Num',
      dataIndex: 'num',
      key: 'num',
      width: 50,
    }, {
      title: 'Task Id',
      dataIndex: 'taskId',
      key: 'taskId',
      width: 60,
      render: (text, record) => <Link style={{ textDecoration: 'underline' }} to={{ pathname: `case/${record.taskId}`, query: { taskType: record.taskType } }}>{text}</Link>,
    }, {
      title: 'Task Type',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 80,
    }, {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
    }, {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 90,
    }, {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
    }, {
      title: 'Start Date',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 90,
    }, {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 90,
    },
  ]

  if (JSON.parse(window.localStorage.user).role && JSON.parse(window.localStorage.user).role.indexOf(0) > -1) {
    columns.push({
      title: 'Operation',
      key: 'operate',
      width: 100,
      render: (record) => {
        if (record.taskType === 'Project') {
          return <Link style={{ textDecoration: 'underline' }} to={`projectInfo/${record.taskId}`}>Edit</Link>
        } else {
          return <Link style={{ textDecoration: 'underline' }} to={`issueInfo/${record.taskId}`}>Edit</Link>
        }
      },
    })
  }

  const getBodyWrapperProps = {
    page: location.query.pageNo,
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
