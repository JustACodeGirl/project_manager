import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, DatePicker, Upload, message, Button, Icon, InputNumber } from 'antd'
import { UserRemoteSelect, SearchInput } from '../../components'
import { getOpenProject, newIssue, deleteAttach } from '../../services/public'
import { config } from '../../utils'
const { api } = config
const { upload } = api
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
  item = {
    projId: window.location.search ? window.location.search.substr(1).split('=')[1] : '',
  },
  options = [],
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,
  },
}) => {
  window.localStorage.removeItem('caseInfo')
  getOpenProject().then(function(res) {
    window.localStorage.openproj = res.data.length >=1 ? res.data.map(proj => proj.id + '&' + proj.projName) : []
  })
  const handleOk = (e) => {
    let element = e.target.parentNode
    if (e.target && e.target.parentNode) {
      e.target.parentNode.disabled = true
    }
    validateFields((errors, values) => {
      if (errors) {
        e.target.parentNode.disabled = false
        return
      }
      console.log('Received values of form: ', values)
      let data = {
        ...getFieldsValue(),
      }
      let attachmentIds = ""
      if (data.attachment) {
        data.attachment.fileList.map((item, index) => {
          attachmentIds += (item.response.data.id + (index === data.attachment.fileList.length - 1 ? '' : ','))
        })
      }
      data.attachmentIds = attachmentIds
      data.deadline = data.deadline ? data.deadline.format('YYYY-MM-DD') : ''
      data.startTime = data.startTime ? data.startTime.format('YYYY-MM-DD') : ''
      data.relatedUser =  data.relatedUser ? Array.isArray(data.relatedUser) ? data.relatedUser : data.relatedUser.split(',') : [],
      data.ccUser = data.ccUser ? Array.isArray(data.ccUser) ? data.ccUser : data.ccUser.split(',') : [],
      newIssue(data).then(function (res) {
        element.disabled = false
        if(res.stateCode ==="IssueExist"){
          message.error("Issue/Request has existed!");
        }
        else if (res.stateCode === 'SUCCESS') {
          message.success('Create Success');
          if (window.location.search) {
            history.back();
          }
          const fields = getFieldsValue()
          for (let item in fields) {
            if ({}.hasOwnProperty.call(fields, item)) {
              if (item === 'pm' || item === 'relatedUser' || item === 'ccUser' || item === 'owner') {
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
          message.error('Creat Issue Failed, Please Check!')
          e.target.parentNode.disabled = false
        }
      })
    })
  }

  const selectProject = (value) => {
    window.localStorage.projId = value
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
      console.log(info);
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
    if (!isNaN(value) || !value) {
        callback();
        return
      }
    callback('must be a number')
  }

  const checkOwner = (rule, value, callback, source, options) => {
    if ((!isNaN(value) && value >= 0) || !value) {
        callback();
        return
      }
    callback('must be a number')
  }

  return (
    <Form layout="horizontal" style={{ paddingTop: 20 }}>
      <FormItem label="Project" hasFeedback {...formItemLayout}>
        {getFieldDecorator('projId', {
          initialValue: item.projId,
          rules: [
            {
              required: true,
            },
          ],
        })(<Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a project"
          optionFilterProp="children"
          onChange={selectProject}
        >
          {window.localStorage.openproj && window.localStorage.openproj.length > 0 ? window.localStorage.openproj.split(',').map(d => <Option key={d.split('&')[0]}>{d.split('&')[1]}</Option>) : []}
        </Select>)}
      </FormItem>
      <FormItem label="Issue/Request Name" hasFeedback {...formItemLayout}>
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
      <FormItem label="Owner" hasFeedback {...formItemLayout}>
        {getFieldDecorator('owner', {
          initialValue: item.owner,
          rules: [
            {
              required: true,
            },
          ],
        })(<SearchInput />)}
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
          <Option value="1">Issue</Option>
          <Option value="2">Request</Option>
        </Select>)}
      </FormItem>
      <FormItem label="Related" hasFeedback {...formItemLayout}>
        {getFieldDecorator('relatedUser', {
          initialValue: item.relatedUser,
        })(<UserRemoteSelect />)}
      </FormItem>
      <FormItem label="CC" hasFeedback {...formItemLayout}>
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
      <FormItem label="Priority" hasFeedback {...formItemLayout}>
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
      <FormItem label="Description" hasFeedback {...formItemLayout}>
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
          initialValue: item.startTime,
          rules: [
            {
              required: true,
            },
          ],
        })(<DatePicker disabledDate={disabledStartDate} onChange={onStartChange} onOpenChange={handleStartOpenChange} format={'YYYY-MM-DD'} />)}
      </FormItem>
      <FormItem label="Deadline" hasFeedback {...formItemLayout}>
        {getFieldDecorator('deadline', {
          initialValue: item.deadline,
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
      <FormItem label="Attachments" hasFeedback {...formItemLayout}>
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
