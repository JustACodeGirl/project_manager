package com.ovt.pm.dao;

import java.text.MessageFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ovt.common.dao.DaoHelper;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.DaoRowMapper;
import com.ovt.common.utils.DateTimeUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.dao.vo.OperationLog;

/**
 * OperationLogDaoImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class OperationLogDaoImpl implements OperationLogDao {
	@Autowired
	private DaoHelper daoHelper;

	private static final String SQL_INSERT_OPERATION_LOG = "INSERT INTO operation_log"
			+ "(operator_id,operator,task_id,task_type,field_name,old_value,new_value,create_time_utc) values (?,?,?,?,?,?,?,?)";

	private static final String SQL_GET_LOG_BY_ID = "SELECT * FROM operation_log WHERE id = ?";

	private static final String SQL_GET_LOG_LIST = "SELECT * FROM operation_log";

	@Override
	public long add(OperationLog operationLog) {
		String errMsg = "failed to insert operation log";
		long operationId = daoHelper.save(SQL_INSERT_OPERATION_LOG, errMsg,
				true, operationLog.getOperatorId(),operationLog.getOperator(), operationLog.getTaskId(),
				operationLog.getTaskType(), operationLog.getFieldName(),
				operationLog.getOldValue(), operationLog.getNewValue(),
				DateTimeUtils.getUTCTimeStr());
		return operationId;
	}

	@Override
	public void update(OperationLog operationLog) {
		String errMsg = MessageFormat.format(
				"failed to update operation log by id={0}",
				operationLog.getId());
		String updateSql = daoHelper.makeUpdateSql(operationLog);
		updateSql += (StringUtils.SQL_WHERE + "id = " + operationLog.getId());
		daoHelper.update(updateSql, errMsg);
	}

	@Override
	public OperationLog getById(long operationLogId) {
		String errMsg = MessageFormat.format(
				"failed to get operation log by id={0}", operationLogId);
		OperationLog projectAct = daoHelper.queryForObject(SQL_GET_LOG_BY_ID,
				new DaoRowMapper<OperationLog>(OperationLog.class), errMsg,
				operationLogId);
		return projectAct;
	}

	@Override
	public PageResult<OperationLog> getAll(PageInfo pageInfo) {
		String errMsg = "Failed to get all operation logs";
		String sql = SQL_GET_LOG_LIST;
		if (StringUtils.isNotBlank(pageInfo.getOrderBy())) {
			sql += " order by " + pageInfo.getOrderBy() + " "
					+ pageInfo.getOrder();
		}
		PageResult<OperationLog> logs = daoHelper.queryForPageList(
				pageInfo, sql, new DaoRowMapper<OperationLog>(
						OperationLog.class), errMsg);
		return logs;
	}

	@Override
	public PageResult<OperationLog> getByWhere(PageInfo pageInfo, String where) {
		if (StringUtils.isBlank(where)) {
			where = "1 = 1";
		}
		String errMsg = MessageFormat
				.format("failed to get operation log list by where clause : {0}",
						where);
		String sql = "SELECT * FROM operation_log WHERE " + where;
		PageResult<OperationLog> logResult = daoHelper.queryForPageList(
				pageInfo, sql, new DaoRowMapper<OperationLog>(
						OperationLog.class), errMsg);
		return logResult;
	}
}
