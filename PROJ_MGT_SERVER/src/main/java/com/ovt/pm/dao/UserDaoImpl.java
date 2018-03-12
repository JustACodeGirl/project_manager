package com.ovt.pm.dao;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ovt.common.dao.DaoHelper;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.DaoRowMapper;
import com.ovt.common.utils.DateTimeUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.dao.vo.User;
import com.ovt.pm.dao.vo.UserRole;

/**
 * UserDaoImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class UserDaoImpl implements UserDao {
	@Autowired
	private DaoHelper daoHelper;

	private static final String SQL_INSERT_USER = "INSERT INTO user(user_code,type,email,entity,location,office_tel,"
			+ "home_tel,company,department,title,create_time_utc) values(?,?,?,?,?,?,?,?,?,?,?)";

	private static final String SQL_GET_USER_BY_ID = "SELECT * FROM user WHERE id = ?";

	private static final String SQL_GET_USER_BY_CODE = "SELECT * FROM user WHERE user_code = ? and is_valid = 1 LIMIT 0,1";
	
	private static final String SQL_GET_USER_BY_EMAIL = "SELECT * FROM user WHERE email = ? and is_valid = 1";

	private static final String SQL_GET_USER_LIST = "SELECT * FROM user WHERE is_valid = 1";

	private static final String SQL_INSERT_USER_ROLE = "INSERT INTO user_role(user_id,role_id) values (?,?)";

	private static final String SQL_DELETE_USER_ROLE = "DELETE FROM user_role WHERE user_id = ?";

	private static final String SQL_GET_USER_ROLES = "SELECT * FROM user_role WHERE user_id = ?";
	
	private static final String SQL_UPDATE_PASSWORD = "UPDATE user SET password=? WHERE id = ?";

	@Override
	public long add(User user) {
		String errMsg = "failed to insert user";
		long userId = daoHelper.save(SQL_INSERT_USER, errMsg, true,
				user.getUserCode(), user.getType(),
				user.getEmail(), user.getEntity(), user.getLocation(),
				user.getOfficeTel(), user.getHomeTel(), user.getCompany(),
				user.getDepartment(), user.getTitle(),
				DateTimeUtils.getUTCTimeStr());
		return userId;
	}

	@Override
	public void addUserRole(List<UserRole> userRoles) {
		String errMsg = "failed to add user role";
		List<Object[]> batchArgs = new ArrayList<Object[]>();
		for (UserRole userRole : userRoles) {
			Object[] arg = new Object[2];
			arg[0] = userRole.getUserId();
			arg[1] = userRole.getRoleId();
			batchArgs.add(arg);
		}
		daoHelper.batchUpdate(SQL_INSERT_USER_ROLE, errMsg, batchArgs);
	}

	@Override
	public void deleteUserRole(long userId) {
		String errMsg = MessageFormat.format(
				"failed to delete user role by id={0}", userId);
		daoHelper.update(SQL_DELETE_USER_ROLE, errMsg, userId);
	}

	@Override
	public void update(User user) {
		String errMsg = MessageFormat.format("failed to update user by id={0}",
				user.getId());
		String updateSql = daoHelper.makeUpdateSql(user);
		updateSql += (StringUtils.SQL_WHERE + "id = " + user.getId());
		daoHelper.update(updateSql, errMsg);
	}

	@Override
	public User getById(long userId) {
		String errMsg = MessageFormat.format("failed to get user by id={0}",
				userId);
		User user = daoHelper.queryForObject(SQL_GET_USER_BY_ID,
				new DaoRowMapper<User>(User.class), errMsg, userId);
		List<UserRole> userRoleList = getUserRole(userId);
		List<Long> userRoles = new ArrayList<Long>();
		if (null != userRoleList) {
			for (UserRole userRole : userRoleList) {
				userRoles.add(userRole.getRoleId());
			}
			user.setRole(userRoles);
		}
		return user;
	}

	@Override
	public User getByCode(String userCode) {
		String errMsg = MessageFormat.format("failed to get user by code={0}",
				userCode);
		User user = daoHelper.queryForObject(SQL_GET_USER_BY_CODE,
				new DaoRowMapper<User>(User.class), errMsg, userCode);
		if(user != null){
		    List<UserRole> userRoleList = getUserRole(user.getId());
	        List<Long> userRoles = new ArrayList<Long>();
	        if (null != userRoleList) {
	            for (UserRole userRole : userRoleList) {
	                userRoles.add(userRole.getRoleId());
	            }
	            user.setRole(userRoles);
	        } 
		}
		return user;
	}
	
	@Override
    public User getByEmail(String email) {
        String errMsg = MessageFormat.format("failed to get user by email={0}",
                email);
        User user = daoHelper.queryForObject(SQL_GET_USER_BY_EMAIL,
                new DaoRowMapper<User>(User.class), errMsg, email);
        if(null != user) {
            List<UserRole> userRoleList = getUserRole(user.getId());
            List<Long> userRoles = new ArrayList<Long>();
            if (null != userRoleList && userRoleList.size() > 0 ) {
                for (UserRole userRole : userRoleList) {
                    userRoles.add(userRole.getRoleId());
                }
                user.setRole(userRoles);
            }
        }

        return user;
    }

	@Override
	public PageResult<User> getAll(PageInfo pageInfo) {
		String errMsg = "Failed to get all users";
		String sql = SQL_GET_USER_LIST;
		if (StringUtils.isNotBlank(pageInfo.getOrderBy())) {
			sql += " order by " + pageInfo.getOrderBy() + " "
					+ pageInfo.getOrder();
		}
		PageResult<User> users = daoHelper.queryForPageList(pageInfo, sql,
				new DaoRowMapper<User>(User.class), errMsg);
		for (User user : users.getResults()) {
			List<UserRole> userRoleList = getUserRole(user.getId());
			if (null != userRoleList) {
				List<Long> userRoles = new ArrayList<Long>();
				for (UserRole userRole : userRoleList) {
					userRoles.add(userRole.getRoleId());
				}
				user.setRole(userRoles);
			}
		}
		return users;
	}

	@Override
	public List<UserRole> getUserRole(long userId) {
		String errMsg = MessageFormat.format(
				"failed to get user role by user id={0}", userId);
		List<UserRole> userRole = daoHelper.queryForList(SQL_GET_USER_ROLES,
				new DaoRowMapper<UserRole>(UserRole.class), errMsg, userId);
		return userRole;
	}

	@Override
	public List<User> getByWhere(String where) {
		if (StringUtils.isBlank(where)) {
			where = "1 = 1";
		}
		String errMsg = MessageFormat.format(
				"failed to get user list by where clause : {0}", where);
		String sql = "SELECT * FROM user WHERE " + where;
		List<User> userResult = daoHelper.queryForList(sql,
				new DaoRowMapper<User>(User.class), errMsg);
		return userResult;
	}
	
    @Override
    public void updatePassword(final long userId, final String newPassword)
    {
        String errMsg = MessageFormat.format(
                "Failed to update user [{0}] password !", userId);

        daoHelper.update(SQL_UPDATE_PASSWORD, errMsg, newPassword, userId);
    }
}
