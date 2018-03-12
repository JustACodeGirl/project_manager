import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, DatePicker, Upload, message, Button, Icon } from 'antd'
import { MutipleSelect } from '../../../components'
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
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...projectInfo
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

  const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
      authorization: 'authorization-text',
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
    <Form layout="horizontal">
      <FormItem label="ProjectName" hasFeedback {...formItemLayout}>
        {getFieldDecorator('pName', {
          initialValue: item.pName,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem label="ProjectManager" hasFeedback {...formItemLayout}>
        {getFieldDecorator('pManager', {
          initialValue: item.pDescription,
          rules: [
            {
              required: true,
            },
          ],
        })(<Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a person"
          optionFilterProp="children"
          filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          <Option value="Jack">Jack</Option>
          <Option value="Lucy">Lucy</Option>
          <Option value="Tom">Tom</Option>
        </Select>)}
      </FormItem>
      <FormItem label="Status" hasFeedback {...formItemLayout}>
        {getFieldDecorator('pStatus', {
          initialValue: item.pStatus,
          rules: [
            {
              required: true,
            },
          ],
        })(<Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a status level"
          optionFilterProp="children"
        >
          <Option value="1">新建</Option>
          <Option value="2">进行中</Option>
          <Option value="3">待关闭</Option>
          <Option value="4">已关闭</Option>
        </Select>)}
      </FormItem>
      <FormItem label="Keywords" hasFeedback {...formItemLayout}>
        {getFieldDecorator('keywords', {
          initialValue: item.keywords,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem label="ProjectDesc" hasFeedback {...formItemLayout}>
        {getFieldDecorator('pDescription', {
          initialValue: item.pDescription,
        })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
      </FormItem>
      <FormItem label="ProjectRelated" hasFeedback {...formItemLayout}>
        {getFieldDecorator('pRelated', {
          initialValue: item.Related,
          rules: [
            {
              required: true,
            },
          ],
        })(<MutipleSelect />)}
      </FormItem>
      <FormItem label="ProjectCC" hasFeedback {...formItemLayout}>
        {getFieldDecorator('pCC', {
          initialValue: item.pCC,
          rules: [
            {
              required: true,
            },
          ],
        })(<MutipleSelect />)}
      </FormItem>
      <FormItem label="ProjectPriority" hasFeedback {...formItemLayout}>
        {getFieldDecorator('pPriority', {
          initialValue: item.pPriority,
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
          <Option value="1">高</Option>
          <Option value="2">一般</Option>
          <Option value="3">低</Option>
        </Select>)}
      </FormItem>
      <FormItem label="Deadline" hasFeedback {...formItemLayout}>
        {getFieldDecorator('deadline ', {
          initialValue: item.deadline,
        })(<DatePicker />)}
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
        wrapperCol={{ span: 8, offset: 18 }}
      >
        <Button type="primary" htmlType="submit">
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
