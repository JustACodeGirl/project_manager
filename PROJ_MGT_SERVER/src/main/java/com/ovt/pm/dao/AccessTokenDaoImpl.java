package com.ovt.pm.dao;

import java.text.MessageFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ovt.common.dao.DaoHelper;
import com.ovt.common.utils.DataConvertUtils;
import com.ovt.pm.dao.vo.Token;

/**
 * AccessTokenDaoImpl
 * 
 * @Author zhi.liu
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class AccessTokenDaoImpl implements AccessTokenDao
{
    @Autowired
    private DaoHelper daoHelper;

    private static final String SQL_GET_USER = "SELECT user_id FROM t_token "
            + "WHERE token = ? LIMIT 1";

    private static final String SQL_DELETE_TOKEN_BY_USER = "delete from t_token "
            + "WHERE user_id = ?";

    private static final String SQL_DELETE_EXPIRED_USER_TOKEN = "DELETE FROM t_token "
            + "WHERE expire_time < CURRENT_TIMESTAMP";

    private static final String SQL_INSERT_TOKEN = "INSERT IGNORE INTO "
            + "t_token(user_id, token, expire_time) " + "VALUES (?, ?, ?)";

    private static final String SQL_DELETE_TOKEN = "delete from t_token "
            + "WHERE token = ?";

    @Override
    public long getUserByToken(final String accessToken)
    {
        String errMsg = MessageFormat.format(
                "Failed to get user by access token [{0}]", accessToken);
        long userId = DataConvertUtils.toLong(daoHelper.queryForObject(
                SQL_GET_USER, Long.class, errMsg, accessToken));

        return userId;
    }

    @Override
    public void save(final Token accessToken)
    {
        String errMsg = MessageFormat.format(
                "Failed to insert access token [{0}]!", accessToken.getToken());

        daoHelper.save(SQL_INSERT_TOKEN, errMsg, false,
                accessToken.getUserId(), accessToken.getToken(),
                accessToken.getExpireTime());

    }

    @Override
    public void delete(final String accessToken)
    {
        String errMsg = MessageFormat.format(
                "Failed to delete access token [{0}]", accessToken);

        daoHelper.update(SQL_DELETE_TOKEN, errMsg, accessToken);

    }

    @Override
    public void deleteTokensByUser(long userId)
    {
        String errMsg = MessageFormat.format(
                "Failed to delete access token of user {0}", userId);
        daoHelper.update(SQL_DELETE_TOKEN_BY_USER, errMsg, userId);
    }

    @Override
    public void deleteExpiredUserToken()
    {
        String errMsg = MessageFormat.format(
                "Failed to delete expired access token!", (Object[]) null);

        daoHelper.update(SQL_DELETE_EXPIRED_USER_TOKEN, errMsg);
    }
}
