import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styles from './queryInput.less'
import { Button, Input, Icon } from 'antd'
import AdvanceQuery from './advanceQuery'

function getAvanceQuery (advanceQuery) {
  return advanceQuery.reduce((pre, cur) => {
    if (!!!cur.keyName || !!!cur.value) return pre
    const curQuery = cur.type === 'fuzzy' ? `${cur.keyName} like '%${cur.value}%'` : `${cur.keyName}='${cur.value}'`
    if (cur.id === 0) return curQuery
    return pre + ` ${cur.gType} ` + curQuery
  }, '')
}

class QueryInput extends React.Component {
  state = {
    clearVisible: false,
    advance: false,
    advanceQuery: [
      { id: 0, keyName: void 0, value: void 0, type: 'fuzzy', gType: 'and' },
      { id: 1, keyName: void 0, value: void 0, type: 'fuzzy', gType: 'and' },
    ],
    count: 2,
  };

  changeSearchType = () => {
    this.setState({
      advance: !this.state.advance,
    })
  };

  handleSimpleClear = () => {
    ReactDOM.findDOMNode(this.refs.searchInput).value = ''
    this.setState({
      clearVisible: false,
    })
    this.handleSimpleSearch()
  }

  handleSimpleChange = e => {
    this.setState({
      clearVisible: e.target.value !== '',
    })
  }

  handleAdvanceClear = () => {
    this.setState({ advanceQuery: [
        { id: 0, keyName: void 0, value: void 0, type: 'fuzzy', gType: 'and' },
        { id: 1, keyName: void 0, value: void 0, type: 'fuzzy', gType: 'and' }],
      count: 2,
    })
  };

  handleAdvanceChange = (data) => {
    let { advanceQuery } = this.state
    advanceQuery = advanceQuery.map(item => {
      if (item.id === data.id) {
        return Object.assign({}, item, data)
      }
      return item
    })
    this.setState({ advanceQuery })
  }

  handleAddOptions = () => {
    let { advanceQuery, count } = this.state
    advanceQuery.push({ id: count++, keyName: void 0, value: void 0, type: 'fuzzy', gType: 'and' })
    this.setState({ advanceQuery, count })
  }

  handleDeleteOptions = (id) => {
    let { advanceQuery } = this.state
    if (advanceQuery.length > 2) {
      advanceQuery = advanceQuery.filter(item => item.id !== id)
      this.setState({ advanceQuery })
    }
  };

  handleSimpleSearch = () => {
    const query = ReactDOM.findDOMNode(this.refs.searchInput).value
    if (this.props.onSimpleSearch) this.props.onSimpleSearch(query)
  };

  handleAdvanceSearch = () => {
    const { advanceQuery } = this.state
    const query = getAvanceQuery(advanceQuery)
    if (query !== '' && this.props.onAdvanceSearch) this.props.onAdvanceSearch(query)
  };

  handleExport = () => {
    const { advance, advanceQuery } = this.state
    if (advance) {
      const query = getAvanceQuery(advanceQuery)
      if (query !== '' && this.props.onExport) this.props.onExport(query)
    } else {
      const query = ReactDOM.findDOMNode(this.refs.searchInput).value
      if (this.props.onExport) this.props.onExport(query)
    }
  };

  render () {
    let query = null
    if (!this.state.advance) {
      const { clearVisible } = this.state
      query = (
        <div className={styles.simple}>
          <div className={styles.group}>
            <Input ref="searchInput" onChange={this.handleSimpleChange} onPressEnter={this.handleSimpleSearch} placeholder="输入 编号/姓名/医生 查询" size="large" />
            <Button size="large" type="primary" icon="search" onClick={this.handleSimpleSearch}>查询</Button>
            {clearVisible && <Icon type="cross" onClick={this.handleSimpleClear} />}
          </div>
          <a style={{ float: 'right', lineHeight: 2.3 }} onClick={this.changeSearchType}>高级查询</a>
        </div>
      )
    } else {
      const { advanceQuery } = this.state
      const props = {
        onChange: this.handleAdvanceChange,
        onAdd: this.handleAddOptions,
        onDelete: this.handleDeleteOptions,
      }
      const items = advanceQuery.map((data, index) => (
        <AdvanceQuery key={data.id} index={index} data={data} {...props} />
      ))
      query = (
        <div className={styles.advance}>
          {items}
          <div className="search">
            <Button size="large" type="primary" icon="search" onClick={this.handleAdvanceSearch}>查询</Button>
            <Button size="large" onClick={this.handleAdvanceClear}>清除</Button>
            <Button size="large" icon="download" onClick={this.handleExport}>导出</Button>
            <a style={{ lineHeight: 2.3 }} onClick={this.changeSearchType}>简单查询</a>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.query}>
        {query}
      </div>
    )
  }
}


QueryInput.propTypes = {
  onSimpleSearch: PropTypes.func,
  onAdvanceSearch: PropTypes.func,
  onExport: PropTypes.func,
}

export default QueryInput
