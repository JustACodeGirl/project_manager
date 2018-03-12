import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const IssueInfo = ({ issueInfo }) => {
  const { data } = issueInfo
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      content.push(<div key={key} className={styles.item}>
        <div>{key}</div>
        <div>{String(data[key])}</div>
      </div>)
    }
  }
  return (<div className="content-inner">
    <div className={styles.content}>
      {content}
    </div>
  </div>)
}

IssueInfo.propTypes = {
  issueInfo: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ issueInfo, loading }) => ({ issueInfo, loading: loading.models.issueInfo }))(IssueInfo)
