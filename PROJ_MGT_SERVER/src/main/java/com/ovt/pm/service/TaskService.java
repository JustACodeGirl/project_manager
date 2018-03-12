package com.ovt.pm.service;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.Task;
import com.ovt.pm.service.exception.ServiceException;

/**
 * TaskService
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
public interface TaskService {

	PageResult<Task> getToDo(PageInfo pageInfo, String condition) throws ServiceException;

	PageResult<Task> getRelated(PageInfo pageInfo, String condition) throws ServiceException;

	PageResult<Task> getCC(PageInfo pageInfo, String condition) throws ServiceException;

	PageResult<Task> query(PageInfo pageInfo, Long taskId, String taskType,
			String taskName, String status, String deadline)
			throws ServiceException;
}
