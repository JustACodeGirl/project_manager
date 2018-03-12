/**
 * AttachmentServiceImpl.java
 * 
 * Copyright@2017 OVT Inc. All rights reserved. 
 * 
 * 2017年6月7日
 */
package com.ovt.pm.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ovt.common.exception.DBException;
import com.ovt.pm.config.AppProperties;
import com.ovt.pm.dao.AttachmentDao;
import com.ovt.pm.dao.vo.Attachment;
import com.ovt.pm.service.exception.ServiceException;

/**
 * AttachmentServiceImpl
 * 
 * @Author hyson.yu
 * @Version 1.0
 * @See
 * @Since [OVT ProjMgt]/[API] 1.0
 */
@Service
public class AttachmentServiceImpl implements AttachmentService {

	@Autowired
	private AttachmentDao attachmentDao;

	@Autowired
	private AppProperties appProperties;

	@Override
	public Attachment upload(Long projId, MultipartFile file)
			throws ServiceException {
		Attachment attachment = new Attachment();
		String url = "/" + String.valueOf(projId) + "/" + file.getOriginalFilename();
		String filePath = appProperties.fileUploadPath + url;
		if (this.saveFile(filePath, file)) {
			attachment.setUrl(url);
			attachment.setName(file.getOriginalFilename());
			Long attachmentId = attachmentDao.add(attachment);
			attachment.setId(attachmentId);
		}
		if (attachment == null || attachment.getId() == null
				|| attachment.getId() <= 0) {
			throw new ServiceException("UPLOAD_FAIL", "upload attachment fail");
		}
		return attachment;

	}

	@Override
	public void delete(Long id) throws ServiceException {
		try {
			attachmentDao.delete(id);
		} catch (DBException e) {
			throw new ServiceException("DB_EXCEPTION", e.getMessage());
		}

	}

	@Override
	public String down(HttpServletResponse response, Long id) {
		Attachment attachment = attachmentDao.getById(id);
		if (attachment == null) {
			return "AttachmentNotExist";
		}
		String root = appProperties.fileUploadPath;
		File file = new File(root + attachment.getUrl());
		if (!file.exists()) {
			return "AttachmentNotExist";
		}
		InputStream inStream = null;
		// 设置输出的格式
        response.reset();
        response.setContentType("bin");
        response.addHeader("Content-Disposition", "attachment; filename=\"" + attachment.getName() + "\"");
		try {
		    inStream = new FileInputStream(file);
	        byte[] b = new byte[100];
	        int len;
	        while ((len = inStream.read(b)) > 0){
	            response.getOutputStream().write(b, 0, len);
	        }
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
			    inStream.close();
			} catch (Exception e) {
			}
		}
		return "SUCCESS";
	}

	/**
	 * 
	 * @param filePath
	 *            文件保存路径（包含文件名）
	 * @param file
	 * @return
	 */
	private boolean saveFile(String filePath, MultipartFile multifile) {
		// 判断文件是否为空
		if (!multifile.isEmpty()) {
			try {
				// 转存文件
				File file = new File(filePath);
				if(!file.exists()){
					file.mkdirs();
				}
				multifile.transferTo(file);
				return true;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return false;
	}

}
