package com.ovt.pm.dao;

import java.util.List;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.User;
import com.ovt.pm.dao.vo.UserRole;

/**
 * UserDao
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface UserDao {

	public long add(User user);

	void update(User user);

	User getById(long userId);

	User getByCode(String userCode);
	
	User getByEmail(String email);

	PageResult<User> getAll(PageInfo pageInfo);

	void addUserRole(List<UserRole> userRoles);
	
	void deleteUserRole(long userId);

	List<UserRole> getUserRole(long userId);
	
	List<User> getByWhere(String where);
	
	void updatePassword(long userId, String newPassword);
}
