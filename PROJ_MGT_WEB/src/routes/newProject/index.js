import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, DatePicker, message, Button } from 'antd'
import { UserRemoteSelect } from '../../components'
import { addProject } from '../../services/public'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const Detail = ({
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
}) => {
  window.localStorage.removeItem('caseInfo')
  const handleOk = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      console.log('Received values of form: ', values)
      let data = {
        ...getFieldsValue(),
      }
      data.startTime = data.startTime ? data.startTime.format('YYYY-MM-DD') : ''
      data.deadline = data.deadline ? data.deadline.format('YYYY-MM-DD') : ''
      data.relatedUser = data.relatedUser ? Array.isArray(data.relatedUser) ? data.relatedUser : data.relatedUser.split(',') : [],
      data.ccUser =  data.ccUser ? Array.isArray(data.ccUser) ? data.ccUser : data.ccUser.split(',') : [],
      addProject(data).then(function (res) {
        if(res.stateCode ==="ProjectExist"){
          message.error("Project has existed!");
        }
        else if (res.stateCode === 'SUCCESS') {
          message.success('Create Success')
          const fields = getFieldsValue()
          for (let item in fields) {
            if ({}.hasOwnProperty.call(fields, item)) {
              if (item === 'pm' || item === 'relatedUser' || item === 'ccUser') {
                fields[item] = []
              } else {
                if (fields[item] instanceof Array) {
                  fields[item] = []
                } else {
                  fields[item] = undefined
                }
              }
            }
          }
          setFieldsValue(fields)
        } else {
          message.error(res.stateCode)
        }
      })
    })
  }

  const disabledStartDate = (startValue) => {
    const endValue = getFieldValue('deadline')
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  const disabledEndDate = (endValue) => {
    const startValue = getFieldValue('startTime')
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  const onChange = (field, value) => {
    setFieldsValue({
      [field]: value,
    })
  }

  const onStartChange = (value) => {
    onChange('startTime', value)
  }

  const onEndChange = (value) => {
    onChange('deadline', value)
  }

  const handleStartOpenChange = (open) => {
    if (!open) {
    }
  }

  const handleEndOpenChange = (open) => {
  }

  return (
    <Form layout="horizontal" style={{ paddingTop: 20 }}>
      <FormItem label="Project Name" hasFeedback {...formItemLayout}>
        {getFieldDecorator('projName', {
          initialValue: item.projName,
          rules: [
            {
              required: true,
              max: 50,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem label="PM" hasFeedback {...formItemLayout}>
        {getFieldDecorator('pm', {
          initialValue: item.pm,
          rules: [
            {
              required: true,
            },
          ],
        })(<UserRemoteSelect />)}
      </FormItem>
      <FormItem label="Start Date" hasFeedback {...formItemLayout}>
        {getFieldDecorator('startTime', {
          initialValue: item.startTime,
          rules: [
            {
              required: true,
            },
          ],
        })(<DatePicker disabledDate={disabledStartDate} onChange={onStartChange} onOpenChange={handleStartOpenChange} format={'YYYY-MM-DD'} />)}
      </FormItem>
      <FormItem label="Keywords" hasFeedback {...formItemLayout}>
        {getFieldDecorator('keywords', {
          initialValue: item.keywords,
          rules: [
            {
              max: 50,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem label="Project Description" hasFeedback {...formItemLayout}>
        {getFieldDecorator('description', {
          initialValue: item.description,
          rules: [
            {
              max: 500,
            },
          ],
        })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
      </FormItem>
      <FormItem label="Project Related" hasFeedback {...formItemLayout}>
        {getFieldDecorator('relatedUser', {
          initialValue: item.relatedUser,
        })(<UserRemoteSelect />)}
      </FormItem>
      <FormItem label="Project CC" hasFeedback {...formItemLayout}>
        {getFieldDecorator('ccUser', {
          initialValue: item.ccUser,
        })(<UserRemoteSelect />)}
      </FormItem>
      <FormItem label="Project Priority" hasFeedback {...formItemLayout}>
        {getFieldDecorator('priority', {
          initialValue: item.priority,
        })(<Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a priority level"
          optionFilterProp="children"
        >
          <Option value="1">Critical</Option>
          <Option value="2">High</Option>
          <Option value="3">Medium</Option>
          <Option value="4">Low</Option>
        </Select>)}
      </FormItem>
      <FormItem label="Deadline" hasFeedback {...formItemLayout}>
        {getFieldDecorator('deadline', {
          initialValue: item.deadline,
        })(<DatePicker disabledDate={disabledEndDate} format="YYYY-MM-DD" onChange={onEndChange} onOpenChange={handleEndOpenChange} />)}
      </FormItem>
      <FormItem wrapperCol={{ span: 8, offset: 16 }}>
        <Button type="primary" htmlType="submit" onClick={handleOk}>
          Submit
        </Button>
      </FormItem>
    </Form>
  )
}

Detail.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(Detail)
