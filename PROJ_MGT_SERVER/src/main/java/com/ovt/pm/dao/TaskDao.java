package com.ovt.pm.dao;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.Task;

/**
 * TaskDao
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface TaskDao {

	PageResult<Task> getByWhere(PageInfo pageInfo, String where);
}
