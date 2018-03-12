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
import com.ovt.pm.dao.vo.ProjectAct;

/**
 * ProjectActDaoImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class ProjectActDaoImpl implements ProjectActDao
{
    @Autowired
    private DaoHelper daoHelper;

    private static final String SQL_INSERT_PROJECT_ACT = "INSERT INTO project_act(proj_id,operator_id,operator_code,action,"
            + "comments,attachment_ids,create_time_utc) values (?,?,?,?,?,?,?)";

    private static final String SQL_GET_PROJECT_ACT_BY_ID = "SELECT * FROM project_act WHERE id = ?";

    private static final String SQL_GET_PROJECT_ACT_LIST = " SELECT * from (SELECT proj_id,0 as issue_id,'' as issue_name,null AS type,operator_id, "
            + " operator_code,action,comments,attachment_ids,create_time_utc FROM project_act WHERE proj_id = ? "
            + " UNION ALL "
            + " SELECT proj_id,issue_id,issue_name,type,operator_id,operator_code,action, "
            + " comments,attachment_ids,create_time_utc FROM issue_act WHERE proj_id = ?) as all_act ";

    @Override
    public long add(ProjectAct projectAct)
    {
        String errMsg = "failed to insert project act";
        long actId = daoHelper.save(SQL_INSERT_PROJECT_ACT, errMsg, true,
                projectAct.getProjId(), projectAct.getOperatorId(),
                projectAct.getOperatorCode(), projectAct.getAction(),
                projectAct.getComments(), projectAct.getAttachmentIds(),
                DateTimeUtils.getUTCTimeStr());
        return actId;
    }

    @Override
    public void update(ProjectAct projectAct)
    {
        String errMsg = MessageFormat.format(
                "failed to update project act by id={0}", projectAct.getId());
        String updateSql = daoHelper.makeUpdateSql(projectAct);
        updateSql += (StringUtils.SQL_WHERE + "id = " + projectAct.getId());
        daoHelper.update(updateSql, errMsg);
    }

    @Override
    public ProjectAct getById(long projectActId)
    {
        String errMsg = MessageFormat.format(
                "failed to get project act by id={0}", projectActId);
        ProjectAct projectAct = daoHelper.queryForObject(
                SQL_GET_PROJECT_ACT_BY_ID, new DaoRowMapper<ProjectAct>(
                        ProjectAct.class), errMsg, projectActId);
        return projectAct;
    }

    @Override
    public PageResult<IssueAct> getAll(PageInfo pageInfo, long projId)
    {
        String errMsg = "Failed to get all project and issue acts";
        String sql = SQL_GET_PROJECT_ACT_LIST;
        if (StringUtils.isNotBlank(pageInfo.getOrderBy()))
        {
            sql += " order by " + pageInfo.getOrderBy() + " "
                    + pageInfo.getOrder();
        }
        PageResult<IssueAct> projectActs = daoHelper.queryForPageList(
                pageInfo, sql, new DaoRowMapper<IssueAct>(IssueAct.class),
                errMsg, projId,projId);
        return projectActs;
    }
}
