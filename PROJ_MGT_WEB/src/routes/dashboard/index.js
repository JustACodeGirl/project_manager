import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { NumberCard, Quote, Sales, Weather, RecentSales, Comments, Completed, Browser, Cpu, User } from './components'
import styles from './index.less'
import { color } from '../../utils'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

function Dashboard ({ dashboard }) {
  const { numbers, issues } = dashboard
  const projectCards = numbers.map((item, key) => <Col key={key} lg={6} md={12}>
    <NumberCard className={styles.card} {...item} />
  </Col>)
  const issueCards = issues.map((item, key) => <Col key={key} lg={6} md={12}>
    <NumberCard className={styles.card} {...item} />
  </Col>)

  return (
    <Row gutter={24}>
      <Row>
        <p className={styles.title}>Projects</p>
        {projectCards}
      </Row>
      <Row>
        <p className={styles.title}>Issues</p>
        {issueCards}
      </Row>
    </Row>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
