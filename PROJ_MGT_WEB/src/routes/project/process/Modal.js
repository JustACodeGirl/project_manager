import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, Cascader, Select, Checkbox } from 'antd'
import { Editor, CheckBox } from '../../../components'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
}

const plainOptions = ['Apple', 'Pear', 'Orange']
const defaultCheckedList = ['Apple', 'Orange']

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
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
        key: item.key,
      }
      data.address = data.address.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="Comments" hasFeedback {...formItemLayout}>
          {getFieldDecorator('comments', {
            initialValue: item.pName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Editor />)}
        </FormItem>
        <FormItem label="To" hasFeedback {...formItemLayout}>
          {getFieldDecorator('to', {
            initialValue: item.pName,
            rules: [
              {
                required: true,
              },
            ],
          })(<CheckBox
             />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
