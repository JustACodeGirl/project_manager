package com.ovt.pm.service.exception;

/**
 * ServiceErrorCode
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
public class ServiceErrorCode
{
    // 用戶沒有登陸
    public static final String NOT_LOGIN = "NotLogin";
    // 系统内部错误,请联系管理员
    public static final String SYSTEM_UNEXPECTED = "SystemUnexpected";
    // 用户名不合法
    public static final String INVALID_USER_NAME = "InvalidUserName";
    // Token不合法
    public static final String INVALID_ACCESS_TOKEN = "InvalidAccessToken";
    // 用户不存在
    public static final String USER_NOT_EXIST = "UserNotExist";
    // 用户密码错误
    public static final String WRONG_PASSWORD = "WrongPassword";
    // 用户密码不合法
    public static final String INVALID_PASSWORD = "InvalidPassword";
    // 用户角色不合法
    public static final String INVALID_USER_ROLE = "InvalidUserRole";
    // mail重复
    public static final String MAIL_DUPLICATED = "MailDuplicated";
    // 用户重复
    public static final String USER_DUPLICATED = "UserDuplicated";
    //项目存在
    public static final String PROJECT_EXIST = "ProjectExist";
    //项目未完成
    public static final String PROJECT_NOT_FINISHED = "ProjectNotFinished";
    //ISSUE/REQUEST存在
    public static final String ISSUE_EXIST = "IssueExist";
}
