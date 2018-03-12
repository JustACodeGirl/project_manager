import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Icon } from 'antd'

const TabPane = Tabs.TabPane

const Tab = () => {
  return (
    <Tabs defaultActiveKey="2">
      <TabPane tab={<span><Icon type="info-circle-o" />My Project (22)</span>} key="1" />
      <TabPane tab={<span><Icon type="message" />Cc Project (10)</span>} key="2" />
      <TabPane tab={<span><Icon type="team" />Related Project (8)</span>} key="3" />
    </Tabs>
  )
}

Tab.propTypes = {

}

export default Tab
