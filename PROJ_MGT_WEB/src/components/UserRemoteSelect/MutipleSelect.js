import React, { PropTypes } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash.debounce'
import fetch from 'dva/fetch'
const Option = Select.Option

class UserRemoteSelect extends React.Component {
  constructor (props) {
    super(props)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
  }
  state = {
    data: [],
    value: [],
    fetching: false,
    initValue: [],
  }

  componentDidMount = function () {
    if (this.props.value && this.props.value.length > 0) {
      const data = this.props.value.map(user => ({
        key: user,
        label: user,
      }))
      this.setState({
        value: data,
        data: [],
        fetching: false,
        initValue: data,
      })
    }
  }

  componentWillReceiveProps = function (value) {
    if (Array.isArray(value.value)) {
      const data = value.value.map(user => ({
        key: user,
        label: user,
      }))
      this.setState({
        value: data,
        data: [],
        fetching: false,
        initValue: data,
      })
    }
  }

  fetchUser = (value) => {
    console.log('fetching user', value)
    this.lastFetchId += 1
    const fetchId = this.lastFetchId
    this.setState({ fetching: true })
    fetch('/api/user/autoComplete', {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: ('userCode=' + value),
    }).then(response => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return
        }
        const data = body.data.map(user => ({
          text: user,
          value: user,
        }))
        this.setState({ data, fetching: false })
      })
  }
  handleChange = (value) => {
  console.log(value)
  let valueString = ''
    value.map((item, index) => {
      valueString += (item.key + (index === value.length-1 ? '' : ','))
    })
    const onChange = this.props.onChange
    if (onChange) {
      onChange(valueString)
      this.setState({
        value,
        data: [],
        fetching: false,
      })
    }
  }

  render () {
    const { fetching, data, value, initValue } = this.state
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        defaultValue={initValue}
        placeholder="Typing to select users"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
      </Select>
    )
  }
}

UserRemoteSelect.propTypes = {
  fetch: PropTypes.object,
  rowKey: PropTypes.string,
  pagination: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.object,
  ]),
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  onChange: PropTypes.func,
}

export default UserRemoteSelect
