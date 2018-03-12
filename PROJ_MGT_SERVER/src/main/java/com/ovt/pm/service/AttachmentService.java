/**
 * AttachmentService.java
 * 
 * Copyright@2017 OVT Inc. All rights reserved. 
 * 
 * 2017年6月7日
 */
package com.ovt.pm.service;


import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import com.ovt.pm.dao.vo.Attachment;
import com.ovt.pm.service.exception.ServiceException;

/**
 * AttachmentService
 * 
 * @Author hyson.yu
 * @Version 1.0
 * @See
 * @Since [OVT ProjMgt]/[API] 1.0
 */
public interface AttachmentService {

	Attachment upload(Long id, MultipartFile file) throws ServiceException;

	void delete(Long id) throws ServiceException;

	String down(HttpServletResponse response, Long id);

}
