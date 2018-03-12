package com.ovt.pm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * AppProperties
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [LearningHelp]/[API] 1.0
 */
@Component
public class AppProperties {
	// cookies
	@Value("${cookie.access_token.age}")
	public int cookieAccessTokenAge;

	@Value("${file.upload.path}")
	public String fileUploadPath;
	
	@Value("${entity.location}")
	public String entityLocation;
	
	// email
    @Value("${email.user_name}")
    public String emailUserName;

    @Value("${email.password}")
    public String emailPassword;
    
    @Value("${email.protocol}")
    public String emailProtocol;

    @Value("${email.host}")
    public String emailHost;
    
    @Value("${email.from}")
    public String emailFrom;
    
    // project
    @Value("${project.remind.day}")
    public int projectRemindDay;
    
}
