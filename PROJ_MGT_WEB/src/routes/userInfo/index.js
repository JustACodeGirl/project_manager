import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import Modal from './Modal'
import { constant } from '../../utils'
import { Table, Row, Col, Button, Card } from 'antd'

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
  style: {
    marginBottom: 12,
  },
}

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const columns = [
  {
    dataIndex: 'key',
    key: 'key',
  }, {
    dataIndex: 'value',
    key: 'value',
  },
]

function cancel () {
  history.back()
}

const UserInfo = ({ dispatch, userInfo }) => {
  const { data, modalVisible } = userInfo

  const modalProps = {
    visible: modalVisible,
    maskClosable: false,
    title: 'Chang Password',
    wrapClassName: 'vertical-center-modal',
    onOk (value) {
      dispatch({
        type: 'userInfo/changePassword',
        payload: value,
      })
    },
    onCancel () {
      dispatch({
        type: 'userInfo/hideModal',
      })
    },
  }

  function onAdd () {
    dispatch({
      type: 'userInfo/showModal',
      payload: {},
    })
  }

  let dataSource = data
  dataSource = [{ key: 'User Id:', value: data.id },
                { key: 'Company:', value: data.company },
                { key: 'Department:', value: data.department },
                { key: 'Email:', value: data.email },
                { key: 'Entity:', value: data.entity },
                { key: 'HomeTel:', value: data.homeTel },
                { key: 'Location:', value: data.location },
                { key: 'OfficeTel:', value: data.officeTel },
                { key: 'Title:', value: data.title },
                { key: 'UserCode:', value: data.userCode },
                { key: 'Type:', value: constant.USERTYPE[data.type-1]},
                { key: 'Role:', value: constant.USERROLE[data.role] }]

  return (
    <div className="content-inner">
      <Row>
        <Col span={20} offset={2}>
          <div style={{ marginLeft: 170 }}>
            <Button type="primary" onClick={onAdd}>Change Password</Button>
          </div>
          <Table className={styles.table} columns={columns} dataSource={dataSource} bordered pagination={false} size="middle" showHeader={false} />
        </Col>
      </Row>
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

UserInfo.propTypes = {
  userInfo: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ userInfo, loading }) => ({ userInfo, loading: loading.models.userInfo }))(UserInfo)
