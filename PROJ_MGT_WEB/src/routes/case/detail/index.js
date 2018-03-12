import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { config, constant } from '../../../utils'
const { api } = config
const { down } = api
import { Table, Row, Col, Timeline, Button, Card, Tag, Icon } from 'antd'
import { Comments } from '../../../components'
import styles from './index.less'

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
  style: {
    marginBottom: 12,
  },
}

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const columns = [
  {
    dataIndex: 'key',
    key: 'key',
  }, {
    dataIndex: 'value',
    key: 'value',
  },
]

const IsssueListColumns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    width: 70,
  }, {
    title: 'Name',
    dataIndex: 'issueName',
    key: 'issueName',
    width: 150,
  }, {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    width: 100,
  }, {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (text) => <span>{constant.TYPE[text]}</span>,
    width: 90,
  }, {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => <span>{constant.status[constant.TYPE[record.type]].find(v => { return v.key === text }).value}</span>,
    width: 100,
  }, {
    title: 'Deadline',
    dataIndex: 'deadline',
    key: 'deadline',
    width: 150,
  },
]

function cancel () {
  history.back()
}
const linBreak = (data) =>{
  if(data.indexOf("\n")>=0){
    data = data.split("\n");
    data = data.join("\n<br/>\n");
    data = data.split("\n");
    for( let i=0;i<data.length;i++){
      if(data[i]=="<br/>"){
        data[i]= <br/>;
      }
    }
  }
  return data;
};
const Detail = ({ caseDetail, dispatch }) => {
  const { data, process, issueList } = caseDetail
  let dataSource = []
  if (data && Object.keys(data).length > 0) {
    if (data.type === 0) {
      dataSource = [{ key: 'Porject Id :', value: data.id },
        { key: 'Task Type :', value: constant.TYPE[data.type] },
        { key: 'Project Name :', value: data.projName },
        { key: 'Project Description :', value: linBreak(data.description) },
        { key: 'Keywords :', value: data.keywords },
        { key: 'Status :', value: constant.status[constant.TYPE[data.type]].find(item => { return item.key === data.status }).value },
        { key: 'Progress :', value: data.progress + '%' },
        { key: 'Priority :', value: constant.PRIORITY[data.priority - 1] },
        { key: 'Creator :', value: data.creatorCode },
        { key: 'PM :', value: data.pm.replace(',', ', ') },
        { key: 'Project Related :', value: data.relatedUser.join(',') },
        { key: 'Project CC :', value: data.ccUser.join(',') },
        { key: 'Start Date :', value: data.startTime },
        { key: 'Deadline :', value: data.deadline },
        { key: 'Create Time :', value: data.createTime }]
    } else if (data.type === 1) {
      dataSource = [{ key: 'Issue Id :', value: data.id },
        { key: 'Task Type :', value: constant.TYPE[data.type] },
        { key: 'Project Name :', value: data.projName },
        { key: 'Issue Name :', value: data.issueName },
        { key: 'Issue Description :', value:linBreak(data.issueDesc) },
        { key: 'Keywords :', value: data.keywords },
        { key: 'Status :', value: constant.status[constant.TYPE[data.type]].find(item => { return item.key === data.status }).value },
        { key: 'Progress :', value: data.progress + '%' },
        { key: 'Priority :', value: constant.PRIORITY[data.priority - 1] },
        { key: 'Owner :', value: data.owner },
        { key: 'Creator :', value: data.creatorCode },
        { key: 'Issue Related :', value: data.relatedUser.join(', ') },
        { key: 'Issue CC :', value: data.ccUser.join(', ') },
        { key: 'Start Date :', value: data.startTime },
        { key: 'Deadline :', value: data.deadline },
        { key: 'Approve Time :', value: data.approveTimeUtc },
        { key: 'Cost Estimate :', value: data.costEstimate ? (data.costEstimate + ' hours') : '' },
        { key: 'Cost Actual :', value: data.costActual ? (data.costActual + ' hours') : '' },
        { key: 'Depends On :', value: linBreak(data.dependsOn)  },
        { key: 'Blocks :', value: linBreak(data.blocks) },
        { key: 'Risks :', value: linBreak(data.risks) }]
    } else {
      dataSource = [{ key: 'Request Id :', value: data.id },
        { key: 'Task Type :', value: constant.TYPE[data.type] },
        { key: 'Project Name :', value: data.projName },
        { key: 'Request Name :', value: data.issueName },
        { key: 'Request Description :', value: linBreak(data.issueDesc) },
        { key: 'Keywords :', value: data.keywords },
        { key: 'Status :', value: constant.status[constant.TYPE[data.type]].find(item => { return item.key === data.status }).value },
        { key: 'Progress :', value: data.progress + '%' },
        { key: 'Priority :', value: constant.PRIORITY[data.priority - 1] },
        { key: 'Owner :', value: data.owner },
        { key: 'Creator :', value: data.creatorCode },
        { key: 'Request Related :', value: data.relatedUser.join(', ') },
        { key: 'Request CC :', value: data.ccUser.join(', ') },
        { key: 'Start Date :', value: data.startTime },
        { key: 'Deadline :', value: data.deadline },
        { key: 'Approve Time :', value: data.approveTimeUtc },
        { key: 'Cost Estimate :', value: data.costEstimate ? (data.costEstimate + ' hours') : '' },
        { key: 'Cost Actual :', value: data.costActual ? (data.costActual + ' hours') : '' },
        { key: 'Depends On :', value: linBreak(data.dependsOn) },
        { key: 'Blocks :', value: linBreak(data.blocks) },
        { key: 'Risks :', value: linBreak(data.risks) }]
    }
  }

  const Items = process ? process.map(function (act) {
    if(act.comments.indexOf("\n")>=0){
      act.comments = linBreak(act.comments);
    }
    const attachment = act.attachment.length > 0 ? act.attachment.map(function(attach) {
      return (<div>
        <a href={ down + '?attachmentId=' + attach.id } target="_blank"><Icon type="download" /> {attach.name}</a>
      </div>)
    }) : ''
    return (
      <Timeline.Item dot={<Icon type={constant.ICON[act.action]} style={{ fontSize: '16px' }} />} color={constant.COLOR[act.action]}>
        <div className={styles.arrow}></div>
        {
          <Card className={styles.cardChild} data-id={act.id}>
            <div>
              <Tag className={styles.tag} color={constant.COLOR[act.action]}>{act.action} {constant.TYPE[act.type]} {act.type === 0 || (data.type === 1 && act.type === 1) ? '' : ':'}</Tag><span className={styles.name}>{act.type === 0 || (data.type === 1 && act.type === 1) ? '' : act.issueName}</span>
              {act.comments.length > 0 && <div style={{ marginTop: 5 }}>
                <span className={styles.content}>{act.comments}</span>
              </div>}
              {act.attachment.length > 0 &&<div style={{ marginTop: 5 }}>
                {attachment}
              </div>}
              <div className={styles.daterow}>
                <span className={styles.caseDetail}>{act.operatorCode}</span><span className={styles.date} style={{ marginLeft: 5 }}>by</span><span className={styles.caseDetail}>{act.createTime}</span><span className={styles.date}>on</span>
              </div>
            </div>
          </Card>
        }
      </Timeline.Item>
    )
  }) : []

  return (
    <div style={{ background: '#ECECEC', padding: '22px', marginLeft: '-22px', marginRight:'-22px' }}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={data.type === 0 ? 'Project Info' : (data.type === 1 ? 'Issue Info' : 'Request Info')} className={styles.card}>
            <Table className={styles.table} columns={columns} dataSource={dataSource} bordered pagination={false} size="middle" showHeader={false} />
          </Card>
          {data.type === 0 && <Card title="Issue/Request List" className={styles.card} style={{ marginTop: 20 }}>
            <Table className={styles.issueTable} columns={IsssueListColumns} dataSource={issueList} bordered pagination={false} size="middle" />
          </Card>}
        </Col>
        <Col span={12}>
          <Card title="Activity" className={styles.card}>
            <Timeline className={styles.timeline} style={{ marginTop: 20 }}>
              {Items}
            </Timeline>
          </Card>
        </Col>
        <Col>
          <Button className={styles.backButton} type="primary" onClick={cancel}>
            Back
          </Button>
        </Col>
      </Row>
    </div>
  )
}

Detail.propTypes = {
  caseDetail: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ caseDetail, loading }) => ({ caseDetail, loading: loading.models.caseDetail }))(Detail)
