package com.ovt.pm.api.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ovt.common.context.SessionContext;
import com.ovt.common.model.JsonDocument;
import com.ovt.common.model.Session;
import com.ovt.common.utils.CookieUtil;
import com.ovt.common.utils.HttpUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.api.response.ProjMgtAPIResult;
import com.ovt.pm.config.AppProperties;
import com.ovt.pm.dao.vo.User;
import com.ovt.pm.service.UserService;
import com.ovt.pm.service.exception.ServiceErrorCode;
import com.ovt.pm.service.exception.ServiceException;

/**
 * PlatformAccessInterceptor do the following things: <li>identify user by
 * access token from cookies before call controller</li>
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
public class PlatformAccessInterceptor extends HandlerInterceptorAdapter {
	@Autowired
	private UserService userService;

	@Autowired
	private AppProperties appProperties;

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		super.preHandle(request, response, handler);

		String accessToken = HttpUtils.getParamValue(request,
				CookieUtil.KEY_ACCESS_TOKEN);
		if (StringUtils.isBlank(accessToken)) {
			writeResponse(response, ServiceErrorCode.NOT_LOGIN);
			return false;
		}

		User user = userService.getByAccessToken(accessToken);
		if(user == null){
		    writeResponse(response, ServiceErrorCode.INVALID_ACCESS_TOKEN);
            return false;
		}
		initSessionContext(user);

		CookieUtil.addCookie(response, CookieUtil.KEY_ACCESS_TOKEN,
				accessToken, appProperties.cookieAccessTokenAge);

		return true;
	}

	/**
	 * Initial session context.
	 * 
	 * @param user
	 * @throws ServiceException
	 * @throws NoAccessException
	 */
	private void initSessionContext(User user) {
		Session session = new Session();
		session.set(Session.USER, user);
		SessionContext.setCurrentSession(session);
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		super.postHandle(request, response, handler, modelAndView);
		SessionContext.destroy();
	}

	private void writeResponse(HttpServletResponse response, String errCode)
			throws Exception {
		JsonDocument respBody = new ProjMgtAPIResult(errCode);

		MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
		converter.write(respBody, MediaType.APPLICATION_JSON,
				new ServletServerHttpResponse(response));
	}
}
