package com.ovt.pm.dao;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.IssueAct;
import com.ovt.pm.dao.vo.ProjectAct;

/**
 * ProjectActDao
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface ProjectActDao {

	long add(ProjectAct projectAct);

	void update(ProjectAct projectAct);

	ProjectAct getById(long projectActId);

	PageResult<IssueAct> getAll(PageInfo pageInfo, long projId);
}
