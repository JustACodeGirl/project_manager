package com.ovt.pm.service;

import java.sql.Timestamp;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ovt.common.context.SessionContext;
import com.ovt.common.exception.DBException;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.model.Session;
import com.ovt.common.utils.DataFormatValidator;
import com.ovt.common.utils.DateTimeUtils;
import com.ovt.common.utils.EncryptionUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.config.AppProperties;
import com.ovt.pm.dao.AccessTokenDao;
import com.ovt.pm.dao.ProjectDao;
import com.ovt.pm.dao.UserDao;
import com.ovt.pm.dao.vo.Project;
import com.ovt.pm.dao.vo.Token;
import com.ovt.pm.dao.vo.User;
import com.ovt.pm.dao.vo.UserRole;
import com.ovt.pm.service.exception.ServiceErrorCode;
import com.ovt.pm.service.exception.ServiceException;

/**
 * UserServiceImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private AccessTokenDao userAccessTokenDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProjectDao projectDao;
    
    @Autowired
    private AppProperties appProperties;

    private static String NAV_PENDING_CASE = "Pending Task";
    private static String NAV_NEW_PROJECT = "New Project";
    private static String NAV_NEW_ISSUE = "New Issue/Request";
    private static String NAV_INTEGRATE_QUERY = "Integrate Query";
    private static String NAV_DATA_MAINTAIL_LOG = "Data Maintail Log";
    private static String NAV_USER_MANAGEMENT = "User Management";
    private String[] allNav = new String[] { NAV_PENDING_CASE, NAV_NEW_PROJECT,
            NAV_NEW_ISSUE, NAV_INTEGRATE_QUERY, NAV_DATA_MAINTAIL_LOG,
            NAV_USER_MANAGEMENT };

    @Override
    public String login(String email, String password)
            throws ServiceException {
        User user = userDao.getByEmail(email);

        if (null == user) {
            String errMsg = MessageFormat.format("email {0} not exist", email);
            throw new ServiceException(ServiceErrorCode.USER_NOT_EXIST, errMsg);
        }
        
        if (1 == user.getType()) {
            // LDAP接口
        }

        if (!StringUtils.equals(user.getPassword(),
                EncryptionUtils.encrypt(password))) {
            throw new ServiceException(ServiceErrorCode.WRONG_PASSWORD, "Password is wrong");
        }

        String accessToken = this.generateAccessToken(user.getId());

        List<String> navList = computeNav(user.getId());
        user.setNavList(navList);

        Session session = new Session();
        session.set(Session.USER, user);
        SessionContext.setCurrentSession(session);

        return accessToken;
    }

    @Override
    public void logout(String accessToken) throws ServiceException {
        if (!StringUtils.isNotBlank(accessToken)) {
            throw new ServiceException(ServiceErrorCode.INVALID_ACCESS_TOKEN,
                    "AccessToken invalid");
        }
        try {
            userAccessTokenDao.delete(accessToken);
        } catch (DBException e) {
            throw new ServiceException("SYSTEM_UNEXPECTED",
                    MessageFormat.format("Failed delete access token - [{0}]!",
                            accessToken), e);
        }
    }

    @Override
    public void cleanExpiredUserToken() throws ServiceException {
        userAccessTokenDao.deleteExpiredUserToken();
    }

    @Override
    public User getByAccessToken(String accessToken) throws ServiceException {
        try {
            long userId = userAccessTokenDao.getUserByToken(accessToken);
            User user = userDao.getById(userId);
            return user;
        } catch (Exception e) {
            throw new ServiceException(ServiceErrorCode.INVALID_ACCESS_TOKEN,
                    MessageFormat.format(
                            "Failed get user by access token - [{0}]!",
                            accessToken), e);
        }
    }

    private String generateAccessToken(long userId) throws ServiceException {
        String token = EncryptionUtils.generateUUID();

        Token accessToken = new Token();
        accessToken.setToken(token);
        accessToken.setUserId(userId);
        accessToken.setExpireTime(new Timestamp(DateTimeUtils.addSeconds(
                new java.util.Date(), appProperties.cookieAccessTokenAge).getTime()));

        try {
            userAccessTokenDao.save(accessToken);
        } catch (DBException e) {
            throw new ServiceException("SYSTEM_UNEXPECTED",
                    MessageFormat.format("Failed save access token - [{0}]!",
                            accessToken), e);
        }

        return token;
    }

    private void checkUserCodeValid(String userCode) throws ServiceException {
        if (!DataFormatValidator.isValidNickName(userCode)) {
            throw new ServiceException("INVALID_USER_NAME",
                    "length should between 0 ~ 50");
        }
    }

    @Override
    public User getByCode(String userCode) throws ServiceException {
        try {
            User user = userDao.getByCode(userCode);
            return user;
        } catch (DBException e) {
            throw new ServiceException("DB_EXCEPTION", e.getMessage());
        }
    }

    @Override
    public User getById(Long id) throws ServiceException {
        try {
            User user = userDao.getById(id);
            return user;
        } catch (DBException e) {
            throw new ServiceException("DB_EXCEPTION", e.getMessage());
        }
    }

    @Override
    public PageResult<User> get(PageInfo pageInfo) throws ServiceException {
        try {
            PageResult<User> userResult = userDao.getAll(pageInfo);
            return userResult;
        } catch (DBException e) {
            throw new ServiceException("DB_EXCEPTION", e.getMessage());
        }
    }

    @Override
    public boolean check(String userCode) throws ServiceException {
        User user = null;
        try {
            checkUserCodeValid(userCode);
            user = userDao.getByCode(userCode);
        } catch (DBException e) {
            throw new ServiceException("DB_EXCEPTION", e.getMessage());
        }
        if (null == user) {
            throw new ServiceException("USER_NOT_EXIST", "user not exist");
        }
        return true;
    }

    @Override
    public void add(User user) throws ServiceException {
        try {
            if (null != userDao.getByEmail(user.getEmail()))
            {
                throw new ServiceException(ServiceErrorCode.MAIL_DUPLICATED, "mail duplicated");
            }
            
            if (null != userDao.getByCode(user.getUserCode()))
            {
                throw new ServiceException(ServiceErrorCode.USER_DUPLICATED, "user duplicated");
            }
            
            checkUserCodeValid(user.getUserCode());
            
            long userId = userDao.add(user);
            List<UserRole> userRoleList = new ArrayList<UserRole>();
            if (null == user.getRole()) {
                throw new ServiceException(ServiceErrorCode.INVALID_USER_ROLE, "invalid user role");
            }
            for (long roleId : user.getRole()) {
                UserRole userRole = new UserRole(roleId, userId);
                userRoleList.add(userRole);
            }
            userDao.addUserRole(userRoleList);
        } catch (DBException e) {
            throw new ServiceException("DB_EXCEPTION", e.getMessage());
        }
    }

    @Override
    public void update(User user) throws ServiceException {
        try {
            List<User> sameEmailUser = userDao.getByWhere("id <> " + user.getId() + " and email = '"+user.getEmail()+"' and is_valid = 1 ");
            if (null != sameEmailUser && 0 < sameEmailUser.size())
            {
                throw new ServiceException(ServiceErrorCode.MAIL_DUPLICATED, "mail duplicated");
            }
            List<User> sameCodeUser = userDao.getByWhere("id <> " + user.getId() + " and user_code = '"+user.getUserCode()+"'  and is_valid = 1 ");
            if (null != sameCodeUser && 0 < sameCodeUser.size())
            {
                throw new ServiceException(ServiceErrorCode.USER_DUPLICATED, "user duplicated");
            }
            userDao.update(user);
            userDao.deleteUserRole(user.getId());
            if (null == user.getRole()) {
                return;
            }
            List<UserRole> userRoleList = new ArrayList<UserRole>();
            if (null == user.getRole()) {
                return;
            }
            for (long roleId : user.getRole()) {
                UserRole userRole = new UserRole(roleId, user.getId());
                userRoleList.add(userRole);
            }
            userDao.addUserRole(userRoleList);
        } catch (DBException e) {
            throw new ServiceException("DB_EXCEPTION", e.getMessage());
        }
    }

    @Override
    public void delete(Long id) throws ServiceException {
        try {
            User user = new User();
            user.setId(id);
            user.setIsValid(0);
            userDao.update(user);
            userDao.deleteUserRole(id);
        } catch (DBException e) {
            throw new ServiceException("DB_EXCEPTION", e.getMessage());
        }
    }

    @Override
    public List<String> autoComplete(String userCode) throws ServiceException {
        try {
            List<String> userCodeList = new ArrayList<String>();
            if(StringUtils.isBlank(userCode)){
                return userCodeList;
            }
            List<User> userList = userDao.getByWhere("user_code like '"
                    + userCode + "%' and is_valid = 1");
            for (User user : userList) {
                userCodeList.add(user.getUserCode());
            }
            return userCodeList;
        } catch (DBException e) {
            throw new ServiceException("DB_EXCEPTION", e.getMessage());
        }
    }

    public User getUser() throws ServiceException {
        Session session = SessionContext.getCurrentSession();
        if (null == session) {
            throw new ServiceException("SessionException", "session is null");
        }
        return (User) session.get(Session.USER);
    }

    public boolean isPa(long userId) throws ServiceException {
        List<UserRole> userRoles = userDao.getUserRole(userId);
        for (UserRole userRole : userRoles) {
            if (userRole.getRoleId() == 2) {
                return true;
            }
        }
        return false;
    }
    
    public boolean isDefaultCC(long userId) throws ServiceException {
        List<UserRole> userRoles = userDao.getUserRole(userId);
        for (UserRole userRole : userRoles) {
            if (userRole.getRoleId() == 1) {
                return true;
            }
        }
        return false;
    }

    public boolean isAdmin(long userId) throws ServiceException {

        List<UserRole> userRoles = userDao.getUserRole(userId);
        if (null == userRoles) {
            return false;
        }
        for (UserRole userRole : userRoles) {
            if (userRole.getRoleId() == 0) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<String> getEntities() throws ServiceException {
        String entityLocation = appProperties.entityLocation;
        JSONTokener jsonTokener = new JSONTokener(entityLocation);   
        JSONObject jsonObject = (JSONObject) jsonTokener.nextValue();
        List<String> list = new ArrayList<String>();
        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            list.add(iterator.next());
        }
        
        return list;
    }

    @Override
    public List<String> getLocations(String entity) throws ServiceException {
        String entityLocation = appProperties.entityLocation;
        JSONTokener jsonTokener = new JSONTokener(entityLocation);   
        JSONObject jsonObject = (JSONObject) jsonTokener.nextValue();
        JSONArray locations = jsonObject.getJSONArray(entity);
        List<String> list = new ArrayList<String>();
        for(int i = 0; i < locations.length(); i++ )
        {
            list.add(locations.getString(i));
        }
        
        return list;
    }

    private List<String> computeNav(long userId) throws ServiceException {
        List<String> navList = new ArrayList<String>();
        if (isAdmin(userId)) {
            for (String nav : allNav) {
                navList.add(nav);
            }
            return navList;
        } else if (isPa(userId)) {
            List<Project> relatedProjects = projectDao.getOpenedAndRollbackByUserId(userId);
            navList.add(NAV_PENDING_CASE);
            navList.add(NAV_NEW_PROJECT);
            if (0 < relatedProjects.size())
            {
                navList.add(NAV_NEW_ISSUE);
            }
            navList.add(NAV_INTEGRATE_QUERY);
            return navList;
        } else {
            List<Project> relatedProjects = projectDao.getOpenedAndRollbackByUserId(userId);
            navList.add(NAV_PENDING_CASE);
            if (0 < relatedProjects.size())
            {
                navList.add(NAV_NEW_ISSUE);
            }
            navList.add(NAV_INTEGRATE_QUERY);
            return navList;
        }
    }
    
    @Override
    public void updatePassword(String oldPassword, String newPassword)
            throws ServiceException 
    {
        User currentUser = getUser();

        if (!StringUtils.equals(currentUser.getPassword(), EncryptionUtils.encrypt(oldPassword)))
        {
            throw new ServiceException("OldPasswordIsWrong",
                    "Old password is wrong!");
        }
        
        if(!DataFormatValidator.isValidPassword(newPassword))
        {
            throw new ServiceException("PasswordFormatIsWrong", 
                    "Password format is wrong");
        }
        
        String pwd = EncryptionUtils.encrypt(newPassword);
        userDao.updatePassword(currentUser.getId(), pwd);
        
    }
}
