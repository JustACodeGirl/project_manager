package com.ovt.pm.dao;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.IssueAct;

/**
 * IssueActDao
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface IssueActDao {

	long add(IssueAct issueAct);

	void update(IssueAct issueAct);

	IssueAct getById(long issueActId);

	PageResult<IssueAct> getAll(PageInfo pageInfo,long issueId);
}
