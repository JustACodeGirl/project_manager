package com.ovt.pm.dao;

import java.text.MessageFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ovt.common.dao.DaoHelper;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.DaoRowMapper;
import com.ovt.common.utils.DateTimeUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.dao.vo.IssueAct;

/**
 * IssueActDaoImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class IssueActDaoImpl implements IssueActDao
{
    @Autowired
    private DaoHelper daoHelper;

    private static final String SQL_INSERT_ISSUE_ACT = "INSERT INTO issue_act(proj_id,issue_id,issue_name,type,operator_id,operator_code,"
            + "action,comments,attachment_ids,create_time_utc) values (?,?,?,?,?,?,?,?,?,?)";

    private static final String SQL_GET_ISSUE_ACT_BY_ID = "SELECT * FROM issue_act WHERE id = ?";

    private static final String SQL_GET_ISSUE_ACT_LIST = "SELECT * FROM issue_act where issue_id = ?";

    @Override
    public long add(IssueAct issueAct)
    {
        String errMsg = "failed to insert issue act";
        long actId = daoHelper.save(SQL_INSERT_ISSUE_ACT, errMsg, true,
                issueAct.getProjId(), issueAct.getIssueId(),
                issueAct.getIssueName(), issueAct.getType(),
                issueAct.getOperatorId(), issueAct.getOperatorCode(),
                issueAct.getAction(), issueAct.getComments(),
                issueAct.getAttachmentIds(), DateTimeUtils.getUTCTimeStr());
        return actId;
    }

    @Override
    public void update(IssueAct issueAct)
    {
        String errMsg = MessageFormat.format(
                "failed to update issue act by id={0}", issueAct.getId());
        String updateSql = daoHelper.makeUpdateSql(issueAct);
        updateSql += (StringUtils.SQL_WHERE + "id = " + issueAct.getId());
        daoHelper.update(updateSql, errMsg);
    }

    @Override
    public IssueAct getById(long issueActId)
    {
        String errMsg = MessageFormat.format(
                "failed to get issue act by id={0}", issueActId);
        IssueAct issueAct = daoHelper.queryForObject(SQL_GET_ISSUE_ACT_BY_ID,
                new DaoRowMapper<IssueAct>(IssueAct.class), errMsg, issueActId);
        return issueAct;
    }

    @Override
    public PageResult<IssueAct> getAll(PageInfo pageInfo, long issueId)
    {
        String errMsg = "Failed to get all issue act";
        String sql = SQL_GET_ISSUE_ACT_LIST;
        if (StringUtils.isNotBlank(pageInfo.getOrderBy()))
        {
            sql += " order by " + pageInfo.getOrderBy() + " "
                    + pageInfo.getOrder();
        }
        PageResult<IssueAct> issueActs = daoHelper.queryForPageList(pageInfo,
                sql, new DaoRowMapper<IssueAct>(IssueAct.class), errMsg,
                issueId);
        return issueActs;
    }
}
