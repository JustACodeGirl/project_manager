import { createForm } from 'rc-form'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'dva'
import { Form, Input, Select, DatePicker, Upload, message, Button, Icon, InputNumber } from 'antd'
import { UserRemoteSelect, SearchInput } from '../../../components'
import { updateIssue } from '../../../services/case'
import { getProject, deleteAttach } from '../../../services/public'
import { config, constant } from '../../../utils'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import styles from './index.less'

const { api } = config
const { upload } = api

const FormItem = Form.Item
const Option = Select.Option

function cancel () {
  history.back()
}

function form(state = {
  email: {
    value: 'x@gmail.com',
  },
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
    const { getFieldProps, getFieldError, getFieldDecorator, validateFields, getFieldsValue,  getFieldValue, setFieldsValue } = this.props.form
    let item = this.props.data
    console.log(item)
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
        data.type = isNaN(data.type) ? constant.TYPE.indexOf(data.type) : data.type
        data.priority = isNaN(data.priority) ? (constant.PRIORITY.indexOf(data.priority) + 1) : data.priority
        data.relatedUser = data.relatedUser ? Array.isArray(data.relatedUser) ? data.relatedUser : data.relatedUser.split(',') : [],
        data.ccUser = data.ccUser ? Array.isArray(data.ccUser) ? data.ccUser : data.ccUser.split(',') : [],
        data.deadline = data.deadline ? data.deadline.format('YYYY-MM-DD') : ''
        data.startTime = data.startTime ? data.startTime.format('YYYY-MM-DD') : ''
        item = { ...item, ...data }
        item.attachmentIds = attachmentIds
        updateIssue(item).then(function (res) {
          if (res.stateCode === 'SUCCESS') {
            message.success('Edit Success')
            history.back()
          } else {
            message.error('Edit Failed, Please Check!')
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
        projId: item.projId ? item.projId : window.localStorage.projId,
      },
      beforeUpload (file) {
        console.log(file);
        const isLt4M = file.size/1024/1024 < 20
        const fileNL = file.name.length
        if (!isLt4M) {
          message.error('File size must smaller than 20MB!')
        }
        if (fileNL > 100) {
          message.error('File name must shorter than 100 bytes!')
        }
        return isLt4M && (fileNL < 100)
      },
      onChange (info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done' && info.file.response && info.file.response.stateCode === 'SUCCESS') {
          message.success(`${info.file.name} file upload success`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        } else if (info.file.response && info.file.response.stateCode !== 'SUCCESS'){
          info.fileList.pop()
          message.error(`${info.file.name} file upload failed.`)
          info.file = ''
        }
      },
      onRemove (info) {
        deleteAttach(info.response.data.id).then(function (res) {
          if (res.success) {
            message.success('Delete attachment Success')
          } else {
            message.success('Delete attachment Failed, Please Check!')
          }
        })
      },
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

    const checkNumber = (rule, value, callback) => {
      console.log(value)
      if ((!isNaN(value) && value >= 0) || !value ) {
        callback();
        return
      }
      callback('must be a positive number')
    }

    return (<div>
      <Form layout="horizontal" style={{ paddingTop: 20 }}>
        <FormItem label="Project" hasFeedback {...formItemLayout}>
          {getFieldDecorator('projId', {
            initialValue: item.projId && item.projId.toString(),
          })(<span>{item.projName}</span>)}
        </FormItem>
        <FormItem label="Issue Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('issueName', {
            initialValue: item.issueName,
            rules: [
              {
                required: true,
                max: 100,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Issue Owner" hasFeedback {...formItemLayout}>
          {getFieldDecorator('owner', {
            initialValue: item.owner,
            rules: [
              {
                required: true,
              },
            ],
          })(<SearchInput />)}
        </FormItem>
        <FormItem label="Issue Type" hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: constant.TYPE[item.type],
          })(<Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a type"
            optionFilterProp="children"
          >
            <Option value="1">Issue</Option>
            <Option value="2">Request</Option>
          </Select>)}
        </FormItem>
        <FormItem label="Issue Related" hasFeedback {...formItemLayout}>
          {getFieldDecorator('relatedUser', {
            initialValue: item.relatedUser,
          })(<UserRemoteSelect />)}
        </FormItem>
        <FormItem label="Issue CC" hasFeedback {...formItemLayout}>
          {getFieldDecorator('ccUser', {
            initialValue: item.ccUser,
          })(<UserRemoteSelect />)}
        </FormItem>
        <FormItem label="Keywords" hasFeedback {...formItemLayout}>
          {getFieldDecorator('keywords', {
            initialValue: item.keywords,
            rules: [
              {
                required: true,
                max: 50,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Issue Priority" hasFeedback {...formItemLayout}>
          {getFieldDecorator('priority', {
            initialValue: constant.PRIORITY[item.priority - 1],
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
        <FormItem label="Issue Description" hasFeedback {...formItemLayout}>
          {getFieldDecorator('issueDesc', {
            initialValue: item.issueDesc,
            rules: [
              {
                max: 500,
              },
            ],
          })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
        <FormItem label="Risks" hasFeedback {...formItemLayout}>
          {getFieldDecorator('risks', {
            initialValue: item.risks,
            rules: [
              {
                max: 100,
              },
            ],
          })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
        <FormItem label="Blocks" hasFeedback {...formItemLayout}>
          {getFieldDecorator('blocks', {
            initialValue: item.blocks,
            rules: [
              {
                max: 100,
              },
            ],
          })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
        <FormItem label="Depends on" hasFeedback {...formItemLayout}>
          {getFieldDecorator('dependsOn', {
            initialValue: item.dependsOn,
            rules: [
              {
                max: 100,
              },
            ],
          })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
        <FormItem label="Start Date" hasFeedback {...formItemLayout}>
          {getFieldDecorator('startTime', {
            initialValue: moment(item.startTime),
            rules: [
              {
                required: true,
              },
            ],
          })(<DatePicker disabledDate={disabledStartDate} onChange={onStartChange} onOpenChange={handleStartOpenChange} format={'YYYY-MM-DD'} />)}
        </FormItem>
        <FormItem label="Deadline" hasFeedback {...formItemLayout}>
          {getFieldDecorator('deadline', {
            initialValue: moment(item.deadline),
            rules: [
              {
                required: true,
              },
            ],
          })(<DatePicker disabledDate={disabledEndDate} format="YYYY-MM-DD" onChange={onEndChange} onOpenChange={handleEndOpenChange} />)}
        </FormItem>
        <FormItem label="Cost Estimate" hasFeedback {...formItemLayout}>
          {getFieldDecorator('costEstimate', {
            initialValue: item.costEstimate,
            rules: [{ validator: checkNumber, required: false }]
          })(<InputNumber min={1} max={99999} placeholder='1~99999'/>)}
        </FormItem>
        <FormItem label="Attachment" hasFeedback {...formItemLayout}>
          {getFieldDecorator('attachment', {
            initialValue: item.attachment,
          })(<Upload {...props}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>)}
        </FormItem>
        <FormItem
          wrapperCol={{ span: 8, offset: 16 }}
        >
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

const NewForm = connect((state) => {
  return {
    formState: {
      email: state.form.email,
    },
  }
})(Form.create({
  mapPropsToFields (props) {
    console.log('mapPropsToFields', props)
    return {
      email: props.formState.email,
    }
  },
})(detailForm))

class Detail extends React.Component {
  render () {
    return (<Provider store={store}>
      <div>
        <NewForm {...this.props.editIssue} />
      </div>
    </Provider>)
  }
}

Detail.propTypes = {
  editIssue: PropTypes.object,
}

export default connect(({ editIssue, loading }) => ({ editIssue, loading }))(Detail)
