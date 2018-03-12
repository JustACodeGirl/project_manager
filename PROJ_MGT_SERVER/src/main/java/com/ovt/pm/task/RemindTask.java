/**
 * RemindTask.java
 * 
 * Copyright@2017 OVT Inc. All rights reserved. 
 * 
 * 2017年7月12日
 */
package com.ovt.pm.task;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

import com.ovt.common.log.Logger;
import com.ovt.common.log.LoggerFactory;
import com.ovt.common.utils.DateTimeUtils;
import com.ovt.pm.config.AppProperties;
import com.ovt.pm.dao.ProjectDao;
import com.ovt.pm.dao.vo.Project;
import com.ovt.pm.service.MailService;

/**
 * RemindTask
 * 
 * @Author hyson.yu
 * @Version 1.0
 * @See
 * @Since [OVT ProjMgt]/[API] 1.0
 */
public class RemindTask
{
    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private MailService mailService;

    @Autowired
    private AppProperties appProperties;

    private Logger logger = LoggerFactory.getLogger(RemindTask.class.getName());

    /**
     * 03:30 every day
     */
    @Scheduled(cron = "0 30 3 * * ?")
    public void mailToUsers()
    {
        logger.info("Mail to users task start!");
        int day = appProperties.projectRemindDay;
        String remindDate = DateTimeUtils.formatSqlDate(DateTimeUtils.addDays(
                new Date(), day));
        String subject = "";
        String content = "";
        try
        {
            List<Project> list = projectDao.getRemind(remindDate);
            if (list != null && list.size() > 0)
            {
                for (Project proj : list)
                {
                    List<String> emails = projectDao.getProjectAllUsers(
                            proj.getId(), proj.getPm());
                    subject = "Overdue Reminder::[PM Sync System]->["+proj.getProjName()+"]";
                    boolean isOverDue = !DateTimeUtils.isNotBefore(DateTimeUtils.parseDate(proj.getDeadline(), DateTimeUtils.PATTERN_SQL_DATE),DateTimeUtils.getDateWithoutTime(new Date()));
                    if(isOverDue){
                        content = "The project ["+proj.getProjName()+"] has been overdue. The deadline is: "+proj.getDeadline() +".";
                    }else{
                        content = "The project ["+proj.getProjName()+"] will be overdue. The deadline is: "+proj.getDeadline() +"."; 
                    }
                    mailService.sendEmail(emails, subject, content, null);
                    Thread.sleep(1000*30);//stop 30 seconds
                }
            }

        }
        catch (Exception e)
        {
            logger.error("Mail to users failed", e);
        }

        logger.info("Mail to users task complete!");
    }

}
