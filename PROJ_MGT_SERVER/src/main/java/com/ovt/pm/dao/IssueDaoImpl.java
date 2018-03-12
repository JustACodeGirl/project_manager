package com.ovt.pm.dao;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ovt.common.dao.DaoHelper;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.DaoRowMapper;
import com.ovt.common.utils.DateTimeUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.dao.vo.Issue;

/**
 * IssueDaoImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class IssueDaoImpl implements IssueDao
{
    @Autowired
    private DaoHelper daoHelper;

    private static final String SQL_INSERT_ISSUE = "INSERT INTO issue(proj_id,issue_name,issue_desc,keywords,depends_on,blocks,risks,type,status,priority,owner_id,"
            + "creator,cost_estimate,cost_actual,url,start_time,deadline,create_time_utc,update_time_utc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    private static final String SQL_GET_ISSUE_BY_ID = "SELECT * FROM issue WHERE id = ?";

    private static final String SQL_GET_ISSUE_BY_NAME = "SELECT * FROM issue WHERE issue_name = ?";

    private static final String SQL_GET_ISSUE_LIST = "SELECT * FROM issue";

    private static final String SQL_GET_ISSUE_LIST_BY_PROJECT_ID = "SELECT * FROM issue WHERE proj_id = ?";

    private static final String SQL_GET_HANDLER_BY_ISSUE_ID = "SELECT handler From issue WHERE id = ?";

    private static final String SQL_UPDATE_HANDLER_BY_ISSUE_ID = "UPDATE issue SET handler = ?,update_time_utc = ? WHERE id = ?";

    private static final String SQL_INSERT_ISSUE_RELATED = "INSERT INTO issue_related(issue_id,user_id) SELECT ?, id FROM user WHERE user_code = ?";

    private static final String SQL_INSERT_ISSUE_CC = "INSERT INTO issue_cc(issue_id,user_id) SELECT ?, id FROM user WHERE user_code = ?";

    private static final String SQL_GET_ISSUE_RELATED_BY_PROJ_ID = "SELECT DISTINCT user_code FROM user WHERE id in (SELECT user_id FROM issue_related WHERE issue_id = ?)";

    private static final String SQL_GET_ISSUE_CC_BY_PROJ_ID = "SELECT DISTINCT user_code FROM user WHERE id in (SELECT user_id FROM issue_cc WHERE issue_id = ?)";
    
    private static final String SQL_DELETE_ISSUE_RELATED = "DELETE FROM issue_related WHERE issue_id = ?";

    private static final String SQL_DELETE_ISSUE_CC = "DELETE FROM issue_cc WHERE issue_id = ?";
    

    @Override
    public long add(Issue issue)
    {
        String errMsg = "failed to insert issue";
        long issueId = daoHelper.save(SQL_INSERT_ISSUE, errMsg, true,
                issue.getProjId(), issue.getIssueName(), issue.getIssueDesc(),
                issue.getKeywords(), issue.getDependsOn(), issue.getBlocks(),
                issue.getRisks(), issue.getType(), issue.getStatus(),
                issue.getPriority(), issue.getOwnerId(), issue.getCreator(),
                issue.getCostEstimate(), issue.getCostActual(), issue.getUrl(),
                issue.getStartTime(), issue.getDeadline(),
                DateTimeUtils.getUTCTimeStr(),DateTimeUtils.getUTCTimeStr());
        return issueId;
    }

    @Override
    public void update(Issue issue)
    {
        String errMsg = MessageFormat.format(
                "failed to update issue by id={0}", issue.getId());
        String updateSql = daoHelper.makeUpdateSql(issue);
        updateSql += (",update_time_utc = '" + DateTimeUtils.getUTCTimeStr()
                + "'" + StringUtils.SQL_WHERE + "id = " + issue.getId());
        daoHelper.update(updateSql, errMsg);
    }

    @Override
    public Issue getById(long issueId)
    {
        String errMsg = MessageFormat.format("failed to get issue by id={0}",
                issueId);
        Issue issue = daoHelper.queryForObject(SQL_GET_ISSUE_BY_ID,
                new DaoRowMapper<Issue>(Issue.class), errMsg, issueId);
        return issue;
    }

    @Override
    public Issue getByName(String issueName)
    {
        String errMsg = MessageFormat.format("failed to get issue by name={0}",
                issueName);
        Issue issue = daoHelper.queryForObject(SQL_GET_ISSUE_BY_NAME,
                new DaoRowMapper<Issue>(Issue.class), errMsg, issueName);
        return issue;
    }

    @Override
    public PageResult<Issue> getAll(PageInfo pageInfo)
    {
        String errMsg = "Failed to get all issue";
        String sql = SQL_GET_ISSUE_LIST;
        if (StringUtils.isNotBlank(pageInfo.getOrderBy()))
        {
            sql += " order by " + pageInfo.getOrderBy() + " "
                    + pageInfo.getOrder();
        }
        PageResult<Issue> issues = daoHelper.queryForPageList(pageInfo, sql,
                new DaoRowMapper<Issue>(Issue.class), errMsg);
        return issues;
    }

    @Override
    public List<Issue> getByProjId(long projId)
    {
        String errMsg = MessageFormat.format(
                "Failed to get Issue list by project id = {0}", projId);
        String sql = SQL_GET_ISSUE_LIST_BY_PROJECT_ID;
        List<Issue> issues = daoHelper.queryForList(sql,
                new DaoRowMapper<Issue>(Issue.class), errMsg, projId);
        return issues;
    }

	@Override
	public void updateHandler(long issueId, long userId) {
		String errMsg = MessageFormat.format(
				"Failed to update handler by issue id = {0}", issueId);
		String handler = daoHelper.queryForObject(SQL_GET_HANDLER_BY_ISSUE_ID,
				String.class, errMsg, issueId);
		if (null == handler) {
			handler = ",";
		}
		String newHandler = handler + userId + ",";
		daoHelper.update(SQL_UPDATE_HANDLER_BY_ISSUE_ID, errMsg, newHandler,
				DateTimeUtils.getUTCTimeStr(),issueId);
	}
	
	@Override
	public void deleteIssueRelated(long issueId) {
		String errMsg = MessageFormat.format(
				"failed to delete issue related by issue id = {0}", issueId);
		daoHelper.update(SQL_DELETE_ISSUE_RELATED, errMsg, issueId);
	}

	@Override
	public void deleteIssueCC(long issueId) {
		String errMsg = MessageFormat.format(
				"failed to delete issue cc by issue id = {0}", issueId);
		daoHelper.update(SQL_DELETE_ISSUE_CC, errMsg, issueId);
	}

    @Override
    public void addRelated(List<String> relatedUser, long issueId)
    {
        String errMsg = "failed to add issue related";
        List<Object[]> batchArgs = new ArrayList<Object[]>();
        for (String userCode : relatedUser)
        {
            Object[] arg = new Object[2];
            arg[0] = issueId;
            arg[1] = userCode;
            batchArgs.add(arg);
        }
        daoHelper.batchUpdate(SQL_INSERT_ISSUE_RELATED, errMsg, batchArgs);
    }

    @Override
    public void addCC(List<String> ccUser, long issueId)
    {
        String errMsg = "failed to add issue related";
        List<Object[]> batchArgs = new ArrayList<Object[]>();
        for (String userCode : ccUser)
        {
            Object[] arg = new Object[2];
            arg[0] = issueId;
            arg[1] = userCode;
            batchArgs.add(arg);
        }
        daoHelper.batchUpdate(SQL_INSERT_ISSUE_CC, errMsg, batchArgs);
    }

    @Override
    public List<String> getRelated(long issueId)
    {
        String errMsg = MessageFormat.format(
                "failed to get all issue related by issue id = {0}", issueId);
        List<String> relatedList = daoHelper.queryForList(
                SQL_GET_ISSUE_RELATED_BY_PROJ_ID, new DaoRowMapper<String>(
                        String.class), errMsg, issueId);
        return relatedList;
    }

    @Override
    public List<String> getCC(long issueId)
    {
        String errMsg = MessageFormat.format(
                "failed to get all issue related by issue id = {0}", issueId);
        List<String> relatedList = daoHelper.queryForList(
                SQL_GET_ISSUE_CC_BY_PROJ_ID, new DaoRowMapper<String>(
                        String.class), errMsg, issueId);
        return relatedList;
    }
}
