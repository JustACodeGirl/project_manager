import React, { PropTypes } from 'react'
import { Select, Button, Input } from 'antd'
const Option = Select.Option
const InputGroup = Input.Group

let inputTimer = null

const patientItems = [
  { name: '姓名', code: 'patient_name', type: 0 },
  { name: '住院号', code: 'inpatient_num', type: 0 },
  { name: '病例编号', code: 'record_num', type: 0 },
  { name: '诊断', code: 'diagnose', type: 0 },
  { name: '手术名称', code: 'operation_name', type: 0 },
  { name: '手术时间', code: 'operation_time', type: 1 },
  { name: '性别', code: 'sex', type: 0 },
  { name: '出生日期', code: 'birthday', type: 1 },
  { name: '籍贯', code: 'native_place', type: 0 },
  { name: '婚姻状态', code: 'marital_status', type: 0 },
  { name: '入院日期', code: 'hospital_date', type: 1 },
  { name: '出院日期', code: 'discharge_date', type: 1 },
  { name: '联系电话1', code: 'contact_number', type: 0 },
  { name: '联系电话2', code: 'other_contact', type: 0 },
  { name: '联系地址', code: 'address', type: 0 },
  { name: 'QQ/微信', code: 'qq', type: 0 },
  { name: '受教育程度', code: 'education_id', type: 0 },
  { name: '职业', code: 'profession', type: 0 },
]

const patientOpts = patientItems.map((item, index) => <Option key={index} value={item.code}>{item.name}</Option>)

class AdvanceQuery extends React.Component {
  constructor (props) {
    super(props)

    const data = this.props.data || {}
    this.state = {
      id: data.id,
      keyName: data.keyName,
      value: data.value,
      type: data.type || 'and',
      gType: data.gType || 'fuzzy',
      last: null,
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('data' in nextProps) {
      const data = nextProps.data
      this.setState({
        id: data.id,
        keyName: data.keyName,
        value: data.value,
        type: data.type || 'and',
        gType: data.gType || 'fuzzy',
      })
    }
  }

  handleKeyNameChange = (keyName) => {
    this.setState({ keyName })
    this.triggerChange({ keyName })
  };

  handleValueChange = (e) => {
    const value = e.target.value
    this.setState({ value })
    if (inputTimer) {
      clearTimeout(inputTimer)
    }
    inputTimer = setTimeout(() => this.triggerChange({ value }), 300)
  };

  handleTypeChange = (type) => {
    this.setState({ type })
    this.triggerChange({ type })
  };

  handleGTypeChange = (gType) => {
    this.setState({ gType })
    this.triggerChange({ gType })
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue))
    }
  };

  render () {
    const { index, onAdd, onDelete } = this.props
    const { id, keyName, type, gType, value } = this.state
    return (
      <InputGroup compact>
        {index !== 0 && <Button size="large" icon="plus" style={{ marginLeft: 50 }} onClick={onAdd} />}
        <Select
          size="large"
          showSearch
          style={{ width: 120 }}
          placeholder="提名/关键词"
          value={keyName}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={this.handleKeyNameChange}
        >
          {patientOpts}
        </Select>
        <Input size="large" value={value} onChange={this.handleValueChange} />
        <Select
          size="large"
          value={type}
          style={{ width: 60 }}
          onChange={this.handleTypeChange}
        >
          <Option value="fuzzy">模糊</Option>
          <Option value="accurate">精确</Option>
        </Select>
        {index !== 0 && <Button size="large" icon="minus" onClick={() => onDelete(id)} />}
      </InputGroup>
    )
  }
}

AdvanceQuery.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object,
  onChange: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
}

export default AdvanceQuery
