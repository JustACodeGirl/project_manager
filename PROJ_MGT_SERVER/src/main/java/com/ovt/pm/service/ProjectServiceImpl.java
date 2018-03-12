package com.ovt.pm.service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ovt.common.exception.DBException;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.constant.ProjectActionDesc;
import com.ovt.pm.dao.AttachmentDao;
import com.ovt.pm.dao.IssueDao;
import com.ovt.pm.dao.OperationLogDao;
import com.ovt.pm.dao.ProjectActDao;
import com.ovt.pm.dao.ProjectDao;
import com.ovt.pm.dao.UserDao;
import com.ovt.pm.dao.vo.Attachment;
import com.ovt.pm.dao.vo.Issue;
import com.ovt.pm.dao.vo.IssueAct;
import com.ovt.pm.dao.vo.OperationLog;
import com.ovt.pm.dao.vo.Project;
import com.ovt.pm.dao.vo.ProjectAct;
import com.ovt.pm.dao.vo.User;
import com.ovt.pm.service.exception.ServiceErrorCode;
import com.ovt.pm.service.exception.ServiceException;

/**
 * ProjectServiceImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
@Service
public class ProjectServiceImpl implements ProjectService {

	@Autowired
	private ProjectDao projectDao;

	@Autowired
	private ProjectActDao projectActDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private OperationLogDao logDao;

	@Autowired
	private AttachmentDao attachmentDao;

	@Autowired
	private UserService userService;

	@Autowired
	private IssueDao issueDao;
	
	private final static List<String> PRIORITY = Arrays.asList("Critical", "High", "Medium", "Low"); 

	@Override
	public Project getById(Long id) throws ServiceException {
		try {
			Project project = projectDao.getById(id);
			String pmCodes = "";
			for (String pmId : project.getPm().split(",")) {
				if (!StringUtils.isBlank(pmId)) {
					User user = userService.getById(Long.parseLong(pmId));
					pmCodes += (user.getUserCode() + ",");
				}
			}
			if (!"".equals(pmCodes)) {
				project.setPm(pmCodes.substring(0, pmCodes.length() - 1));
			}
			if (null != project.getCreator()) {
				User user = userService.getById(project.getCreator());
				project.setCreatorCode(user.getUserCode());
			}
			List<String> relatedUser = projectDao.getProjectRelated(id);
			List<String> ccUser = projectDao.getProjectCC(id);
			project.setRelatedUser(relatedUser);
			project.setCcUser(ccUser);
			return project;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public PageResult<IssueAct> getActs(PageInfo pageInfo, Long id)
			throws ServiceException {
		pageInfo.setOrderBy("create_time_utc");
		pageInfo.setOrder("desc");
		try {
			PageResult<IssueAct> projectActResults = projectActDao.getAll(
					pageInfo, id);
			for (IssueAct allAct : projectActResults.getResults()) {
				allAct.setType(allAct.getType() == null ? 0 : allAct.getType());
				if (!StringUtils.isBlank(allAct.getAttachmentIds())) {
					String[] attachmentIds = allAct.getAttachmentIds().split(
							",");
					for (String attachmentId : attachmentIds) {
						Attachment attachment = attachmentDao.getById(Long
								.parseLong(attachmentId));
						allAct.getAttachment().add(attachment);
					}
				}
			}
			return projectActResults;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public void add(Project project) throws ServiceException {
		try {
		    Project proj = projectDao.getByName(project.getProjName());
		    if(null != proj){
		        throw new ServiceException(ServiceErrorCode.PROJECT_EXIST, "project exist");
		    }
			User currentUser = userService.getUser();
			project.setCreator(currentUser.getId());
			project.setStatus(0);
			String pmIds = ",";
			for (String pmCode : project.getPm().split(",")) {
				User user = userService.getByCode(pmCode);
				Long pmId = user.getId();
				pmIds += (pmId + ",");
			}
			project.setPm(pmIds);
			long id = projectDao.add(project);
			if (null != project.getRelatedUser()
					&& 0 < project.getRelatedUser().size()) {
				projectDao.addRelated(project.getRelatedUser(), id);
			}
			if (null != project.getCcUser() && 0 < project.getCcUser().size()) {
				projectDao.addCC(project.getCcUser(), id);
			}
			ProjectAct projectAct = new ProjectAct(id, currentUser.getId(),
					currentUser.getUserCode(), ProjectActionDesc.Create.name(),
					null, null);
			projectActDao.add(projectAct);
			projectDao.updateHandler(id, currentUser.getId());
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public void comment(Long id, String comments, String attachmentIds)
			throws ServiceException {
		try {
			Project project = new Project();
			project.setId(id);
			projectDao.update(project);
			User currentUser = userService.getUser();
			ProjectAct projectAct = new ProjectAct(id, currentUser.getId(),
					currentUser.getUserCode(),
					ProjectActionDesc.Comment.name(), comments, attachmentIds);
			projectActDao.add(projectAct);
		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

	@Override
	public void update(Project project) throws ServiceException {
		if (StringUtils.isBlank(project.getId())) {
			throw new ServiceException("ID_IS_NULL", "project id is null");
		}
		
		Project oldproject = projectDao.getById(project.getId());
		if (null != oldproject.getCreator()) {
			oldproject.setCreatorCode(userDao.getById(oldproject.getCreator()).getUserCode());
		}
		oldproject.setCcUser(projectDao.getProjectCC(project.getId()));
		oldproject.setRelatedUser(projectDao.getProjectRelated(project.getId()));

		if (StringUtils.isBlank(project.getCreateTime())) {
			throw new ServiceException("TIMESTAMP_IS_NULL", "timestamp is null");
		} else {
			if (!project.getUpdateTime().equals(oldproject.getUpdateTime())) {
				throw new ServiceException("OUT_OF_DATE", "data is out of date");
			}
		}
		if (StringUtils.isBlank(project.getId())) {
			throw new ServiceException("ID_IS_NULL", "project id is null");
		}
		if (null != project.getPm()) {
			String pmIds = "";
			for (String pmCode : project.getPm().split(",")) {
				if (!StringUtils.isBlank(pmCode)) {
					User user = userService.getByCode(pmCode);
					if (user != null) {
						pmIds += ("," + user.getId());
					}
				}
			}
			if (!"".equals(pmIds)) {
				project.setPm(pmIds + ",");
			}
		}
		try {
			projectDao.deleteProjectRelated(project.getId());
			projectDao.deleteProjectCC(project.getId());
			projectDao.addRelated(project.getRelatedUser(), project.getId());
	       	        projectDao.addCC(project.getCcUser(), project.getId());
			projectDao.update(project);
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
		User user = userService.getUser();

		if (userService.isAdmin(user.getId())) {
			Field[] fields = project.getClass().getDeclaredFields();
			for (Field field : fields) {
				field.setAccessible(true);
				try {
					Object oldValue = (null == field.get(oldproject)) ? ""
							: field.get(oldproject);
					Object newValue = (null == field.get(project)) ? "" : field
							.get(project);
					if (!oldValue.equals(newValue)) {
						if (field.getName().equals("priority")) {
							if (!StringUtils.isBlank(oldValue)) {
								oldValue = PRIORITY.get(Integer.valueOf(oldValue.toString()) - 1);
							}
							if (!StringUtils.isBlank(newValue)) {
								newValue = PRIORITY.get(Integer.valueOf(newValue.toString()) - 1);
							}
						}
						
						if (field.getName().equals("pm")) {
							if (null != oldproject.getPm()) {
								String pmCodes = "";
								for (String pmId : oldproject.getPm().split(",")) {
									if (!StringUtils.isBlank(pmId)) {
										User userTemp = userService.getById(Long.parseLong(pmId));
										if (userTemp != null) {
											pmCodes += (userTemp.getUserCode() + ",");
										}
									}
								}
								if (!"".equals(pmCodes)) {
									oldValue = pmCodes.substring(0, pmCodes.length() - 1);
								}
							}
							
							if (null != project.getPm()) {
								String pmCodes = "";
								for (String pmId : project.getPm().split(",")) {
									if (!StringUtils.isBlank(pmId)) {
										User userTemp = userService.getById(Long.parseLong(pmId));
										if (userTemp != null) {
											pmCodes += (userTemp.getUserCode() + ",");
										}
									}
								}
								if (!"".equals(pmCodes)) {
									newValue = pmCodes.substring(0, pmCodes.length() - 1);
								}
							}
						}

						OperationLog log = new OperationLog(user.getId(),
								user.getUserCode(), project.getId(), "Project",
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
							"get project field value exception");
				}
			}
		}
	}

	@Override
	public void open(Project project) throws ServiceException {
        if (StringUtils.isBlank(project.getId())) {
            throw new ServiceException("ID_IS_NULL", "project id is null");
        }
	    Project oldproject = projectDao.getById(project.getId());
		if (StringUtils.isBlank(project.getUpdateTime())) {
            throw new ServiceException("TIMESTAMP_IS_NULL", "timestamp is null");
        } else {
            if (!project.getUpdateTime().equals(oldproject.getUpdateTime())) {
                throw new ServiceException("OUT_OF_DATE", "data is out of date");
            }
        }
		try {
			project.setStatus(1);
			projectDao.update(project);
			User currentUser = userService.getUser();
			projectDao.updateHandler(project.getId(), currentUser.getId());
			projectDao.addRelated(project.getRelatedUser(), project.getId());
			projectDao.addCC(project.getCcUser(), project.getId());
			ProjectAct projectAct = new ProjectAct(project.getId(),
					currentUser.getId(), currentUser.getUserCode(),
					ProjectActionDesc.Open.name(), null,
					project.getAttachmentIds());
			projectActDao.add(projectAct);
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	@Override
	public void close(Long id, Integer result, String comments,
			String attachmentIds,String updateTime) throws ServiceException {
	    Project oldproject = projectDao.getById(id);
        if (StringUtils.isBlank(updateTime)) {
            throw new ServiceException("TIMESTAMP_IS_NULL", "timestamp is null");
        } else {
            if (!updateTime.equals(oldproject.getUpdateTime())) {
                throw new ServiceException("OUT_OF_DATE", "data is out of date");
            }
        }
        if(result != 1 && oldproject.getStatus() != 2){//can only rollback 'Finished' project
            throw new ServiceException(ServiceErrorCode.PROJECT_NOT_FINISHED, "project not finished");   
        }
		try {
			Project project = new Project();
			project.setId(id);
			String action = "";
			if (1 == result) {
				project.setStatus(3);
				action = ProjectActionDesc.Close.name();
			} else {
				project.setStatus(-1);
				action = ProjectActionDesc.Rollback.name();
			}
			projectDao.update(project);
			User currentUser = userService.getUser();
			projectDao.updateHandler(id, currentUser.getId());
			ProjectAct projectAct = new ProjectAct(id, currentUser.getId(),
					currentUser.getUserCode(), action, comments, attachmentIds);
			projectActDao.add(projectAct);
		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

	@Override
	public void finish(Long id, String comments, String attachmentIds, String updateTime)
			throws ServiceException {
	    Project oldproject = projectDao.getById(id);
        if (StringUtils.isBlank(updateTime)) {
            throw new ServiceException("TIMESTAMP_IS_NULL", "timestamp is null");
        } else {
            if (!updateTime.equals(oldproject.getUpdateTime())) {
                throw new ServiceException("OUT_OF_DATE", "data is out of date");
            }
        }
		try {
			Project project = new Project();
			project.setId(id);
			project.setStatus(2);
			projectDao.update(project);
			User currentUser = userService.getUser();
			projectDao.updateHandler(id, currentUser.getId());
			ProjectAct projectAct = new ProjectAct(id, currentUser.getId(),
					currentUser.getUserCode(), ProjectActionDesc.Finish.name(),
					comments, attachmentIds);
			projectActDao.add(projectAct);

		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

	@Override
	public void updateProgress(Long id, Integer progress)
			throws ServiceException {
		try {
		    Project oldproject = projectDao.getById(id);
			Project project = new Project();
			project.setId(id);
			project.setProgress(progress);
			projectDao.update(project);
			
            User currentUser = userService.getUser();
            ProjectAct projectAct = new ProjectAct(id, currentUser.getId(),
                    currentUser.getUserCode(),
                    ProjectActionDesc.Progress.name(), oldproject.getProgress()
                            + "% -> " + progress + "% ", null);
            projectActDao.add(projectAct);
			
		} catch (DBException e) {
			throw new ServiceException("DBException", e.getMessage());
		}
	}

	@Override
	public List<Project> get() throws ServiceException {
		try {
			long userId = userService.getUser().getId();
			List<Project> projectList = null;
			if (userService.isAdmin(userId)) {
				projectList = projectDao.get();
			}
			return projectList;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}
	
	@Override
	public List<Project> getOpenedAndRollback() throws ServiceException {
		try {
			long userId = userService.getUser().getId();
			List<Project> projectList = null;
			if (userService.isAdmin(userId)) {
				projectList = projectDao.getOpenedAndRollback();
			} else {
				projectList = projectDao.getOpenedAndRollbackByUserId(userId);
			}
			return projectList;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}

	public List<Issue> getIssueList(Long id) throws ServiceException {
		try {
			List<Issue> issueList = issueDao.getByProjId(id);
			for (int i = 0; i < issueList.size(); i++) {
				if (null != issueList.get(i).getOwnerId()) {
					User user = userService.getById(issueList.get(i)
							.getOwnerId());
					issueList.get(i).setOwner(user.getUserCode());
				}
			}
			return issueList;
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}
	}
}
