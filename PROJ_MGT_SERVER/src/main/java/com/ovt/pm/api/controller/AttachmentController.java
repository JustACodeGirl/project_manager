/**
 * AttachmentController.java
 * 
 * Copyright@2017 OVT Inc. All rights reserved. 
 * 
 * 2017年6月7日
 */
package com.ovt.pm.api.controller;


import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.ovt.common.model.JsonDocument;
import com.ovt.pm.api.response.ProjMgtAPIResult;
import com.ovt.pm.dao.vo.Attachment;
import com.ovt.pm.service.AttachmentService;
import com.ovt.pm.service.exception.ServiceException;

/**
 * AttachmentController
 * 
 * @Author hyson.yu
 * @Version 1.0
 * @See
 * @Since [OVT ProjMgt]/[API] 1.0
 */
@Controller
@RequestMapping("/attachment")
@EnableWebMvc
public class AttachmentController {
	@Autowired
	private AttachmentService attachmentService;

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/upload")
	public JsonDocument upload(@RequestParam Long projId,@RequestParam("file") MultipartFile file) throws ServiceException {
		Attachment attachment = attachmentService.upload(projId, file);
		return new ProjMgtAPIResult(attachment);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/delete")
	public JsonDocument delete(@RequestParam Long attachmentId) throws ServiceException {
		attachmentService.delete(attachmentId);
		return new ProjMgtAPIResult();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/down")
	public void down(HttpServletResponse response, @RequestParam Long attachmentId) {
		String result = attachmentService.down(response, attachmentId);
		if (!"SUCCESS".equals(result)) {
			response.setStatus(404);
		}
	}
}
