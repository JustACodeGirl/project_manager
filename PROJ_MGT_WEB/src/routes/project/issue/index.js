import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Icon } from 'antd'
import { Link } from 'dva/router'
import styles from './index.less'

const Issue = ({ issue }) => {
  const columns = [{
    title: 'Issue Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`issue/${record.id}`}>{text}</Link>,
  }, {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
  }, {
    title: 'Details',
    dataIndex: 'address',
    key: 'address',
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="#">Action 一 {record.name}</a>
        <span className="ant-divider" />
        <a href="#">Delete</a>
        <span className="ant-divider" />
        <a href="#" className="ant-dropdown-link">
          More actions <Icon type="down" />
        </a>
      </span>
    ),
  }]

  const dataSource = [{
    key: '1',
    name: 'John Brown',
    state: 'open',
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    state: 'close',
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    state: 'process',
    address: 'Sidney No. 1 Lake Park',
  }]

  return (<div className="content-inner">
    <Table dataSource={dataSource} columns={columns} />
  </div>)
}

Issue.propTypes = {
  issue: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ issue, loading }) => ({ issue, loading: loading.models.issue }))(Issue)
