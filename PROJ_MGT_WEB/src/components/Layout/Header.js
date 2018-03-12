import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Tooltip } from 'antd'
import styles from './Header.less'
import Menus from './Menu'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, info, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu }) => {
  let handleClickMenu = e => {
    if (e.key === 'setting') {
      info()
    }
    e.key === 'logout' && logout()
  }
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  return (
    <div className={styles.header}>
      <div className={styles.rightWarpper}>
        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu style={{
            float: 'right',
          }} title={< span > <Icon type="user" />
            {user.userCode} < /span>}
          >
            <Menu.Item key="setting">
              Setting
            </Menu.Item>
          </SubMenu>
        </Menu>
        <Tooltip placement="right" title='Sign Out'><a className={styles.logout} onClick={logout}><Icon style={{ color: 'red' }} type="poweroff" /></a></Tooltip>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
