import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, DatePicker, Upload, message, Button, Icon, Modal, InputNumber } from 'antd'
import { Editor, CheckBox } from '../../components'
import { deleteAttach } from '../../services/public'
import { config } from '../../utils'
const { api } = config
const { upload } = api

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
}

const formItemLayoutWithOutLabel = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    xs: { span: 0, offset: 0 },
    sm: { span: 0, offset: 0 },
  },
}

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
  const props = {
    name: 'file',
    action: upload,
    headers: {
      authorization: 'authorization-text',
    },
    data: {
      projId: modalProps.id,
      updateTime: modalProps.updateTime,
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
        message.success(`${info.file.name} file upload success.`)
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

  const handleOk = (e) => {
    e.target.parentNode.disabled = true
    validateFields((errors) => {
      if (errors) {
        e.target.parentNode.disabled = false
        return
      }
      let data = {
        ...getFieldsValue(),
      }
      let attachmentIds = ''
      if (data && data.attachment && data.attachment.file.status === 'done') {
        data.attachment.fileList.map((attach, index) => {
          attachmentIds += (attach.response.data.id + (index === data.attachment.fileList.length - 1 ? '' : ','))
        })
      }
      data.attachmentIds = attachmentIds
      data.id = modalProps.id
      data.updateTime = modalProps.modalUpdateTime
      data.type = modalProps.modalType
      console.log(data);
      if (data.attachment && data.attachment.file.status !== 'done') {
        e.target.parentNode.disabled = false
        return
      } else {
        onOk(data)
      }
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const checkNumber = (rule, value, callback) => {
    if (!isNaN(value)) {
      callback();
      return
    }
    callback('must be a number')
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        {(modalOpts.type == 'Audit' || modalOpts.type === 'Close')&& <FormItem label="Result" hasFeedback {...formItemLayout}>
          {getFieldDecorator('result', {
            initialValue: item.result,
            rules: [
              {
                required: true,
              },
            ],
          })(<Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a result"
            optionFilterProp="children"
          >
            <Option value="1">{ modalOpts.type === 'Audit' ? 'Approve' : 'Close' }</Option>
            <Option disabled={ modalProps.modalType === 'Project' && modalOpts.modalStatus !== 'Finished' } value="0">{ modalOpts.type === 'Audit' ? 'Reject' : 'Rollback' }</Option>
          </Select>)}
        </FormItem>}
        {modalOpts.type == 'Solve' && <FormItem label="Cost Actual" hasFeedback {...formItemLayout}>
          {getFieldDecorator('actualCost', {
            initialValue: item.cost,
            rules: [{
              required: true,
              validator: checkNumber,
            }]
          })(<InputNumber min={1} max={99999} placeholder='1~99999'/>)}
        </FormItem>}
        <FormItem label="Marks" hasFeedback {...formItemLayout}>
          {getFieldDecorator('comments', {
            initialValue: item.comments,
            rules: [
              {
                required: true,
                max: 1000,
              },
            ],
          })(<Input type="textarea" autosize={{ minRows: 6, maxRows: 10 }} />)}
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
