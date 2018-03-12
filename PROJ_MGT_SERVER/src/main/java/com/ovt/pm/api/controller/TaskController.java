package com.ovt.pm.api.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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
import com.ovt.pm.dao.vo.Task;
import com.ovt.pm.service.TaskService;
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
@RequestMapping("/task")
@EnableWebMvc
public class TaskController {

	@Autowired
	private TaskService taskService;

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getToDo")
	public JsonDocument getToDo(HttpServletRequest request, 
			@RequestParam(required = false) String condition)
			throws ServiceException {
		PageInfo pageInfo = HttpUtils.getPageInfo(request);
		PageResult<Task> taskList = taskService.getToDo(pageInfo, condition);
		return new ProjMgtAPIResult(taskList);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getRelated")
	public JsonDocument getRelated(HttpServletRequest request, 
			@RequestParam(required = false) String condition)
			throws ServiceException {
		PageInfo pageInfo = HttpUtils.getPageInfo(request);
		PageResult<Task> taskList = taskService.getRelated(pageInfo, condition);
		return new ProjMgtAPIResult(taskList);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getCC")
	public JsonDocument getCC(HttpServletRequest request, 
			@RequestParam(required = false) String condition)
			throws ServiceException {
		PageInfo pageInfo = HttpUtils.getPageInfo(request);
		PageResult<Task> taskList = taskService.getCC(pageInfo, condition);
		return new ProjMgtAPIResult(taskList);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/query")
	public JsonDocument query(HttpServletRequest request,
			@RequestParam(required = false) Long taskId,
			@RequestParam(required = false) String taskType,
			@RequestParam(required = false) String taskName,
			@RequestParam(required = false) String status,
			@RequestParam(required = false) String deadline)
			throws ServiceException {
		PageInfo pageInfo = HttpUtils.getPageInfo(request);
		PageResult<Task> taskList = taskService.query(pageInfo, taskId,
				taskType, taskName, status, deadline);
		return new ProjMgtAPIResult(taskList);
	}
}
