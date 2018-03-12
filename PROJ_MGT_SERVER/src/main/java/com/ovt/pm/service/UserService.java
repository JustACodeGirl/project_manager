package com.ovt.pm.service;

import java.util.List;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.pm.dao.vo.User;
import com.ovt.pm.service.exception.ServiceException;

/**
 * UserService
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
public interface UserService {

    String login(String email, String password) throws ServiceException;

	void logout(String accessToken) throws ServiceException;

	User getByAccessToken(String accessToken) throws ServiceException;

	void cleanExpiredUserToken() throws ServiceException;

	User getByCode(String userCode) throws ServiceException;

	User getById(Long id) throws ServiceException;

	PageResult<User> get(PageInfo pageInfo) throws ServiceException;

	boolean check(String userCode) throws ServiceException;

	void add(User user) throws ServiceException;

	void update(User user) throws ServiceException;

	void delete(Long id) throws ServiceException;

	List<String> autoComplete(String userCode) throws ServiceException;

	User getUser() throws ServiceException;

	boolean isPa(long userId) throws ServiceException;

	boolean isDefaultCC(long userId) throws ServiceException;

	boolean isAdmin(long userId) throws ServiceException;

	List<String> getEntities() throws ServiceException;

	List<String> getLocations(String entity) throws ServiceException;

	void updatePassword(String oldPassword, String newPassword)
			throws ServiceException;

}
