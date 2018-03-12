package com.ovt.pm.api.controller;

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
import com.ovt.pm.service.IssueService;
import com.ovt.pm.service.exception.ServiceException;

/**
 * issue/request module
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
@Controller
@RequestMapping("/issue")
@EnableWebMvc
public class IssueController {

	@Autowired
	private IssueService issueService;

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getById")
	public JsonDocument getById(@RequestParam Long id) throws ServiceException {
		Issue issue = issueService.getById(id);
		return new ProjMgtAPIResult(issue);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getActs")
	public JsonDocument getActs(HttpServletRequest request,
			@RequestParam Long id) throws ServiceException {
		PageInfo pageInfo = HttpUtils.getPageInfo(request);
		PageResult<IssueAct> issueActs = issueService.getActs(pageInfo, id);
		return new ProjMgtAPIResult(issueActs);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/add")
	public JsonDocument add(@RequestBody Issue issue) throws ServiceException {
		issueService.add(issue);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/update")
	public JsonDocument update(@RequestBody Issue issue)
			throws ServiceException {
		issueService.update(issue);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/audit")
	public JsonDocument approve(@RequestParam Long id,
			@RequestParam Integer result, @RequestParam String comments,
			@RequestParam(required = false) String attachmentIds,
			@RequestParam(required = false) String updateTime)
			throws ServiceException {
		issueService.approve(id, result, comments, attachmentIds, updateTime);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/solve")
	public JsonDocument finish(@RequestParam Long id,
			@RequestParam String comments,
			@RequestParam(required = false) String attachmentIds,
			@RequestParam(required = false) String actualCost,
			@RequestParam(required = false) String updateTime)
			throws ServiceException {
		issueService.finish(id, comments, attachmentIds, actualCost, updateTime);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/comment")
	public JsonDocument comment(@RequestParam Long id,
			@RequestParam String comments,
			@RequestParam(required = false) String attachmentIds)
			throws ServiceException {
		issueService.comment(id, comments, attachmentIds);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/updateProgress")
	public JsonDocument updateProgress(@RequestParam Long id,
			@RequestParam Integer progress) throws ServiceException {
		issueService.updateProgress(id, progress);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/close")
	public JsonDocument close(@RequestParam Long id,
			@RequestParam Integer result, @RequestParam String comments,
			@RequestParam(required = false) String attachmentIds,
			@RequestParam(required = false) String updateTime)
			throws ServiceException {
		issueService.close(id, result, comments, attachmentIds, updateTime);
		return new ProjMgtAPIResult();
	}
}
