package com.ovt.pm.service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ovt.common.exception.DBException;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.DateTimeUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.constant.IssueActionDesc;
import com.ovt.pm.dao.AttachmentDao;
import com.ovt.pm.dao.IssueActDao;
import com.ovt.pm.dao.IssueDao;
import com.ovt.pm.dao.OperationLogDao;
import com.ovt.pm.dao.ProjectDao;
import com.ovt.pm.dao.UserDao;
import com.ovt.pm.dao.vo.Attachment;
import com.ovt.pm.dao.vo.Issue;
import com.ovt.pm.dao.vo.IssueAct;
import com.ovt.pm.dao.vo.OperationLog;
import com.ovt.pm.dao.vo.Project;
import com.ovt.pm.dao.vo.User;
import com.ovt.pm.service.exception.ServiceErrorCode;
import com.ovt.pm.service.exception.ServiceException;

/**
 * IssueServiceImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
@Service
public class IssueServiceImpl implements IssueService {

	@Autowired
	private IssueDao issueDao;

	@Autowired
	private IssueActDao issueActDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private OperationLogDao logDao;

	@Autowired
	private AttachmentDao attachmentDao;

	@Autowired
	private UserService userService;

	@Autowired
	private ProjectDao projectDao;
	
	private final static List<String> PRIORITY = Arrays.asList("Critical", "High", "Medium", "Low");

	@Override
	public Issue getById(long id) throws ServiceException {
		try {
			Issue issue = issueDao.getById(id);
			if (null != issue.getCreator()) {
				User user = userService.getById(issue.getCreator());
				issue.setCreatorCode(user.getUserCode());
			}
			if (null != issue.getOwnerId()) {
				User user = userService.getById(issue.getOwnerId());
				issue.setOwner(user.getUserCode());
			}
			List<String> relatedUser = issueDao.getRelated(id);
			List<String> ccUser = issueDao.getCC(id);
			issue.setRelatedUser(relatedUser);
			issue.setCcUser(ccUser);
			Project project = projectDao.getById(issue.getProjId());
			issue.setProjName(project.getProjName());
			return issue;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public PageResult<IssueAct> getActs(PageInfo pageInfo, long id)
			throws ServiceException {
		pageInfo.setOrderBy("create_time_utc");
		pageInfo.setOrder("desc");
		try {
			PageResult<IssueAct> issueActResults = issueActDao.getAll(pageInfo,
					id);
			if (null == issueActResults.getResults()) {
				return issueActResults;
			}
			for (IssueAct issueAct : issueActResults.getResults()) {
				if (StringUtils.isNotBlank(issueAct.getAttachmentIds())) {
					String[] attachmentIds = issueAct.getAttachmentIds().split(
							",");
					for (String attachmentId : attachmentIds) {
						Attachment attachment = attachmentDao.getById(Long
								.parseLong(attachmentId));
						issueAct.getAttachment().add(attachment);
					}
				}
			}
			return issueActResults;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public void add(Issue issue) throws ServiceException {
		try {
            Issue iss = issueDao.getByName(issue.getIssueName());
            if(null != iss){
                throw new ServiceException(ServiceErrorCode.ISSUE_EXIST, "project exist");
            }
			User owner = userDao.getByCode(issue.getOwner());
			if (null == owner) {
				throw new ServiceException("OWNER_NULL", "owner is null");
			}
			User currentUser = userService.getUser();
			long creator = currentUser.getId();
			issue.setOwnerId(owner.getId());
			issue.setStatus(0);
			issue.setCreator(creator);
			long id = issueDao.add(issue);
			IssueAct issueAct = new IssueAct(issue.getProjId(), id,
					issue.getIssueName(), issue.getType(), currentUser.getId(),
					currentUser.getUserCode(), IssueActionDesc.Create.name(),
					null, issue.getAttachmentIds());
			issueActDao.add(issueAct);
			issueDao.updateHandler(id, creator);
			issueDao.addRelated(issue.getRelatedUser(), id);
			issueDao.addCC(issue.getCcUser(), id);
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public void comment(long id, String comments, String attachmentIds)
			throws ServiceException {
		try {
			Issue issue = new Issue();
			issue.setId(id);
			issueDao.update(issue);
			User currentUser = userService.getUser();
			issue = issueDao.getById(id);
			IssueAct issueAct = new IssueAct(issue.getProjId(), id,
					issue.getIssueName(), issue.getType(), currentUser.getId(),
					currentUser.getUserCode(), IssueActionDesc.Comment.name(),
					comments, attachmentIds);
			issueActDao.add(issueAct);

		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

	@Override
	public void update(Issue issue) throws ServiceException {
		if (StringUtils.isBlank(issue.getId())) {
			throw new ServiceException("ID_IS_NULL", "issue id is null");
		}
		
		Issue oldIssue = issueDao.getById(issue.getId());
		User currentUser = userService.getUser();
		if (!userService.isAdmin(currentUser.getId()) && oldIssue.getStatus() == -1) {// status:Rejected
			issue.setStatus(0);// status:New
			IssueAct issueAct = new IssueAct(issue.getProjId(), issue.getId(),
                    issue.getIssueName(), issue.getType(), currentUser.getId(),
                    currentUser.getUserCode(), IssueActionDesc.Edit.name(),
                    null, null);
            issueActDao.add(issueAct);
		}
		if (StringUtils.isBlank(issue.getUpdateTime())) {
			throw new ServiceException("TIMESTAMP_IS_NULL", "timestamp is null");
		} else {
			if (!issue.getUpdateTime().equals(oldIssue.getUpdateTime())) {
				throw new ServiceException("OUT_OF_DATE", "data is out of date");
			}
		}
		if (null != issue.getOwner()) {
			User owner = userService.getByCode(issue.getOwner());
			issue.setOwnerId(owner.getId());
		}
		
		oldIssue.setProjName(projectDao.getById(oldIssue.getProjId()).getProjName());
		oldIssue.setOwner(userDao.getById(oldIssue.getOwnerId()).getUserCode());
		oldIssue.setCreatorCode(userDao.getById(oldIssue.getCreator()).getUserCode());
		oldIssue.setRelatedUser(issueDao.getRelated(oldIssue.getId()));
		oldIssue.setCcUser(issueDao.getCC(oldIssue.getId()));

		try {
			issueDao.deleteIssueRelated(issue.getId());
			issueDao.deleteIssueCC(issue.getId());
			issueDao.addRelated(issue.getRelatedUser(), issue.getId());
			issueDao.addCC(issue.getCcUser(), issue.getId());
			issueDao.update(issue);
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
		if (userService.isAdmin(currentUser.getId())) {
			Field[] fields = issue.getClass().getDeclaredFields();
			for (Field field : fields) {
				field.setAccessible(true);
				try {
					Object oldValue = (null == field.get(oldIssue)) ? ""
							: field.get(oldIssue);
					Object newValue = (null == field.get(issue)) ? "" : field
							.get(issue);
					if (!oldValue.toString().equals(newValue.toString())) {
						if (field.getName().equals("priority")) {
							if (!StringUtils.isBlank(oldValue)) {
								oldValue = PRIORITY.get(Integer.valueOf(oldValue.toString()) - 1);
							}
							if (!StringUtils.isBlank(newValue)) {
								newValue = PRIORITY.get(Integer.valueOf(newValue.toString()) - 1);
							}
						}
						
						if (field.getName().equals("type")) {
							if (!StringUtils.isBlank(oldValue)) {
								oldValue = (oldIssue.getType() == 1) ? "Issue" : "Request";
							}
							if (!StringUtils.isBlank(newValue)) {
								newValue = (issue.getType() == 1) ? "Issue" : "Request";
							}
						}
						
						OperationLog log = new OperationLog(
						        currentUser.getId(),
						        currentUser.getUserCode(),
								oldIssue.getId(),
								(oldIssue.getType() == 1) ? "Issue" : "Request",
								field.getName(), "" + oldValue, "" + newValue);
						try {
							logDao.add(log);
						} catch (DBException e) {
							throw new ServiceException("DB_EXCEPTION",
									e.getMessage());
						}
					}
				} catch (IllegalAccessException e) {
					throw new ServiceException("LOG_EXCEPTION",
							"get issue field value exception");
				}
			}
		}
	}

	@Override
	public void approve(long id, int result, String comments,
			String attachmentIds, String updateTime) throws ServiceException {
	    Issue oldIssue = issueDao.getById(id);
	    if (StringUtils.isBlank(updateTime)) {
            throw new ServiceException("TIMESTAMP_IS_NULL", "timestamp is null");
        } else {
            if (!updateTime.equals(oldIssue.getUpdateTime())) {
                throw new ServiceException("OUT_OF_DATE", "data is out of date");
            }
        }
		try {
			Issue issue = new Issue();
			issue.setId(id);
			String action = "";
			if (1 == result) {
				issue.setStatus(1);
				action = IssueActionDesc.Approve.name();
			} else {
				issue.setStatus(-1);
				action = IssueActionDesc.Reject.name();
			}
			issue.setApproveTimeUtc(DateTimeUtils.getUTCTimeStr());
			issueDao.update(issue);
			User currentUser = userService.getUser();
			issueDao.updateHandler(id, currentUser.getId());
			issue = issueDao.getById(id);
			IssueAct issueAct = new IssueAct(issue.getProjId(), id,
					issue.getIssueName(), issue.getType(), currentUser.getId(),
					currentUser.getUserCode(), action, comments, attachmentIds);
			issueActDao.add(issueAct);

		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

	@Override
	public void finish(long id, String comments, String attachmentIds, String actualCost,
	        String updateTime) throws ServiceException {
	    Issue oldIssue = issueDao.getById(id);
        if (StringUtils.isBlank(updateTime)) {
            throw new ServiceException("TIMESTAMP_IS_NULL", "timestamp is null");
        } else {
            if (!updateTime.equals(oldIssue.getUpdateTime())) {
                throw new ServiceException("OUT_OF_DATE", "data is out of date");
            }
        }
		try {
			Issue issue = new Issue();
			issue.setId(id);
			issue.setStatus(2);
			issue.setCostActual(Integer.valueOf(actualCost));
			issueDao.update(issue);
			User currentUser = userService.getUser();
			issueDao.updateHandler(id, currentUser.getId());
			issue = issueDao.getById(id);
			IssueAct issueAct = new IssueAct(issue.getProjId(), id,
					issue.getIssueName(), issue.getType(), currentUser.getId(),
					currentUser.getUserCode(), IssueActionDesc.Solve.name(),
					comments, attachmentIds);
			issueActDao.add(issueAct);

		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

	@Override
	public void updateProgress(long id, int progress) throws ServiceException {
		try {
		    Issue oldIssue = issueDao.getById(id);
			Issue issue = new Issue();
			issue.setId(id);
			issue.setProgress(progress);
			issueDao.update(issue);
			
            User currentUser = userService.getUser();
            IssueAct issueAct = new IssueAct(oldIssue.getProjId(), id,
                    oldIssue.getIssueName(), oldIssue.getType(), currentUser.getId(),
                    currentUser.getUserCode(), IssueActionDesc.Progress.name(),
                    oldIssue.getProgress() + "% -> " + progress + "% ", null);
            issueActDao.add(issueAct);
		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

	@Override
	public void close(long id, int result, String comments, String attachmentIds, 
	        String updateTime) throws ServiceException {
	    Issue oldIssue = issueDao.getById(id);
        if (StringUtils.isBlank(updateTime)) {
            throw new ServiceException("TIMESTAMP_IS_NULL", "timestamp is null");
        } else {
            if (!updateTime.equals(oldIssue.getUpdateTime())) {
                throw new ServiceException("OUT_OF_DATE", "data is out of date");
            }
        }
		try {
			Issue issue = new Issue();
			issue.setId(id);
			String action = "";
			if (1 == result) {
				issue.setStatus(3);
				action = IssueActionDesc.Close.name();
			} else {
				issue.setStatus(-2);
				action = IssueActionDesc.Rollback.name();
			}
			issueDao.update(issue);
			User currentUser = userService.getUser();
			issueDao.updateHandler(id, currentUser.getId());
			issue = issueDao.getById(id);
			IssueAct issueAct = new IssueAct(issue.getProjId(), id,
					issue.getIssueName(), issue.getType(), currentUser.getId(),
					currentUser.getUserCode(), action, comments, attachmentIds);
			issueActDao.add(issueAct);
		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

}
