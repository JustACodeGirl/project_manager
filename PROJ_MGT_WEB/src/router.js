import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/case'))
          cb(null, { component: require('./routes/case/') })
        }, 'case')
      },
      childRoutes: [
        {
          path: 'pendingCase',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/case'))
              cb(null, require('./routes/case/'))
            }, 'case')
          },
        }, {
          path: 'userInfo',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/userInfo'))
              cb(null, require('./routes/userInfo/'))
            }, 'userInfo')
          },
        }, {
          path: 'newProject',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/newProject/'))
            }, 'new-project')
          },
        }, {
          path: 'caseInfo/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/case/info'))
              cb(null, require('./routes/case/caseInfo'))
            }, 'case-info')
          },
        }, {
          path: 'editIssue/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/editIssue'))
              cb(null, require('./routes/case/editIssue'))
            }, 'issue-info')
          },
        }, {
          path: 'process/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/project/process'))
              cb(null, require('./routes/project/process'))
            }, 'project-info')
          },
        }, {
          path: 'issues/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/project/issue'))
              cb(null, require('./routes/project/issue'))
            }, 'issue-info')
          },
        }, {
          path: 'issueInfo/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/issue/info'))
              cb(null, require('./routes/query/editissue'))
            }, 'issue-info')
          },
        }, {
          path: 'projectInfo/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/projectInfo'))
              cb(null, require('./routes/query/editproject'))
            }, 'issue-info')
          },
        }, {
          path: 'admin/role',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/admin/role'))
              cb(null, require('./routes/admin/role'))
            }, 'admin-role')
          },
        }, {
          path: 'admin/list',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/admin/list'))
              cb(null, require('./routes/admin/list'))
            }, 'admin-list')
          },
        }, {
          path: 'userManagement',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/userManagement'))
              cb(null, require('./routes/userManagement/'))
            }, 'new-project')
          },
        }, {
          path: 'log',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/log'))
              cb(null, require('./routes/log/'))
            }, 'log')
          },
        }, {
          path: 'case/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/case/detail'))
              cb(null, require('./routes/case/detail/'))
            }, 'case-detail')
          },
        }, {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'newIssue',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/newIssue/'))
            }, 'issue')
          },
        }, {
          path: 'query',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/query'))
              cb(null, require('./routes/query/'))
            }, 'query')
          },
        }, {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
