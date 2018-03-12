import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import { constant } from '../../utils'
import styles from './modal.less'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
}

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const checkPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('newPassword')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  return (
    <div>
      <Modal {...modalOpts} style={{ padding: 1 }}>
        <Form layout="horizontal" className={styles.form}>
          <FormItem
            {...formItemLayout}
            label="Old Password"
            hasFeedback
          >
            {getFieldDecorator('oldPassword', {
              rules: [{
                required: true, message: 'Please input your password!',
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="New Password"
            hasFeedback
          >
            {getFieldDecorator('newPassword', {
              rules: [{
                required: true, message: 'Please input right password!', min: 6, max: 50
              }],
            })(
              <Input type="password"  placeholder="Enter password length no less than 6 bits" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Confirm Password"
            hasFeedback
            placeholder="Enter password length no less than 6 bits"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Please confirm your password!', min: 6, max: 50
              }, {
                validator: checkPassword,
              }],
            })(
              <Input type="password" placeholder="Enter password length no less than 6 bits" />
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
