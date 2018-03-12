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
import com.ovt.pm.dao.vo.OperationLog;
import com.ovt.pm.service.OperationLogService;
import com.ovt.pm.service.exception.ServiceException;

/**
 * operation log module
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
@Controller
@RequestMapping("/log")
@EnableWebMvc
public class LogController {

	@Autowired
	private OperationLogService logService;

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/add")
	public JsonDocument add(HttpServletRequest request,
			@RequestBody OperationLog operationLog) throws ServiceException {
		logService.add(operationLog);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/get")
	public JsonDocument get(HttpServletRequest request) throws ServiceException {
		PageInfo pageInfo = HttpUtils.getPageInfo(request);
		PageResult<OperationLog> logList = logService.get(pageInfo);
		return new ProjMgtAPIResult(logList);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/query")
	public JsonDocument query(HttpServletRequest request,
			@RequestParam(required = false) Long taskId,
			@RequestParam(required = false) String startTime,
			@RequestParam(required = false) String endTime)
			throws ServiceException {
		PageInfo pageInfo = HttpUtils.getPageInfo(request);
		PageResult<OperationLog> logList = logService.query(pageInfo, taskId,
				startTime, endTime);
		return new ProjMgtAPIResult(logList);
	}
}
