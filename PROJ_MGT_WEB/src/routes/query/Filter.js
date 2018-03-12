import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch, Select, Icon, InputNumber, message } from 'antd'

const Option = Select.Option

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onAdd,
  statusSelect,
  isMotion,
  taskTypeChange,
  reset,
  statusOption,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { deadline } = fields
    if (deadline) {
      fields.deadline = deadline.format('YYYY-MM-DD')
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    reset()
  }

  const handleChange = (value) => {
    taskTypeChange(value)
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (item === 'status') {
          fields[item] = ''
        }
      }
    }
    setFieldsValue(fields)
  }

  const { id, taskType } = filter

  // let initialCreateTime = {}
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  const checkNumber = (rule, value, callback) => {
    console.log(value)
    if (!isNaN(value) || !value) {
      callback();
      return
    }
    callback('must be a number')
  }

  const TaskType = ['Project', 'Issue', 'Request']
  const Status = {
    Project: ['Rollback', 'New', 'Opened', 'Finished', 'Closed'],
    Issue: ['Rollback', 'Rejected', 'New', 'Approved', 'Solved', 'Closed'],
    Request: ['Rollback', 'Rejected', 'New', 'Approved', 'Solved', 'Closed'],
  }

  const TaskTypeOptions = TaskType && TaskType.map(type => <Option key={type}>{type}</Option>)
  let StatusOption = []
  if (statusOption) {
    StatusOption = Status[statusOption] && Status[statusOption].map(status => <Option key={status}>{status}</Option>)
  }
  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 3 }} sm={{ span: 3 }}>
        <FilterItem label="Task&nbsp;Id">
          {getFieldDecorator('taskId', { initialValue: id, rules: [{ validator: checkNumber }] })(<InputNumber style={{ width: '100%' }} placeholder="Number" size="large" />)}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
        <FilterItem label="Task&nbsp;Name">
          {getFieldDecorator('taskName', { initialValue: name })(<Input size="large" />)}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
        <FilterItem label="Task&nbsp;Type">
          {getFieldDecorator('taskType', { initialValue: taskType })(<Select
            showSearch
            style={{ width: '100%' }}
            size="large"
            optionFilterProp="children"
            onChange={handleChange}
          >
            {TaskTypeOptions}
          </Select>)}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
        <FilterItem label="Status">
          {getFieldDecorator('status', { initialValue: id })(<Select disabled={statusSelect}
            showSearch
            style={{ width: '100%' }}
            size="large"
            placeholder="Select TaskType First"
            optionFilterProp="children"
          >
            {StatusOption}
          </Select>)}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
        <FilterItem label="Deadline&nbsp;¡Ü">
          {getFieldDecorator('deadline', {})(
            <DatePicker style={{ width: '100%' }} size="large" />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }}>
        <div>
          <div >
            <Button type="primary" size="large" onClick={handleSubmit}><Icon type="search" />Search</Button>
            <Button size="large" onClick={handleReset} style={{left:'10px'}}><Icon type="reload" />Reset</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
