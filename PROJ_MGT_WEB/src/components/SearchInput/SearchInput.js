import React, { PropTypes } from 'react'
import { Select, message } from 'antd'
const Option = Select.Option

let timeout
let currentValue

function fetchUser (value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  function fake () {
    fetch('/api/user/autoComplete', {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: ('userCode=' + value),
    }).then(response => response.json())
      .then((d) => {
        if (currentValue === value) {
          const result = d.data
          const data = []
          if (result && result.length > 0) {
            result.forEach((r) => {
              data.push({
                value: r,
                text: r,
              })
            })
            callback(data, value)
          } else {
            if (value && value.length > 0) {
              message.error('No such user')
            }
            callback([], '')
          }
        }
      })
  }
  timeout = setTimeout(fake, 300)
}

function fetchExactUser (value, callback) {
  console.log(value);
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  function fake () {
    fetch('/api/user/check', {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: ('userCode=' + value),
    }).then(response => response.json())
      .then((d) => {
        console.log(d);
        if (currentValue === value) {
          const result = d.data
          const data = []
          if (result) {
            data.push({
              value: value,
              text: value,
            })
            callback(data, value)
          } else {
            console.log(value);
            if (value && value.length > 0) {
              message.error('No such user')
            }
            callback([], '')
          }
        }
      })
  }
  timeout = setTimeout(fake, 300)
}

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: this.props.value,
    }
  }

  componentWillReceiveProps = function (nextProps) {
    console.log(nextProps);
    console.log(this.props);
    if (nextProps.value && nextProps.value !== this.props.value) {
      fetchUser(nextProps.value, (data, value) => this.setState({ data, value }))
      if (this.state.data.length > 0 && this.state.value) {
        this.setState({ value: nextProps.value })
      } else {
        this.setState({ value: '' })
      }
    }
  }

  handleChange = (value) => {
    const onChange = this.props.onChange
    fetchUser(value, (data, value) => this.setState({ data, value }))
    if (onChange) {
      onChange(value)
      this.setState({ value })
    }
  }

  blurChange = (value) => {
    const onChange = this.props.onChange
    fetchExactUser(value, (data, value) => this.setState({ data, value }))
    if (onChange) {
      onChange(value)
      this.setState({ value })
    }
  }

  componentWillUnmount = () => {
    console.log('AAAAAAAAAAAAA');
    console.log(this.props);
    this.setState({ data: [], value: '' })
    console.log(this.props);
  }

  render () {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
    return (
      <Select
        mode="combobox"
        value={this.state.value}
        placeholder="Typing to select a user"
        notFoundContent="Not Found"
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onChange={this.handleChange}
        onBlur={this.blurChange}
      >
       {options}
      </Select>
    )
  }
}

SearchInput.propTypes = {
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

export default SearchInput
