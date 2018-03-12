package com.ovt.pm.dao;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.OperationLog;

/**
 * OperationLogDao
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface OperationLogDao {

	long add(OperationLog operationLog);

	void update(OperationLog operationLog);

	OperationLog getById(long operationLogId);

	PageResult<OperationLog> getAll(PageInfo pageInfo);

	PageResult<OperationLog> getByWhere(PageInfo pageInfo, String where);
}
