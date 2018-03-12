package com.ovt.pm.dao.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.ovt.common.annotation.Column;
import com.ovt.common.annotation.Table;
import com.ovt.common.dao.BaseEntity;

/**
 * AccessToken
 * 
 * @Author zhi.liu
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
@Table("t_token")
public class Token extends BaseEntity implements Serializable
{
    private static final long serialVersionUID = -713188152842198586L;

    @Column("user_id")
    private long userId;

    @Column("token")
    private String token;

    @Column("expire_time")
    private Timestamp expireTime;

    public long getUserId()
    {
        return userId;
    }

    public void setUserId(long userId)
    {
        this.userId = userId;
    }

    public String getToken()
    {
        return token;
    }

    public void setToken(String token)
    {
        this.token = token;
    }

    public Timestamp getExpireTime()
    {
        return expireTime;
    }

    public void setExpireTime(Timestamp expireTime)
    {
        this.expireTime = expireTime;
    }
}
