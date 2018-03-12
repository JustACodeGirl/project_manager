package com.ovt.pm.dao;

import com.ovt.pm.dao.vo.Token;

/**
 * AccessTokenDao
 * 
 * @Author zhi.liu
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface AccessTokenDao
{

    /**
     * Get user by access token.
     * 
     * @param accessToken
     * @return
     */
    long getUserByToken(String accessToken);

    /**
     * create new accessToken.
     * 
     * @param accessToken
     * @return
     */
    void save(Token accessToken);

    /**
     * delete accessToken.
     * 
     * @param accessToken
     */
    void delete(String accessToken);

    /**
     * @param userId
     */
    void deleteTokensByUser(long userId);
    
    /**
     * 
     */
    public void deleteExpiredUserToken();
}
