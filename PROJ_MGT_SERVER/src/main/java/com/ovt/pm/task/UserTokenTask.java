package com.ovt.pm.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

import com.ovt.common.exception.DBException;
import com.ovt.common.log.Logger;
import com.ovt.common.log.LoggerFactory;
import com.ovt.pm.dao.AccessTokenDao;

/**
 * UserTokenTask
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[TASK] 1.0
 */
public class UserTokenTask
{
    @Autowired
    private AccessTokenDao userAccessTokenDao;

    private Logger logger = LoggerFactory.getLogger(UserTokenTask.class
            .getName());

    /**
     * 06:30 every day
     */
    @Scheduled(cron = "0 30 6 * * ?")
    public void cleanExpireUserToken()
    {
        logger.info("Check expire user token task start!");

        try
        {
            userAccessTokenDao.deleteExpiredUserToken();
        }
        catch (DBException e)
        {
            logger.error("Clean expired user token failed", e);
        }

        logger.info("Check expire user token task complete!");
    }
}
