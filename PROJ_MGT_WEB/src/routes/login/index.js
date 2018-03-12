import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import { config } from '../../utils'
import styles from './index.less'

const FormItem = Form.Item

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  window.localStorage.clear()
  const { loginLoading } = login

  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      values.email = values.email.replace(/(^\s*)|(\s*$)/g, "") + '@ovt.com'
      dispatch({ type: 'login/login', payload: values })
    })
  }

  return (
    <div className={styles.background}>
      <div className={styles.form}>
        <div className={styles.logo}>
          <img alt={'logo'} src={config.logo} />
        </div>
        <form>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input size="large" onPressEnter={handleOk} addonAfter="@ovt.com" placeholder="Email" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="Password" />)}
          </FormItem>
          <Row>
            <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
              Sign in
            </Button>
          </Row>

        </form>
      </div>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login }) => ({ login }))(Form.create()(Login))
