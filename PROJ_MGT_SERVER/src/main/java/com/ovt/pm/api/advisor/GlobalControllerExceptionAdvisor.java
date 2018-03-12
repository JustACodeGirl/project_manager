package com.ovt.pm.api.advisor;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ovt.common.log.Logger;
import com.ovt.common.log.LoggerFactory;
import com.ovt.common.model.JsonDocument;
import com.ovt.pm.api.response.ProjMgtAPIResult;
import com.ovt.pm.dao.constant.LoggerConst;
import com.ovt.pm.service.exception.ServiceException;

/**
 * GlobalExceptionController
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
@ControllerAdvice
public class GlobalControllerExceptionAdvisor {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(LoggerConst.SYSTEM_LOGGER);

	@ExceptionHandler
	@ResponseBody
	public JsonDocument handleServiceException(ServiceException serviceException) {
		LOGGER.error("Controller catches service exception!", serviceException);
		return new ProjMgtAPIResult(serviceException.getErrorCode());
	}

	@ExceptionHandler
	@ResponseBody
	public JsonDocument handleRuntimeException(RuntimeException runtimeException) {
		LOGGER.error("Controller catches runtime exception!", runtimeException);
		return new ProjMgtAPIResult("SYSTEM_UNEXPECTED");
	}
}
