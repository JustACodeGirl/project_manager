package com.ovt.pm.dao;

import java.util.List;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.Issue;

/**
 * IssueDao
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface IssueDao {

	long add(Issue issue);

	void update(Issue issue);

	Issue getById(long issueId);
	
	Issue getByName(String issueName);

	PageResult<Issue> getAll(PageInfo pageInfo);

	List<Issue> getByProjId(long projId);

	void updateHandler(long issueId, long userId);

	void addRelated(List<String> relatedUser, long issueId);

	void addCC(List<String> ccUser, long issueId);
	
	void deleteIssueRelated(long issueId);

	void deleteIssueCC(long issueId);

	List<String> getRelated(long issueId);

	List<String> getCC(long issueId);
}
