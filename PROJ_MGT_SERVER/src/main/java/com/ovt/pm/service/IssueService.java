package com.ovt.pm.service;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.Issue;
import com.ovt.pm.dao.vo.IssueAct;
import com.ovt.pm.service.exception.ServiceException;

/**
 * IssueService
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
public interface IssueService
{

    Issue getById(long id) throws ServiceException;

    PageResult<IssueAct> getActs(PageInfo pageInfo, long id)
            throws ServiceException;

    void add(Issue issue) throws ServiceException;

    void update(Issue issue) throws ServiceException;

    void approve(long id, int result, String comments, String attachmentIds,
            String updateTime) throws ServiceException;

    void finish(long id, String comments, String attachmentIds, String actualCost,
            String updateTime) throws ServiceException;

    void comment(long id, String comments, String attachmentIds)
            throws ServiceException;

    void updateProgress(long id, int progress) throws ServiceException;

    void close(long id, int result, String comments, String attachmentIds,
            String updateTime) throws ServiceException;
}
