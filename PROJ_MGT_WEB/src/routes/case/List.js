import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Input, Button, Tooltip, InputNumber } from 'antd'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { Link } from 'dva/router'
import { getProject } from '../../services/public'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, showInput, hideInput, inputVisible, updateProjectProgress, updateIssueProgress, onAdd, isMotion,
  tabsnum, location, ...tableProps }) => {

  getProject().then(function(res) {
    window.localStorage.proj = res.data.length > 0 ? res.data.map(proj => proj.id + '&' + proj.projName) : []
  })

  const changeProgress = (e) => {
    if(navigator.userAgent.indexOf("Chrome")>=0){
      let id = e.target.parentNode.parentNode.dataset.id.split(",")[0]
      let taskType = e.target.parentNode.parentNode.dataset.id.split(",")[1]
      let progress = e.target.parentNode.parentNode.getElementsByTagName('Input')[0].value
      if (taskType === 'Project') {
        updateProjectProgress(id, progress)
      } else if (taskType === 'Issue'||taskType === 'Request') {
        updateIssueProgress(id, progress)
      }
    }else{
      let id = e.target.parentNode.dataset.id.split(",")[0]
      let taskType = e.target.parentNode.dataset.id.split(",")[1]
      let progress = e.target.parentNode.parentNode.getElementsByTagName('Input')[0].value
      if (taskType === 'Project') {
        updateProjectProgress(id, progress)
      } else if (taskType === 'Issue'||taskType === 'Request') {
        updateIssueProgress(id, progress)
      }
    }
  }

  const changeView = (e) => {
    showInput(e.target.parentNode.dataset.id)
  }

  const onChange = (v) => {
    let value
    console.log(v)
    value = v
  }

  const columns = [
    {
      title: 'Num',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      render: (index) => <p>{index}</p>,
    }, {
      title: 'Task Id',
      dataIndex: 'taskId',
      key: 'taskId',
      width: 60,
      className: styles.avatar,
    }, {
      title: 'Task Type',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 80,
    }, {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
      render: (text, record) => <Link style={{ textDecoration: 'underline' }} to={{ pathname: `case/${record.taskId}`, query: { taskType: record.taskType } }}>{text}</Link>,
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
    }, {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (text, record) => {
        if (tabsnum === 1 && (record.menu.includes('Finish') || record.menu.includes('Solve'))) {
          return (
            <div data-id={record.taskId}>
              {inputVisible !== record.taskId && <Tooltip title='Click to change'>
                <a style={{ textDecoration: 'underline', color: (text >= 50 ? 'green' : 'red') }} onClick={changeView}>{record.progress}%</a>
              </Tooltip>}
              {inputVisible === record.taskId && <div data-id={[record.taskId,record.taskType]} data-tasktype={record.taskType}>
                <InputNumber className={styles.progress} min={0} max={100} defaultValue={record.progress} onChange={onChange} />%
                <Button shape="circle" icon="check" style={{ color: 'green' }} onClick={changeProgress} size="small" />
                <Button shape="circle" icon="close" style={{ color: 'red' }} size="small" onClick={hideInput} />
              </div>}
            </div>
          )
        } else {
          return (
            <p>{record.progress}%</p>
          )
        }
      },
    }, {
      title: 'Instruction',
      dataIndex: 'instruction',
      key: 'instruction',
      width: 100,
    }, {
      title: 'Operation',
      key: 'menu',
      width: 250,
      render: (text, record) => {
        return (
          <div>
            {
              record.menu.map((item) => {
                if (item === 'New Issue') {
                  return <Link style={{ textDecoration: 'underline', marginRight: 20 }} to={{ pathname: 'newIssue', query: { projId: record.projId } }}>{item}</Link>
                } else if (item === 'Open') {
                  return <Link style={{ textDecoration: 'underline', marginRight: 20 }} to={`caseInfo/${record.taskId}`}>{item}</Link>
                } else if (item === 'Edit') {
                  return <Link style={{ textDecoration: 'underline', marginRight: 20 }} to={`editIssue/${record.taskId}`}>{item}</Link>
                } else {
                  return <Link style={{ textDecoration: 'underline', marginRight: 20 }} data-id={record.taskId} data-type={record.taskType} data-status={record.status} data-updateTime={record.updateTime} onClick={onAdd}>{item}</Link>
                }
              })
            }
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
        rowKey={record => record.key}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onAdd: PropTypes.func,
  showInput: PropTypes.func,
  hideInput: PropTypes.func,
  isMotion: PropTypes.bool,
  inputVisible: PropTypes.number,
  location: PropTypes.object,
}

export default List
