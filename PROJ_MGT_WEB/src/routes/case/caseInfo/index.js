import { createForm } from 'rc-form'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'dva'
import { Form, Input, Select, DatePicker, Upload, message, Button, Icon } from 'antd'
import { UserRemoteSelect } from '../../../components'
import { open } from '../../../services/case'
import { config, constant } from '../../../utils'
const { api } = config
const { upload } = api
import styles from './index.less'

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
    const { getFieldDecorator, getFieldsValue, validateFields, getFieldValue } = this.props.form
    const item = this.props.data

    const disabledStartDate = (endValue) => {
      const startValue = moment(getFieldValue('startTime'))
      if (!endValue || !startValue) {
        return false
      }
      return endValue.valueOf() <= startValue.valueOf()
    }

    const handleOk = () => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        console.log('Received values of form: ', values)
        let data = {
          ...getFieldsValue(),
        }
        let attachmentIds = ''
        if (data.attachment) {
          data.attachment.fileList.map((item, index) => {
            attachmentIds += (item.response.data.id + (index === data.attachment.fileList.length - 1 ? '' : ','))
          })
        }
        const openProjectInfo = {
          id: item.id,
          keywords: data.keywords,
          description: data.description,
          updateTime: data.updateTime,
          relatedUser: data.relatedUser ? Array.isArray(data.relatedUser) ? data.relatedUser : data.relatedUser.split(',') : [],
          ccUser: data.ccUser ? Array.isArray(data.ccUser) ? data.ccUser : data.ccUser.split(',') : [],
          priority: isNaN(data.priority) ? (constant.PRIORITY.indexOf(data.priority) + 1) : data.priority,
          deadline: data.deadline.format('YYYY-MM-DD'),
          attachmentIds: attachmentIds,
        }
        open(openProjectInfo).then(function (data) {
          if(data.stateCode=="TIMESTAMP_IS_NULL"){
            message.error('timestamp is null')
          }else if(data.stateCode=="OUT_OF_DATE"){
            message.error('case is out of time,please refresh')
          } else if (data.stateCode=="SUCCESS") {
            message.success('Open Success')
            history.back()
          } else {
            message.error('Open Project Failed, Please Check!')
          }
        })
      })
    }

    const props = {
      name: 'file',
      action: upload,
      headers: {
        authorization: 'authorization-text',
      },
      data: {
        projId: this.props.data.id
      },
      onChange (info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
    }

    return (
      <Form layout="horizontal" style={{ paddingTop: 20 }}>
        <FormItem label="Project Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('pName', {
            initialValue: item.projName,
          })(<span>{item.projName}</span>)}
        </FormItem>
        <FormItem label="PM" hasFeedback {...formItemLayout}>
          {getFieldDecorator('pm', {
            initialValue: item.pm,
          })(<span>{item.pm}</span>)}
        </FormItem>
        <FormItem label="Start Date" hasFeedback {...formItemLayout}>
          {getFieldDecorator('startTime', {
            initialValue: item.startTime,
          })(<span>{item.startTime}</span>)}
        </FormItem>
        <FormItem label="updateTime" hasFeedback {...formItemLayout} style={{display:"none"}}>
          {getFieldDecorator('updateTime', {
            initialValue: item.updateTime,
          })(<span>{item.updateTime}</span>)}
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
        <FormItem label="Project Related" {...formItemLayout}>
          {getFieldDecorator('relatedUser', {
            initialValue: item.relatedUser,
            rules: [
              {
                required: true,
              },
            ],
          })(<UserRemoteSelect />)}
        </FormItem>
        <FormItem label="Project CC" {...formItemLayout}>
          {getFieldDecorator('ccUser', {
            initialValue: item.ccUser,
          })(<UserRemoteSelect />)}
        </FormItem>
        <FormItem label="Project Priority" hasFeedback {...formItemLayout}>
          {getFieldDecorator('priority', {
            initialValue: constant.PRIORITY[item.priority - 1],
            rules: [
              {
                required: true,
              },
            ],
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
            initialValue: item.deadline ? moment(item.deadline) : item.deadline,
            rules: [
              {
                required: true,
              },
            ],
          })(<DatePicker disabledDate={disabledStartDate} />)}
        </FormItem>
        <FormItem label="Attachment" hasFeedback {...formItemLayout}>
          {getFieldDecorator('attachment', {
          })(<Upload {...props}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>)}
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
    )
  }
}

const store = createStore(combineReducers({
  form,
}))

const NewForm = connect((state) => {
  return {
    formState: {
      type: 'open',
    },
  }
})(Form.create({
  mapPropsToFields(props) {
    console.log('mapPropsToFields', props)
    return {
      data: props.data,
    }
  },
})(detailForm))

class Detail extends React.Component {
  render () {
    return (<Provider store={store}>
      <div>
        <NewForm {...this.props.caseInfo} />
      </div>
    </Provider>)
  }
}

Detail.propTypes = {
  caseInfo: PropTypes.object,
}

export default connect(({ caseInfo, loading }) => ({ caseInfo, loading }))(Detail)
