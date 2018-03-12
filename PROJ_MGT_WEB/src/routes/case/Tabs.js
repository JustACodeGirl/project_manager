import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Icon } from 'antd'

const TabPane = Tabs.TabPane

const Tab = ({ onChange }) => {
  const defaultkey = window.localStorage.caseInfo ? String(JSON.parse(window.localStorage.caseInfo).tabsnum) : '1'
  return (
    <Tabs defaultActiveKey={defaultkey} onTabClick={onChange} type="card">
      <TabPane tab={<span><Icon type="appstore-o" />My Task</span>} key="1" />
      <TabPane tab={<span><Icon type="mail" />My CC</span>} key="2" />
      <TabPane tab={<span><Icon type="solution" />My Related</span>} key="3" />
    </Tabs>
  )
}

Tab.propTypes = {
  onChange: PropTypes.func,
}

export default Tab
