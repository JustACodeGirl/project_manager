import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, Modal, Select } from 'antd'
import { constant } from '../../utils'
import styles from './modal.less'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
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
    setFieldsValue,
  },
  entity,
  locations,
  entityChange,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue(),
      }
      const userRole = []
      if (data.role) {
        data.role.map(item => {
          if (item === 'Default CC') {
            userRole.push(1)
          } else if (item === 'Project Admin') {
            userRole.push(2)
          } else {
            return false
          }
        })
      }
      data.role = userRole
      if (item.id) {
        data.id = item.id
      }
      data.type = isNaN(data.type) ? (constant.USERTYPE.indexOf(data.type) + 1) : data.type
      onOk(data)
    })
  }

  const entityOptions = entity ? entity.map(type => <Option key={type}>{type}</Option>) : []

  const locationOptions = locations ? locations.map(type => <Option key={type}>{type}</Option>) : []

  const handleChange = (value) => {
    entityChange(value)
    console.log(setFieldsValue);
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (item === 'location') {
          fields[item] = ''
        }
      }
    }
    setFieldsValue(fields)
    console.log(fields)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  if (Object.keys(item).length > 0 ) {
    item.type = !isNaN(parseInt(item.type)) ? constant.USERTYPE[item.type - 1] : item.type
    let role = []
    if (item.role.length >= 1) {
      item.role.map(v => {
        role.push(constant.USERROLE[v - 1] || v)
      })
      item.role = role
    }
  }

  const checkNumber = (rule, value, callback) => {
    console.log(value);
    if (!isNaN(value)) {
      callback();
      return
    }
    callback('must be a number')
  }

  const easyCheckNumber = (rule, value, callback) => {
    console.log(value);
    if (!isNaN(value) || (!value)){
      callback();
      return
    }
    callback('must be a number')
  }

  const checkChange = (value) => {
    if (value.length <= 0) {
      value = ''
    }
    console.log(value)
  }

  return (
    <Modal {...modalOpts} style={{ padding: 1 }}>
      <Form layout="horizontal" className={styles.form}>
        <FormItem label="User Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('userCode', {
            initialValue: item.userCode,
            rules: [
              {
                required: true,
                max: 50,
                message: 'userName is required and less than 50 bytes'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Email" hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, max: 50,
            }],
          })(<Input />)}
        </FormItem>
        <FormItem label="Type" hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: item.type,
            rules: [
              {
                required: true,
              },
            ],
          })(<Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a type"
            optionFilterProp="children"
          >
            <Option value="1">OVT-EE</Option>
            <Option value="2">Non-OVT</Option>
          </Select>)}
        </FormItem>
        <FormItem label="Role" hasFeedback {...formItemLayout}>
          {getFieldDecorator('role', {
            initialValue: item.role && item.role.length > 0 ? item.role : '',
          })(<CheckboxGroup options={['Default CC', 'Project Admin']} onChange={checkChange}/>)}
        </FormItem>
        <FormItem label="Company" hasFeedback {...formItemLayout}>
          {getFieldDecorator('company', {
            initialValue: item.company,
            rules: [
              {
                max: 50,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Title" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: item.title,
            rules: [
              {
                max: 50,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Department" hasFeedback {...formItemLayout}>
          {getFieldDecorator('department', {
            initialValue: item.department,
            rules: [
              {
                max: 50,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Office Tel" hasFeedback {...formItemLayout}>
          {getFieldDecorator('officeTel', {
            initialValue: item.officeTel,
            rules: [
              {
                required: true,
                max: 20,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Home Tel" hasFeedback {...formItemLayout}>
          {getFieldDecorator('homeTel', {
            initialValue: item.homeTel,
            rules: [
              {
                required: false,
                max: 20,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Entity" hasFeedback {...formItemLayout}>
          {getFieldDecorator('entity', {
            initialValue: item.entity,
            rules: [
              {
                required: true,
              },
            ],
          })(<Select
            showSearch
            style={{ width: '100%' }}
            size="large"
            placeholder="Select a entity"
            onChange={handleChange}
          >
            {entityOptions}
          </Select>)}
        </FormItem>
        <FormItem label="Location" hasFeedback {...formItemLayout}>
          {getFieldDecorator('location', {
            initialValue: item.location ? item.location : '',
            rules: [
              {
                required: true,
              },
            ],
          })(<Select
            showSearch
            style={{ width: '100%' }}
            size="large"
            placeholder="Select a location"
          >
            {locationOptions}
          </Select>)}
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
