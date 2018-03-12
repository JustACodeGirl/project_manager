import { createForm } from 'rc-form'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'dva'
import { Form, Input, Select, DatePicker, Upload, message, Button, Icon } from 'antd'
import { UserRemoteSelect, SearchInput } from '../../../components'
import { update } from '../../../services/case'
import { config, constant } from '../../../utils'
import styles from './index.less'

const { api } = config
const { upload } = api

const FormItem = Form.Item
const Option = Select.Option

function cancel () {
  history.back()
}

function form (state = {
  data: {},
}, action) {
  switch (action.type) {
    case 'save_fields':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class detailForm extends Component {
  static propTypes = {
    form: PropTypes.object,
  }

  render () {
    const { getFieldProps, getFieldError, getFieldDecorator, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = this.props.form
    let item = this.props.data
    const handleOk = () => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        console.log('Received values of form: ', values)
        let data = {
          ...getFieldsValue(),
        }
        data.relatedUser = data.relatedUser ? Array.isArray(data.relatedUser) ? data.relatedUser : data.relatedUser.split(',') : [],
        data.ccUser = data.ccUser ? Array.isArray(data.ccUser) ? data.ccUser : data.ccUser.split(',') : [],
        data.priority = isNaN(data.priority) ? (constant.PRIORITY.indexOf(data.priority) + 1) : data.priority,
        data.deadline = data.deadline ? data.deadline.format('YYYY-MM-DD') : '',
        data.startTime = data.startTime ? data.startTime.format('YYYY-MM-DD') : '',
        data.pm = data.pm ? data.pm.join(",") : ''
        item = {...item, ...data}
        update(item).then(function (res) {
          if (res.success) {
            message.success('Edit Success')
            history.back()
          } else {
            message.success('Open Project Failed, Please Check!')
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

    return (<div>
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
            initialValue: item.pm ? item.pm.split(',') : [],
            rules: [
              {
                required: true,
              },
            ],
          })(<UserRemoteSelect />)}
        </FormItem>
        <FormItem label="Start Date" hasFeedback {...formItemLayout}>
          {getFieldDecorator('startTime', {
            initialValue: item.startTime ? moment(item.startTime) : '',
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
          })(<Input type="textarea" placeholder="Autosize height with minimum and maximum number of lines" autosize={{ minRows: 2, maxRows: 6 }} />)}
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
            initialValue: item.priority ? constant.PRIORITY[item.priority - 1] : '',
          })(<Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a priority level"
            optionFilterProp="children"
          >
            <Option value="1">critical</Option>
            <Option value="2">high</Option>
            <Option value="3">medium</Option>
            <Option value="4">low</Option>
          </Select>)}
        </FormItem>
        <FormItem label="Deadline" hasFeedback {...formItemLayout}>
          {getFieldDecorator('deadline', {
            initialValue: item.deadline ? moment(item.deadline) : '',
          })(<DatePicker disabledDate={disabledEndDate} format="YYYY-MM-DD" onChange={onEndChange} onOpenChange={handleEndOpenChange} />)}
        </FormItem>
        <FormItem wrapperCol={{ span: 8, offset: 16 }} style={{ marginTop: -25 }}>
          <Button type="default" onClick={cancel}>
            cancel
          </Button>
          <Button style={{ marginLeft: 20 }} type="primary" htmlType="submit" onClick={handleOk}>
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>)
  }
}

const store = createStore(combineReducers({
  form,
}))

const NewForm = connect(({ projectInfo }) => {
  return {
    formState: {
      projectInfo: projectInfo,
    },
  }
})(Form.create({
  mapPropsToFields (props) {
    console.log('mapPropsToFields', props)
    return {
      data: props.data,
    }
  },
})(detailForm))

class Detail extends React.Component {
  render () {
    const projectInfo = this.props.projectInfo
    return (<Provider store={store}>
      <div>
        <NewForm {...projectInfo} />
      </div>
    </Provider>)
  }
}

Detail.propTypes = {
  projectInfo: PropTypes.object,
}

export default connect(({ projectInfo, loading }) => ({ projectInfo, loading }))(Detail)
