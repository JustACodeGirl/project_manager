import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styles from './search.less'
import { Input, Row, Col, Button, Icon, Modal, message } from 'antd'

class Search extends React.Component {
  state = {
    clearVisible: false,
  };

  handleSearch = () => {
    // TODO: 搜索字段
    const data = ReactDOM.findDOMNode(this.refs.searchInput).value
    if (this.props.onSearch) this.props.onSearch(data)
  }

  handleInputChange = e => {
    this.setState({
      ...this.state,
      clearVisible: e.target.value !== '',
    })
  };

  handleClearInput = () => {
    ReactDOM.findDOMNode(this.refs.searchInput).value = ''
    this.setState({
      clearVisible: false,
    })
    this.handleSearch()
  }

  handleDelete = () => {
    const selectedRowKeys = this.props.selectedRowKeys
    const onDeleteItems = this.props.onDeleteItems
    if (selectedRowKeys.length === 0) {
      message.warn('请选择一条记录', 2)
    } else {
      Modal.confirm({
        title: '确定要删除当前选中的患者信息吗?',
        content: '点击确定后，患者信息删除。',
        onOk () {
          onDeleteItems(selectedRowKeys)
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => {})
        },
        onCancel () {},
      })
    }
  };

  render () {
    const { clearVisible } = this.state
    const { placeHolder = '编号/姓名/医生', showSearch = true } = this.props
    return (
      <Row gutter={24}>
        <Col lg={8} md={10} sm={10} xs={24} style={{ marginBottom: 16 }}>
          <Button size="large" type="primary" icon="plus-circle-o" onClick={this.props.onAdd}>添加</Button>&nbsp;
          <Button size="large" type="danger" icon="delete" disabled={this.props.selectedRowKeys.length === 0} onClick={this.handleDelete}>删除</Button>
        </Col>
        {showSearch &&
          <Col lg={{ offset: 6, span: 10 }} md={14} sm={14} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
            <Input.Group compact size="large" className={styles.search}>
              <Input ref="searchInput" size="large" placeholder={placeHolder} style={{ width: '40%' }} onChange={this.handleInputChange} onPressEnter={this.handleSearch} />
              <Button size="large" type="primary" onClick={this.handleSearch}>搜索</Button>
              {clearVisible && <Icon type="cross" onClick={this.handleClearInput} />}
              <Button size="large" icon="reload" style={{ marginLeft: 4, borderRadius: 3 }} onClick={this.props.onReload}>刷新</Button>
            </Input.Group>
          </Col>
        }
      </Row>

    )
  }
}


Search.propTypes = {
  selectedRowKeys: PropTypes.array,
  onAdd: PropTypes.func,
  onDeleteItems: PropTypes.func,
  onSearch: PropTypes.func,
  onReload: PropTypes.func,
  placeHolder: PropTypes.string,
  showSearch: PropTypes.boolean,
}

export default Search
