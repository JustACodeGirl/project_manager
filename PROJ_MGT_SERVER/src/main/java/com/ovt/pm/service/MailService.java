/**
 * MailService.java
 * 
 * Copyright@2017 OVT Inc. All rights reserved. 
 * 
 * 2017年6月29日
 */
package com.ovt.pm.service;

import java.io.File;
import java.util.List;
import java.util.Vector;

import com.ovt.pm.service.exception.ServiceException;

/**
 * MailService
 * 
 * @Author hyson.yu
 * @Version 1.0
 * @See 
 * @Since [OVT ProjMgt]/[API] 1.0
 */
public interface MailService
{
    /**
     * 
     * @param toAddress 接收方地址（可多人）
     * @param subject 邮件主题
     * @param content 邮件内容，可为html格式，例如："测试<a href=\"www.baidu.com\" target='_blank'>百度</a>"
     * @param files 附件，可为空（文件名中不允许有中文）
     * @return
     * @throws ServiceException
     */
    boolean sendEmail(List<String> toAddress, String subject,
            String content, Vector<File> files) throws ServiceException;
}
