package com.ovt.pm.api.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.ovt.common.context.SessionContext;
import com.ovt.common.model.JsonDocument;
import com.ovt.common.model.PageInfo;
import com.ovt.common.model.PageResult;
import com.ovt.common.model.Session;
import com.ovt.common.utils.CookieUtil;
import com.ovt.common.utils.HttpUtils;
import com.ovt.common.utils.StringUtils;
import com.ovt.pm.api.response.ProjMgtAPIResult;
import com.ovt.pm.config.AppProperties;
import com.ovt.pm.dao.vo.Password;
import com.ovt.pm.dao.vo.User;
import com.ovt.pm.service.UserService;
import com.ovt.pm.service.exception.ServiceException;

/**
 * user module
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
@Controller
@RequestMapping("/user")
@EnableWebMvc
public class UserController {

	@Autowired
	private UserService userService;
	
	@Autowired
    private AppProperties appProperties;

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/login")
	public JsonDocument login(HttpServletResponse response,
			@RequestParam String email, @RequestParam String password)
			throws ServiceException {
		String accessToken = userService.login(email, password);
		CookieUtil.addCookie(response, CookieUtil.KEY_ACCESS_TOKEN,
				accessToken, appProperties.cookieAccessTokenAge);

		Session session = SessionContext.getCurrentSession();
		User user = (null == session) ? null : (User) session.get(Session.USER);

		return new ProjMgtAPIResult(user);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/current")
	public JsonDocument getCurrentUser() throws ServiceException {
		Session session = SessionContext.getCurrentSession();
		User user = (null == session) ? null : (User) session.get(Session.USER);
		return new ProjMgtAPIResult(user);
	}


	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/logout")
	public JsonDocument logout(HttpServletResponse response,
			HttpServletRequest request) throws ServiceException {
		String accessToken = CookieUtil.getCookie(request,
				CookieUtil.KEY_ACCESS_TOKEN);

		if (StringUtils.isBlank(accessToken)) {
			accessToken = HttpUtils.getParamValue(request,
					CookieUtil.KEY_ACCESS_TOKEN);
		}

		userService.logout(accessToken);
		CookieUtil.addCookie(response, CookieUtil.KEY_ACCESS_TOKEN,
				accessToken, 0);

		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/check")
	public JsonDocument checkName(@RequestParam String userCode)
			throws ServiceException {

		Boolean result = userService.check(userCode);

		return new ProjMgtAPIResult(result);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/add")
	public JsonDocument add(@RequestBody User user) throws ServiceException {
		userService.add(user);
		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/get")
	public JsonDocument get(HttpServletRequest request) throws ServiceException {

		PageInfo pageInfo = HttpUtils.getPageInfo(request);

		PageResult<User> userList = userService.get(pageInfo);

		return new ProjMgtAPIResult(userList);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getById")
	public JsonDocument getById(@RequestParam Long id) throws ServiceException {

		User user = userService.getById(id);

		return new ProjMgtAPIResult(user);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/delete")
	public JsonDocument delete(@RequestParam Long id) throws ServiceException {

		userService.delete(id);

		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/update")
	public JsonDocument update(@RequestBody User user) throws ServiceException {

		userService.update(user);

		return new ProjMgtAPIResult();
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/autoComplete")
	public JsonDocument autoComplete(@RequestParam String userCode) throws ServiceException {

		List<String> users = userService.autoComplete(userCode);

		return new ProjMgtAPIResult(users);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getEntities")
	public JsonDocument getEntities() throws ServiceException {

		List<String> entityList = userService.getEntities();

		return new ProjMgtAPIResult(entityList);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "/getLocations")
	public JsonDocument getLocations(@RequestParam String entity) throws ServiceException {

		List<String> locationList = userService.getLocations(entity);

		return new ProjMgtAPIResult(locationList);
	}
	
	@ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/updatePassword")
    public JsonDocument updatePassword(@RequestBody Password password) throws ServiceException {

        userService.updatePassword(password.getOldPassword(), password.getNewPassword());

        return new ProjMgtAPIResult();
    }
}
