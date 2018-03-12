import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Timeline, Icon, Button } from 'antd'
import Comments from '../../dashboard/components/comments'

import Modal from './Modal'
import styles from './index.less'


const Process = ({ process, dispatch }) => {
  const { commentsVisible, showIcon, currentItem, hideIcon, modalVisible, modalType, comments } = process
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    width: 800,
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'create' ? 'Create Comments' : 'Update Project'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `user/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'process/hideModal',
      })
    },
  }

  const onAdd = () => {
    dispatch({
      type: 'case/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }

  const hideComments = () => {
    dispatch({
      type: 'process/hideComments',
      payload: {
        commentsVisible: 456,
      },
    })
  }

  const showComments = (e) => {
    const itemId = e.target.parentNode.dataset.id
    dispatch({
      type: 'process/showComments',
      payload: {
        id: parseInt(itemId, 10),
      },
    })
  }

  const titles = [{ id: 1, title: 'chenny创建了项目 2016-09-01', color: 'green', comments: [{
    avatar: 'http://dummyimage.com/48x48/e479f2/757575.png&text=Y',
    content: 'Cznmcbmib yprodtysn nrgfsp yealf rbgyr umng mgudgvh igyy tpnenm lfeiqzt ehpaf wtnb olyecgqoc ybfstnn bkpko lwu ydak.',
    date: '2016-10-09 11:53:30',
    name: 'Young',
    status: 3,
  }, {
    avatar: 'http://dummyimage.com/48x48/79f2c1/757575.png&text=D',
    content: 'Utivbgj dnqcp sltywl bigrnrfmzf fhocri kjzqtlwg ewvbv jqcmtbbhr rliicxxn jpk ndsuz vbaqjirdk dtyjmrhls qrcndj xpefnh.',
    date: '2016-05-03 09:11:25',
    name: 'Davis',
    status: 2,
  }, {
    avatar: 'http://dummyimage.com/48x48/f29d79/757575.png&text=W',
    content: 'Ewzo wcpdg isckjqhpl pheyk qfiseutfs fbukyene lull vogcezchz xeynn lcfvm hybktixep lhctd eejdv kpwarkmxm enhff varcm.',
    date: '2016-05-03 09:11:25',
    name: 'Walker',
    status: 1,
  }] }, { id: 2, title: 'lyman打开了项目 2016-10-01', comments: [{
    avatar: 'http://dummyimage.com/48x48/e479f2/757575.png&text=Y',
    content: 'Cznmcbmib yprodtysn nrgfsp yealf rbgyr umng mgudgvh igyy tpnenm lfeiqzt ehpaf wtnb olyecgqoc ybfstnn bkpko lwu ydak.',
    date: '2016-10-09 11:53:30',
    name: 'Young',
    status: 3,
  }] }, { id: 3, title: 'lyman提交了项目 2017-01-01', color: 'yellow', comments: [{
    avatar: 'http://dummyimage.com/48x48/e479f2/757575.png&text=Y',
    content: 'Cznmcbmib yprodtysn nrgfsp yealf rbgyr umng mgudgvh igyy tpnenm lfeiqzt ehpaf wtnb olyecgqoc ybfstnn bkpko lwu ydak.',
    date: '2016-10-09 11:53:30',
    name: 'Young',
    status: 3,
  }, {
    avatar: 'http://dummyimage.com/48x48/79f2c1/757575.png&text=D',
    content: 'Utivbgj dnqcp sltywl bigrnrfmzf fhocri kjzqtlwg ewvbv jqcmtbbhr rliicxxn jpk ndsuz vbaqjirdk dtyjmrhls qrcndj xpefnh.',
    date: '2016-05-03 09:11:25',
    name: 'Davis',
    status: 2,
  }] }, { id: 4, title: 'chenny关闭了项目 2017-01-15', color: 'red', comments: [{
    avatar: 'http://dummyimage.com/48x48/e479f2/757575.png&text=Y',
    content: 'Cznmcbmib yprodtysn nrgfsp yealf rbgyr umng mgudgvh igyy tpnenm lfeiqzt ehpaf wtnb olyecgqoc ybfstnn bkpko lwu ydak.',
    date: '2016-10-09 11:53:30',
    name: 'Young',
    status: 3,
  }, {
    avatar: 'http://dummyimage.com/48x48/79f2c1/757575.png&text=D',
    content: 'Utivbgj dnqcp sltywl bigrnrfmzf fhocri kjzqtlwg ewvbv jqcmtbbhr rliicxxn jpk ndsuz vbaqjirdk dtyjmrhls qrcndj xpefnh.',
    date: '2016-05-03 09:11:25',
    name: 'Davis',
    status: 2,
  }] }]

  const Items = titles.map(function (title) {
    return (
      <Timeline.Item className={styles.timelineItem} color={title.color}>
        <p style={{ marginLeft: 20, fontSize: 15 }} data-id={title.id} >{title.title}
        </p>
        {(commentsVisible.indexOf(title.id) >= 0) && <div>
          <Comments data={title.comments} />
        </div>}
      </Timeline.Item>
    )
  })

  return (<div className="content-inner">
    <div className={styles.content}>
      <Timeline className={styles.timeline}>
        {Items}
      </Timeline>
    </div>
    {modalVisible && <Modal {...modalProps} />}
  </div>)
}

Process.propTypes = {
  process: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ process, loading }) => ({ process, loading: loading.models.process }))(Process)
