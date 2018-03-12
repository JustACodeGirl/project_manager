package com.ovt.pm.api.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.ovt.common.model.JsonDocument;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.utils.HttpUtils;
import com.ovt.pm.api.response.ProjMgtAPIResult;
import com.ovt.pm.dao.vo.Issue;
import com.ovt.pm.dao.vo.IssueAct;
import com.ovt.pm.dao.vo.Project;
import com.ovt.pm.service.ProjectService;
import com.ovt.pm.service.exception.ServiceException;

/**
 * project module
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
@Controller
@RequestMapping("/project")
@EnableWebMvc
public class ProjectController {

	@Autowired
	private ProjectService projectService;

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getById")
	public JsonDocument getById(@RequestParam Long id) throws ServiceException {
		Project project = projectService.getById(id);
		return new ProjMgtAPIResult(project);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getActs")
	public JsonDocument getActs(HttpServletRequest request,
			@RequestParam Long id) throws ServiceException {
		PageInfo pageInfo = HttpUtils.getPageInfo(request);
		PageResult<IssueAct> projectResults = projectService.getActs(pageInfo,
				id);
		return new ProjMgtAPIResult(projectResults);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/add")
	public JsonDocument add(@RequestBody Project project)
			throws ServiceException {
		projectService.add(project);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/update")
	public JsonDocument update(@RequestBody Project project)
			throws ServiceException {
		projectService.update(project);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/open")
	public JsonDocument open(@RequestBody Project project)
			throws ServiceException {
		projectService.open(project);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/finish")
	public JsonDocument finish(@RequestParam Long id,
			@RequestParam String comments,
			@RequestParam(required = false) String attachmentIds,
			@RequestParam(required = false) String updateTime)
			throws ServiceException {
		projectService.finish(id, comments, attachmentIds, updateTime);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/comment")
	public JsonDocument comment(@RequestParam Long id,
			@RequestParam String comments,
			@RequestParam(required = false) String attachmentIds)
			throws ServiceException {
		projectService.comment(id, comments, attachmentIds);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/close")
	public JsonDocument close(@RequestParam Long id,
			@RequestParam Integer result, @RequestParam String comments,
			@RequestParam(required = false) String attachmentIds,
			@RequestParam(required = false) String updateTime)
			throws ServiceException {
		projectService.close(id, result, comments, attachmentIds,updateTime);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/updateProgress")
	public JsonDocument updateProgress(@RequestParam Long id,
			@RequestParam Integer progress) throws ServiceException {
		projectService.updateProgress(id, progress);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/get")
	public JsonDocument getProjectsForEditIssue() throws ServiceException {
		List<Project> projectList = projectService.get();
		return new ProjMgtAPIResult(projectList);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getOpen")
	public JsonDocument getProjectsForNewIssue() throws ServiceException {
		List<Project> projectList = projectService.getOpenedAndRollback();
		return new ProjMgtAPIResult(projectList);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getIssueList")
	public JsonDocument getIssueList(@RequestParam Long id) throws ServiceException {
		List<Issue> issueList = projectService.getIssueList(id);
		return new ProjMgtAPIResult(issueList);
	}
}
