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
import com.ovt.pm.dao.vo.Project;

/**
 * ProjectDaoImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class ProjectDaoImpl implements ProjectDao {
	@Autowired
	private DaoHelper daoHelper;

	private static final String SQL_INSERT_PROJECT = "INSERT INTO project(proj_name,description,keywords,priority,pm,creator,"
			+ "status,start_time,deadline,create_time_utc,update_time_utc) values (?,?,?,?,?,?,?,?,?,?,?)";

	private static final String SQL_GET_PROJECT_BY_ID = "SELECT * FROM project WHERE id = ?";
	
	private static final String SQL_GET_PROJECT_BY_NAME = "SELECT * FROM project WHERE proj_name = ?";

	private static final String SQL_GET_PROJECT_LIST = "SELECT * FROM project";

	private static final String SQL_GET_OPENED_AND_FINISHED_BY_USERID = "SELECT * FROM project WHERE id in (SELECT proj_id FROM project_related WHERE user_id = ?) and status in (1,-1)";

	private static final String SQL_GET_PROJECT_RELATED_BY_USERID = "SELECT proj_id from project_related WHERE user_id = ?";

	private static final String SQL_GET_HANDLER_BY_PROJ_ID = "SELECT handler From project WHERE id = ?";

	private static final String SQL_UPDATE_HANDLER_BY_PROJ_ID = "UPDATE project SET handler = ?,update_time_utc = ? WHERE id = ?";

	private static final String SQL_INSERT_PROJECT_RELATED = "INSERT INTO project_related(proj_id,user_id) SELECT ?, id FROM user WHERE user_code = ?";

	private static final String SQL_INSERT_PROJECT_CC = "INSERT INTO project_cc(proj_id,user_id) SELECT ?, id FROM user WHERE user_code = ?";

	private static final String SQL_DELETE_PROJECT_RELATED = "DELETE FROM project_related WHERE proj_id = ?";

	private static final String SQL_DELETE_PROJECT_CC = "DELETE FROM project_cc WHERE proj_id = ?";

	private static final String SQL_GET_PROJECT_RELATED_BY_PROJ_ID = "SELECT DISTINCT user_code FROM user WHERE id in (SELECT user_id FROM project_related WHERE proj_id = ?)";

	private static final String SQL_GET_PROJECT_CC_BY_PROJ_ID = "SELECT DISTINCT user_code FROM user WHERE id in (SELECT user_id FROM project_cc WHERE proj_id = ?)";

	private static final String SQL_GET_REMIND_PROJECT_LIST = " SELECT * FROM project where deadline <> '' and deadline < ? and status < 3";
	
	@Override
	public long add(Project project) {
		String errMsg = "failed to insert project";
		long projId = daoHelper.save(SQL_INSERT_PROJECT, errMsg, true,
				project.getProjName(), project.getDescription(),
				project.getKeywords(), project.getPriority(), project.getPm(),
				project.getCreator(), project.getStatus(),
				project.getStartTime(), project.getDeadline(),
				DateTimeUtils.getUTCTimeStr(),DateTimeUtils.getUTCTimeStr());
		return projId;
	}

	@Override
	public void update(Project project) {
		String errMsg = MessageFormat.format(
				"failed to update project by id={0}", project.getId());
		String updateSql = daoHelper.makeUpdateSql(project);
		updateSql += (",update_time_utc = '" + DateTimeUtils.getUTCTimeStr() + "'"
		        + StringUtils.SQL_WHERE + "id = " + project.getId());
		daoHelper.update(updateSql, errMsg);
	}

	@Override
	public Project getById(long projectId) {
		String errMsg = MessageFormat.format("failed to get project by id={0}",
				projectId);
		Project project = daoHelper.queryForObject(SQL_GET_PROJECT_BY_ID,
				new DaoRowMapper<Project>(Project.class), errMsg, projectId);
		return project;
	}
	
   @Override
    public Project getByName(String projectName) {
        String errMsg = MessageFormat.format("failed to get project by name={0}",
                projectName);
        Project project = daoHelper.queryForObject(SQL_GET_PROJECT_BY_NAME,
                new DaoRowMapper<Project>(Project.class), errMsg, projectName);
        return project;
    }

	@Override
	public PageResult<Project> getAll(PageInfo pageInfo) {
		String errMsg = "failed to get all projects";
		String sql = SQL_GET_PROJECT_LIST;
		if (StringUtils.isNotBlank(pageInfo.getOrderBy())) {
			sql += " order by " + pageInfo.getOrderBy() + " "
					+ pageInfo.getOrder();
		}
		PageResult<Project> projects = daoHelper.queryForPageList(pageInfo,
				sql, new DaoRowMapper<Project>(Project.class), errMsg);
		return projects;
	}

	@Override
	public List<Long> getUserRelated(long userId) {
		String errMsg = MessageFormat.format(
				"failed to get all project related by user id = {0}", userId);
		List<Long> projectIdList = daoHelper.queryForList(
				SQL_GET_PROJECT_RELATED_BY_USERID, Long.class, errMsg, userId);
		return projectIdList;
	}

	@Override
	public List<Project> getOpenedAndRollbackByUserId(long userId) {
		String errMsg = MessageFormat.format(
                "failed to get Opened and Rollback  projects by user id = {0}", userId);
		List<Project> projectList = daoHelper.queryForList(
		        SQL_GET_OPENED_AND_FINISHED_BY_USERID, new DaoRowMapper<Project>(
						Project.class), errMsg, userId);
		return projectList;
	}

	@Override
	public List<Project> get() {
		String errMsg = "failed to get all projects";
		List<Project> projectList = daoHelper.queryForList(
				SQL_GET_PROJECT_LIST, new DaoRowMapper<Project>(Project.class),
				errMsg);
		return projectList;
	}
	
	@Override
	public List<Project> getOpenedAndRollback() {
		String errMsg = "failed to get Opened and Rollback  projects";
		List<Project> projectList = daoHelper.queryForList(
				SQL_GET_PROJECT_LIST + " where status in (1,-1)", new DaoRowMapper<Project>(Project.class),
				errMsg);
		return projectList;
	}

	@Override
	public void updateHandler(long projectId, long userId) {
		String errMsg = MessageFormat.format(
				"failed to update handler by project id = {0}", projectId);
		String handler = daoHelper.queryForObject(SQL_GET_HANDLER_BY_PROJ_ID,
				String.class, errMsg, projectId);
		handler = (null == handler) ? "," : handler;
		String newHandler = handler + userId + ",";
		daoHelper.update(SQL_UPDATE_HANDLER_BY_PROJ_ID, errMsg, newHandler,
		        DateTimeUtils.getUTCTimeStr(),projectId);
	}

	@Override
	public void deleteProjectRelated(long projId) {
		String errMsg = MessageFormat.format(
				"failed to delete project related by project id = {0}", projId);
		daoHelper.update(SQL_DELETE_PROJECT_RELATED, errMsg, projId);
	}

	@Override
	public void deleteProjectCC(long projId) {
		String errMsg = MessageFormat.format(
				"failed to delete project cc by project id = {0}", projId);
		daoHelper.update(SQL_DELETE_PROJECT_CC, errMsg, projId);
	}

	@Override
	public void addRelated(List<String> relatedUser, long projId) {
		String errMsg = "failed to add project related";
		List<Object[]> batchArgs = new ArrayList<Object[]>();
		for (String userCode : relatedUser) {
			Object[] arg = new Object[2];
			arg[0] = projId;
			arg[1] = userCode;
			batchArgs.add(arg);
		}
		daoHelper.batchUpdate(SQL_INSERT_PROJECT_RELATED, errMsg, batchArgs);
	}

	@Override
	public void addCC(List<String> ccUser, long projId) {
		String errMsg = "failed to add project cc";
		List<Object[]> batchArgs = new ArrayList<Object[]>();
		for (String userCode : ccUser) {
			Object[] arg = new Object[2];
			arg[0] = projId;
			arg[1] = userCode;
			batchArgs.add(arg);
		}
		daoHelper.batchUpdate(SQL_INSERT_PROJECT_CC, errMsg, batchArgs);
	}

	@Override
	public List<String> getProjectRelated(long projId) {
		String errMsg = MessageFormat
				.format("failed to get all project related by project id = {0}",
						projId);
		List<String> relatedList = daoHelper.queryForList(
				SQL_GET_PROJECT_RELATED_BY_PROJ_ID, new DaoRowMapper<String>(
						String.class), errMsg, projId);
		return relatedList;
	}

	@Override
	public List<String> getProjectCC(long projId) {
		String errMsg = MessageFormat.format(
				"failed to get all project cc by project id = {0}", projId);
		List<String> ccList = daoHelper.queryForList(
				SQL_GET_PROJECT_CC_BY_PROJ_ID, new DaoRowMapper<String>(
						String.class), errMsg, projId);
		return ccList;
	}
	
	@Override
    public List<Project> getRemind(String deadline) {
        String errMsg = "failed to get remind projects";
        List<Project> projectList = daoHelper.queryForList(
                SQL_GET_REMIND_PROJECT_LIST, new DaoRowMapper<Project>(Project.class),
                errMsg,deadline);
        return projectList;
    }
	
	@Override
	public List<String> getProjectAllUsers(long projId,String pm){
	    String errMsg = "failed to get project all users";
	    String sql = " SELECT email FROM user where is_valid=1 and  " +
	            " (id in ( " +
	            " select user_id from project_cc where proj_id = ? " +
	            " UNION ALL " +
	            " select user_id from project_related where proj_id = ? " +
	            ") ";
	    String pmFormat = StringUtils.formatBySeparator(pm, ",");
        if (StringUtils.isNotBlank(pmFormat))
        {
            sql += "  or id in ( " + pmFormat + ") ";
        }
        sql += ")";
        List<String> allUsers = daoHelper.queryForList(
                sql, new DaoRowMapper<String>(
                        String.class), errMsg, projId,projId);
        return allUsers;
	}
}
