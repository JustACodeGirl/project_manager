package com.ovt.pm.dao;

import java.text.MessageFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ovt.common.dao.DaoHelper;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.DaoRowMapper;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.dao.vo.Task;

/**
 * TaskDaoImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class TaskDaoImpl implements TaskDao {
	@Autowired
	private DaoHelper daoHelper;

	@Override
	public PageResult<Task> getByWhere(PageInfo pageInfo, String where) {
		if(StringUtils.isBlank(where)){
			where = "1 = 1";
		}
		String sql = "SELECT * FROM task WHERE " + where + " order by task_id asc";
		String errMsg = MessageFormat.format(
                "failed to get task list by sql : {0}", sql);
		PageResult<Task> tasks = daoHelper.queryForPageList(pageInfo, sql,
				new DaoRowMapper<Task>(Task.class), errMsg);
		return tasks;
	}
}
