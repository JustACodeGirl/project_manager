package com.ovt.pm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ovt.common.exception.DBException;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.dao.OperationLogDao;
import com.ovt.pm.dao.vo.OperationLog;
import com.ovt.pm.service.exception.ServiceException;

/**
 * OperationLogServiceImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
@Service
public class OperationLogServiceImpl implements OperationLogService {

	@Autowired
	private OperationLogDao operationLogDao;

	@Autowired
	private UserService userService;

	@Override
	public void add(OperationLog log) throws ServiceException {
		try {
			operationLogDao.add(log);
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public PageResult<OperationLog> get(PageInfo pageInfo)
			throws ServiceException {
		try {
			PageResult<OperationLog> logResults = operationLogDao
					.getAll(pageInfo);
			return logResults;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public PageResult<OperationLog> query(PageInfo pageInfo, Long taskId,
			String startTime, String endTime) throws ServiceException {
		try {
			String sql = "1 = 1";
			if (StringUtils.isNotBlank(taskId)) {
				sql += " and task_id = " + taskId;
			}
			if (StringUtils.isNotBlank(startTime)) {
				sql += " and create_time_utc >= '" + startTime + "'";
			}
			if (StringUtils.isNotBlank(endTime)) {
				sql += " and create_time_utc <= '" + endTime + "'";
			}
			PageResult<OperationLog> logResults = operationLogDao.getByWhere(
					pageInfo, sql);
			return logResults;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

}
