package com.ovt.pm.dao;

import java.util.List;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.Project;

/**
 * ProjectDao
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface ProjectDao {

	long add(Project project);

	void update(Project project);

	Project getById(long projectId);
	
	Project getByName(String projectName);

	PageResult<Project> getAll(PageInfo pageInfo);

	List<Long> getUserRelated(long userId);
	
	List<String> getProjectCC(long projId);
	
	List<String> getProjectRelated(long projId);

	List<Project> getOpenedAndRollbackByUserId(long userId);

	List<Project> get();
	
	List<Project> getOpenedAndRollback();

	void updateHandler(long projectId, long userId);

	void addRelated(List<String> relatedUser, long projId);

	void addCC(List<String> ccUser, long projId);

	void deleteProjectRelated(long projId);

	void deleteProjectCC(long projId);
	
	List<Project> getRemind(String deadline);
	
	List<String> getProjectAllUsers(long projId,String pm);
	
}
