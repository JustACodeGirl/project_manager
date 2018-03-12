package com.ovt.pm.service;

import java.util.List;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.Issue;
import com.ovt.pm.dao.vo.IssueAct;
import com.ovt.pm.dao.vo.Project;
import com.ovt.pm.service.exception.ServiceException;

/**
 * ProjectService
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
public interface ProjectService
{

    Project getById(Long id) throws ServiceException;

    PageResult<IssueAct> getActs(PageInfo pageInfo, Long id)
            throws ServiceException;

    void add(Project project) throws ServiceException;

    void update(Project project) throws ServiceException;

    void open(Project project) throws ServiceException;

    void close(Long id, Integer result, String comments, String attachmentIds,
            String updateTime) throws ServiceException;

    void finish(Long id, String comments, String attachmentIds, String updateTime)
            throws ServiceException;

    void comment(Long id, String comments, String attachmentIds)
            throws ServiceException;

    void updateProgress(Long id, Integer progress) throws ServiceException;

    List<Project> get() throws ServiceException;
    
    List<Project> getOpenedAndRollback() throws ServiceException;

    List<Issue> getIssueList(Long id) throws ServiceException;

}
