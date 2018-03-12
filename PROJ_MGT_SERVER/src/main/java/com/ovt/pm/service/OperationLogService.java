package com.ovt.pm.service;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.OperationLog;
import com.ovt.pm.service.exception.ServiceException;

/**
 * OperationLogService
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
public interface OperationLogService {

	void add(OperationLog log) throws ServiceException;

	PageResult<OperationLog> get(PageInfo pageInfo) throws ServiceException;

	PageResult<OperationLog> query(PageInfo pageInfo, Long taskId,
			String startTime, String endTime) throws ServiceException;
}
