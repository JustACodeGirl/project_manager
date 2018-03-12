/**
 * Password.java
 * 
 * Copyright@2017 OVT Inc. All rights reserved. 
 * 
 * 2017年7月5日
 */
package com.ovt.pm.dao.vo;

/**
 * Password
 * 
 * @Author hyson.yu
 * @Version 1.0
 * @See
 * @Since [OVT ProjMgt]/[API] 1.0
 */
public class Password
{
    private String oldPassword;

    private String newPassword;

    public String getOldPassword()
    {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword)
    {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword()
    {
        return newPassword;
    }

    public void setNewPassword(String newPassword)
    {
        this.newPassword = newPassword;
    }
}
