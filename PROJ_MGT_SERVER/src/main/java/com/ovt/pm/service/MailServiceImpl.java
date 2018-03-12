/**
 * MailServiceImpl.java
 * 
 * Copyright@2017 OVT Inc. All rights reserved. 
 * 
 * 2017年6月29日
 */
package com.ovt.pm.service;

import java.io.File;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.Properties;
import java.util.Vector;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.annotation.PostConstruct;
import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.Message.RecipientType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ovt.common.utils.CollectionUtils;
import com.ovt.pm.config.AppProperties;
import com.ovt.pm.service.exception.ServiceException;

/**
 * MailServiceImpl
 * 
 * @Author hyson.yu
 * @Version 1.0
 * @See
 * @Since [OVT ProjMgt]/[API] 1.0
 */
@Service
public class MailServiceImpl implements MailService
{
    private static String USERNAME = "";// 用户名
    private static String PASSWORD = "";// 密码
    private static String PROTOCOL = "";// 邮件传输协议
    private static String HOST = "";// SMTP服务器主机地址

    @Autowired
    private AppProperties appProperties;

    @PostConstruct
    private void init()
    {
        USERNAME = appProperties.emailUserName;
        PASSWORD = appProperties.emailPassword;
        PROTOCOL = appProperties.emailProtocol;
        HOST = appProperties.emailHost;
    }

    /**
     * 客户端程序自己实现Authenticator子类用于用户认证
     */
    static class MyAuthenricator extends Authenticator
    {
        String user = null;
        String pass = "";

        public MyAuthenricator(String user, String pass)
        {
            this.user = user;
            this.pass = pass;
        }

        @Override
        protected PasswordAuthentication getPasswordAuthentication()
        {
            return new PasswordAuthentication(user, pass);
        }

    }

    private static Session getSession()
    {
        Properties mailProps = new Properties();
        mailProps.put("mail.smtp.auth", "true");// 向SMTP服务器提交用户认证
        mailProps.put("mail.transport.protocol", PROTOCOL);// 指定发送邮件协议
        mailProps.put("mail.host", HOST);// SMTP服务器主机地址

        // 拿session的时候传入Authenticator子类进行验证
        Session session = Session.getDefaultInstance(mailProps,
                new MyAuthenricator(USERNAME, PASSWORD));
        session.setDebug(true);
        return session;
    }

    @Override
    public boolean sendEmail(List<String> toAddress, String subject,
            String content, Vector<File> files) throws ServiceException
    {
        if(CollectionUtils.isEmpty(toAddress)){
            return false;
        }
        Session session = getSession();
        try
        {
            MimeMessage message = new MimeMessage(session);
            int len = toAddress.size();
            Address to[] = new InternetAddress[len];
            for (int i = 0; i < len; i++)
            {
                to[i] = new InternetAddress(toAddress.get(i));
            }

            message.setFrom(new InternetAddress(appProperties.emailFrom));
            message.setRecipients(RecipientType.TO, to);
            message.setSubject(subject);
            message.setSentDate(new Date());// 发送时间

            // MiniMultipart类是一个容器类，包含MimeBodyPart类型的对象
            Multipart mmp = new MimeMultipart();

            BodyPart html = new MimeBodyPart();
            // 设置HTML内容
            html.setContent(content, "text/html; charset=utf-8");
            mmp.addBodyPart(html);

            //附件
            if(files != null && files.size() > 0){
                Enumeration<File> efile = files.elements();
                while (efile.hasMoreElements())
                {
                    MimeBodyPart mdpFile = new MimeBodyPart();
                    String fileName = efile.nextElement().toString();
                    FileDataSource fds = new FileDataSource(fileName);
                    mdpFile.setDataHandler(new DataHandler(fds));
                    // 这个方法可以解决附件名乱码问题
                    String fileNameChinese = new String(fds.getName().getBytes(),
                            "ISO-8859-1");
                    mdpFile.setFileName(fileNameChinese);
                    mmp.addBodyPart(mdpFile);
                }
                files.removeAllElements();
            }

            message.setContent(mmp);
            message.saveChanges();

            // 从session中取mail.smtp.protocol指定协议的Transport
            Transport transport = getSession().getTransport();
            // 建立与指定的SMTP服务器的连接
            transport.connect();// 此时不需要任务参数
            // 发给所有指定的收件人,若使用message.getAllRecipients()则还包括抄送和暗送的人
            transport.sendMessage(message,
                    message.getRecipients(RecipientType.TO));
            // 关闭连接
            transport.close();

            return true;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return false;
    }

}
