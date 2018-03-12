package com.ovt.pm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.CollectionUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.constant.MenuOperation;
import com.ovt.pm.constant.PendingInstruction;
import com.ovt.pm.dao.ProjectDao;
import com.ovt.pm.dao.TaskDao;
import com.ovt.pm.dao.UserDao;
import com.ovt.pm.dao.vo.Project;
import com.ovt.pm.dao.vo.Task;
import com.ovt.pm.service.exception.ServiceException;

/**
 * TaskServiceImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private TaskDao taskDao;

    @Autowired
    private UserService userService;

    @Override
    public PageResult<Task> getToDo(PageInfo pageInfo, String condition) throws ServiceException {
        PageResult<Task> taskResult = null;
        long userId = userService.getUser().getId();
        boolean isPa = userService.isPa(userId);
        List<Long> relatedProjectIds = projectDao.getUserRelated(userId);
        String relatedProjectIdsStr = CollectionUtils
                .toString(relatedProjectIds);
        StringBuilder sql = new StringBuilder();
        // project admin is able to see all users' projects
        if (userService.isPa(userId)) {
            sql.append(" (task_type = 'Project' ");
            sql.append(" and ");
            sql.append(" status <> 'Closed' ");
            
            sql.append(")");

            sql.append(" or ");
            
            sql.append("(task_type <> 'Project' and (");
            sql.append("( (status = 'New' or status = 'Solved') and proj_id in (select id from project where pm like '%,"+ userId + ",%') )");//pm
            sql.append(" or (status in ('Approved','Rollback') and owner = "+ userId + ") ");//issue owner
            if (StringUtils.isNotBlank(relatedProjectIdsStr)) {
                sql.append(" or (status ='Rejected' and proj_id in ("+ relatedProjectIdsStr + ") and creator = "+userId+")");//pr
            }
            sql.append("))");
            
            if (StringUtils.isNotBlank(condition)) {
                sql.append(" and ");
                sql.append("( cast(task_id as char) like '%" + condition + "%'");
                sql.append(" or ");
                sql.append(" task_name like '%" + condition + "%' )");
            }
            taskResult = taskDao.getByWhere(pageInfo, sql.toString());
        } else {
            sql.append("((task_type = 'Project' and (");
            sql.append("(status in ('Opened','New','Rollback') and pm like '%,"+ userId + ",%')");//pm
            if (StringUtils.isNotBlank(relatedProjectIdsStr)) {
                sql.append(" or (status in ('Opened','Rollback') and proj_id in ("+ relatedProjectIdsStr + "))");//pr
            }
            sql.append("))");

            sql.append(" or ");

            sql.append("(task_type <> 'Project' and (");
            sql.append("( (status = 'New' or status = 'Solved') and proj_id in (select id from project where pm like '%,"+ userId + ",%') )");//pm
            sql.append(" or (status in ('Approved','Rollback') and owner = "+ userId + ") ");//issue owner
            if (StringUtils.isNotBlank(relatedProjectIdsStr)) {
                sql.append(" or (status ='Rejected' and proj_id in ("+ relatedProjectIdsStr + ") and creator = "+userId+")");//pr
            }
            sql.append(")))");
            
            if (StringUtils.isNotBlank(condition)) {
                sql.append(" and ");
                sql.append("( cast(task_id as char) like '%" + condition + "%'");
                sql.append(" or ");
                sql.append(" task_name like '%" + condition + "%' )");
            }

            taskResult = taskDao.getByWhere(pageInfo, sql.toString());
        }
        computeMenu(isPa, userId, taskResult, relatedProjectIdsStr);
        return taskResult;

    }

    @Override
    public PageResult<Task> getRelated(PageInfo pageInfo, String condition)
            throws ServiceException {
        long userId = userService.getUser().getId();
        StringBuilder sql = new StringBuilder();
        sql.append("(task_type <> 'Project' and task_id in (select issue_id "
                + "from issue_related where user_id = "
                + userId + "))");
        if (StringUtils.isNotBlank(condition)) {
            sql.append(" and ");
            sql.append("( cast(task_id as char) like '%" + condition + "%'");
            sql.append(" or ");
            sql.append(" task_name like '%" + condition + "%' )");
        }
        PageResult<Task> taskResult = taskDao.getByWhere(pageInfo, sql.toString());
        if (taskResult.getResults() != null) {
            for (Task task : taskResult.getResults()) {
                task.setInstruction(PendingInstruction.PENDING_COMMENT);
                task.setMenu(MenuOperation.MENU_COMMENT);
            }
        }
        return taskResult;
    }

    @Override
    public PageResult<Task> getCC(PageInfo pageInfo, String condition) throws ServiceException {
        long userId = userService.getUser().getId();
        // default cc is able to see all cc task
        PageResult<Task> taskResult = null;
        StringBuilder sql = new StringBuilder();
        if (userService.isDefaultCC(userId)) {
            if (StringUtils.isNotBlank(condition)) {
                sql.append("( cast(task_id as char) like '%" + condition + "%'");
                sql.append(" or ");
                sql.append(" task_name like '%" + condition + "%' )");
            }
            taskResult = taskDao.getByWhere(pageInfo, sql.toString());
        }else{
                sql.append("((task_type <> 'Project' and task_id in (select issue_id "
                        + "from issue_cc where user_id = " + userId
                        + ")) or (task_type = 'Project' and task_id "
                        + "in (select proj_id from project_cc where user_id = "
                        + userId + ")))");
            if (StringUtils.isNotBlank(condition)) {
                sql.append(" and ");
                sql.append("( cast(task_id as char) like '%" + condition + "%'");
                sql.append(" or ");
                sql.append(" task_name like '%" + condition + "%' )");
            }
            taskResult = taskDao.getByWhere(pageInfo, sql.toString());
        }
        if (taskResult.getResults() != null) {
            for (Task task : taskResult.getResults()) {
                task.setInstruction(PendingInstruction.PENDING_COMMENT);
                task.setMenu(MenuOperation.MENU_COMMENT);
            }
        }
        return taskResult;
    }

    @Override
    public PageResult<Task> query(PageInfo pageInfo, Long taskId,
            String taskType, String taskName, String status, String deadline)
            throws ServiceException {
        String sql = "1 = 1";
        if (StringUtils.isNotBlank(taskId)) {
            sql += " and task_id = " + taskId;
        }
        if (StringUtils.isNotBlank(taskType)) {
            sql += " and task_type = '" + taskType + "'";
        }
        if (StringUtils.isNotBlank(taskName)) {
            sql += " and task_name like '%" + taskName + "%'";
        }
        if (StringUtils.isNotBlank(status)) {
            sql += " and status = '" + status + "'";
        }
        if (StringUtils.isNotBlank(deadline)) {
            sql += " and deadline <= '" + deadline + "'";
        }
        long userId = userService.getUser().getId();
        if (!userService.isAdmin(userId) && !userService.isPa(userId) && StringUtils.isNotBlank(userId)) {
            sql += " and ((handler like '%,"
                    + userId
                    + ",%') or (task_id in (select proj_id from project_cc where user_id = "
                    + userId
                    + ")) or (task_id in (select proj_id from project_related where user_id = "
                    + userId
                    + ")) or (pm like '%,"
                    + userId
                    + ",%') or (task_id in (select issue_id from issue_cc where user_id = "
                    + userId
                    + ")) or (task_id in (select issue_id from issue_related where user_id = "
                    + userId + ")))";
        }

        PageResult<Task> taskResults = taskDao.getByWhere(pageInfo, sql);
        return taskResults;
    }

    private void computeMenu(boolean isPa, long userId,
            PageResult<Task> taskResult, String relatedProjectIdsStr) {
        if (taskResult.getResults() != null) {
            for (Task task : taskResult.getResults()) {
                StringBuilder menus = new StringBuilder();
                if ("Project".equals(task.getTaskType())) {
                    boolean isPm = task.getPm().indexOf("," + userId + ",") > -1;
                    switch (task.getStatus()) {
                    case "New":
                        task.setInstruction(PendingInstruction.PENDING_OPEN);
                        if (isPm) {
                            menus.append(MenuOperation.MENU_OPEN + ",");
                        }
                        if (isPa) {
                            menus.append(MenuOperation.MENU_CLOSE + ",");
                        }
                        break;
                    case "Opened":
                    case "Rollback":
                        boolean isPr = StringUtils
                                .isNotBlank(relatedProjectIdsStr) ? (","
                                + relatedProjectIdsStr + ",").indexOf(","
                                + task.getProjId() + ",") > -1 : false;
                        task.setInstruction(PendingInstruction.PENDING_FINISH);
                        if (isPr) {
                            task.setInstruction(PendingInstruction.PENDING_ASSIGN);
                            menus.append(MenuOperation.MENU_NEW_ISSUE + ",");
                        }
                        if (isPm) {
                            menus.append(MenuOperation.MENU_FINISH + ",");
                        }
                        if (isPa) {
                            menus.append(MenuOperation.MENU_CLOSE + ",");
                        }
                        break;
                    case "Finished":
                        task.setInstruction(PendingInstruction.PENDING_CLOSE);
                        if (isPa) {
                            menus.append(MenuOperation.MENU_CLOSE + ",");
                        }
                        break;
                    }
                } else {
                    Project project = projectDao.getById(task.getProjId());
                    boolean isPm = project.getPm().indexOf("," + userId + ",") > -1;
                    switch (task.getStatus())
                    {
                    case "New":
                        task.setInstruction(PendingInstruction.PENDING_AUDIT);
//                        if (isPa)
//                        {
//                            menus.append(MenuOperation.MENU_CLOSE + ",");
//                        }
                        if (isPm)
                        {
                            menus.insert(0, MenuOperation.MENU_AUDIT + ",");
                        }
                        break;
                    case "Approved":
                    case "Rollback":
                        task.setInstruction(PendingInstruction.PENDING_SOLVE);
                        // is issue owner
                        boolean io = StringUtils.isNotBlank(task.getOwner())
                                && String.valueOf(userId).equals(
                                        task.getOwner());
                        if (io)
                        {
                            menus.append(MenuOperation.MENU_SOLVE + ",");
                        }
//                        if (isPm)
//                        {
//                            menus.append(MenuOperation.MENU_CLOSE + ",");
//                        }
                        break;
                    case "Solved":
                        task.setInstruction(PendingInstruction.PENDING_CLOSE);
                        if (isPm)
                        {
                            menus.append(MenuOperation.MENU_CLOSE + ",");
                        }
                        break;
                    case "Rejected":
                        task.setInstruction(PendingInstruction.PENDING_EDIT);
//                        if (isPa) {
//                            menus.append(MenuOperation.MENU_CLOSE + ",");
//                        }
                        menus.insert(0, MenuOperation.MENU_EDIT + ",");
                        break;
                    }
                }
                
                task.setMenu(StringUtils.isNotBlank(menus.toString()) ? menus.toString().substring(0, menus.toString().length()-1) : "");
            }
        }

    }
}
