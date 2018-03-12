CREATE DATABASE IF NOT EXISTS `ovpm` DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;

GRANT ALL PRIVILEGES ON ovpm.* TO 'ovpm'@'%' IDENTIFIED BY 'ovpm';
GRANT ALL PRIVILEGES ON ovpm.* TO 'ovpm'@'localhost' IDENTIFIED BY 'ovpm';

USE `ovpm`;

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for attachment
-- ----------------------------
DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `url` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='附件表';

-- ----------------------------
-- Table structure for issue
-- ----------------------------
DROP TABLE IF EXISTS `issue`;
CREATE TABLE `issue` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `proj_id` bigint(20) NOT NULL,
  `issue_name` varchar(255) DEFAULT NULL,
  `issue_desc` varchar(1000) DEFAULT NULL COMMENT '描述',
  `keywords` varchar(100) DEFAULT NULL,
  `depends_on` varchar(255) DEFAULT NULL,
  `blocks` varchar(255) DEFAULT NULL,
  `risks` varchar(255) DEFAULT NULL,
  `type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1为issue. 2为request',
  `status` tinyint(4) DEFAULT '0' COMMENT '0为New，1为Approved，2为Solved，3为Closed，-1为Rejected，-2为Rollback',
  `progress` tinyint(4) DEFAULT '0',
  `priority` tinyint(4) DEFAULT '1'  COMMENT ' 1为Critical，2为High，3为Medium，4为Low',
  `owner_id` bigint(20) NOT NULL,
  `handler` varchar(255) DEFAULT NULL,
  `creator` bigint(20) DEFAULT NULL,
  `cost_estimate` int(11) DEFAULT NULL,
  `cost_actual` int(11) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `deadline` varchar(50) DEFAULT NULL,
  `start_time` varchar(50) DEFAULT NULL,
  `deadline_utc` varchar(50) DEFAULT NULL,
  `start_time_utc` varchar(50) DEFAULT NULL,
  `approve_time_utc` varchar(50) DEFAULT NULL,
  `create_time_utc` varchar(50) DEFAULT '',
  `update_time_utc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20000 DEFAULT CHARSET=utf8 COMMENT='项目任务表';

-- ----------------------------
-- Table structure for issue_act
-- ----------------------------
DROP TABLE IF EXISTS `issue_act`;
CREATE TABLE `issue_act` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `proj_id` bigint(20) NOT NULL,
  `issue_id` bigint(20) NOT NULL,
  `issue_name` varchar(255) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `operator_id` bigint(20) NOT NULL,
  `operator_code` varchar(50) NOT NULL,
  `action` varchar(20) DEFAULT NULL,
  `comments` text,
  `attachment_ids` varchar(50) DEFAULT NULL,
  `create_time_utc` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='任务流程记录表\r\n一个任务会对应多个act记录，如create，open，approve，close各对应一条记录';

-- ----------------------------
-- Table structure for issue_cc
-- ----------------------------
DROP TABLE IF EXISTS `issue_cc`;
CREATE TABLE `issue_cc` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '默认CC人员此字段为0',
  `issue_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL COMMENT '被抄送的人员ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='issue抄送人员表';

-- ----------------------------
-- Table structure for issue_related
-- ----------------------------
DROP TABLE IF EXISTS `issue_related`;
CREATE TABLE `issue_related` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `issue_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='issue相关人员';

-- ----------------------------
-- Table structure for operation_log
-- ----------------------------
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `operator_id` bigint(20) NOT NULL,
  `operator` varchar(50) NOT NULL DEFAULT '',
  `task_id` bigint(20) DEFAULT NULL,
  `task_type` varchar(10) DEFAULT '',
  `field_name` varchar(100) NOT NULL,
  `old_value` varchar(100) NOT NULL,
  `new_value` varchar(100) NOT NULL,
  `create_time_utc` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `proj_name` varchar(100) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `keywords` varchar(100) DEFAULT NULL,
  `priority` tinyint(4) DEFAULT '1' COMMENT '1为Critical，2为High，3为Medium，4为Low',
  `pm` varchar(50) NOT NULL,
  `creator` bigint(20) NOT NULL,
  `handler` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '0' COMMENT '0为New，1为Opened，2为Finished，3为Closed，-1为Rollback',
  `progress` tinyint(4) DEFAULT '0',
  `start_time` varchar(50) DEFAULT NULL,
  `start_time_utc` varchar(50) DEFAULT NULL,
  `deadline` varchar(50) DEFAULT NULL,
  `deadline_utc` varchar(50) DEFAULT NULL,
  `create_time_utc` varchar(50) DEFAULT NULL,
  `update_time_utc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8 COMMENT='项目表';

-- ----------------------------
-- Table structure for project_act
-- ----------------------------
DROP TABLE IF EXISTS `project_act`;
CREATE TABLE `project_act` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `proj_id` bigint(20) NOT NULL,
  `operator_id` bigint(20) NOT NULL,
  `operator_code` varchar(50) NOT NULL,
  `action` varchar(20) DEFAULT NULL,
  `comments` text,
  `attachment_ids` varchar(50) DEFAULT NULL,
  `create_time_utc` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `INDEX_UNCS` (`proj_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='项目流程记录表';

-- ----------------------------
-- Table structure for project_cc
-- ----------------------------
DROP TABLE IF EXISTS `project_cc`;
CREATE TABLE `project_cc` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `proj_id` bigint(20) DEFAULT NULL COMMENT '项目ID，默认CC人员此字段为0',
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='项目抄送表';

-- ----------------------------
-- Table structure for project_related
-- ----------------------------
DROP TABLE IF EXISTS `project_related`;
CREATE TABLE `project_related` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `proj_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL COMMENT 'related人员',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='任务相关人员表';

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) DEFAULT NULL COMMENT '角色名称',
  `description` varchar(255) DEFAULT '' COMMENT '角色描述',
  PRIMARY KEY (`id`),
  KEY `INDEX_PNETW` (`role_name`,`description`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Table structure for t_token
-- ----------------------------
DROP TABLE IF EXISTS `t_token`;
CREATE TABLE `t_token` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `token` varchar(50) NOT NULL,
  `expire_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) NOT NULL,
  `password` varchar(100) DEFAULT '96e79218965eb72c92a549dd5a330112' COMMENT '32位md5加密，默认111111',
  `type` tinyint(4) DEFAULT '1' COMMENT '1为OVT-EE 2为Non-OVT',
  `email` varchar(100) DEFAULT '',
  `entity` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `office_tel` varchar(50) DEFAULT NULL,
  `home_tel` varchar(50) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `is_valid` tinyint(4) DEFAULT '1' COMMENT '1为可用0为不可用',
  `create_time_utc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `INDEX_PNETW` (`user_code`,`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `INDEX_PNETW` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户角色表';

-- ----------------------------
-- View structure for task
-- ----------------------------
DROP VIEW IF EXISTS `task`;
CREATE  VIEW `task` AS SELECT
	`project`.`id` AS `task_id`,
	`project`.`id` AS `proj_id`,
	'Project' AS `task_type`,
	`project`.`proj_name` AS `task_name`,
	(
		CASE `project`.`priority`
		WHEN 1 THEN
			'Critical'
		WHEN 2 THEN
			'High'
		WHEN 3 THEN
			'Medium'
		ELSE
			'Low'
		END
	) AS `priority`,
	`project`.`creator` AS `creator`,
	(
		CASE `project`.`status`
		WHEN 0 THEN
			'New'
		WHEN 1 THEN
			'Opened'
		WHEN 2 THEN
			'Finished'
		WHEN - (1) THEN
			'Rollback'
		ELSE
			'Closed'
		END
	) AS `status`,
	`project`.`start_time` AS `start_time`,
	`project`.`start_time_utc` AS `start_time_utc`,
	`project`.`deadline` AS `deadline`,
	`project`.`deadline_utc` AS `deadline_utc`,
	`project`.`pm` AS `pm`,
	'' AS `owner`,
	`project`.`progress` AS `progress`,
	`project`.`handler` AS `handler`,
	`project`.`create_time_utc` AS `create_time_utc`,
	`project`.`update_time_utc` AS `update_time_utc`
FROM
	`project`
UNION
	SELECT
		`issue`.`id` AS `task_id`,
		`issue`.`proj_id` AS `proj_id`,
		(
			CASE `issue`.`type`
			WHEN 1 THEN
				'Issue'
			ELSE
				'Request'
			END
		) AS `task_type`,
		`issue`.`issue_name` AS `task_name`,
		(
			CASE `issue`.`priority`
			WHEN 1 THEN
				'Critical'
			WHEN 2 THEN
				'High'
			WHEN 3 THEN
				'Medium'
			ELSE
				'Low'
			END
		) AS `priority`,
		`issue`.`creator` AS `creator`,
		(
			CASE `issue`.`status`
			WHEN 0 THEN
				'New'
			WHEN 1 THEN
				'Approved'
			WHEN 2 THEN
				'Solved'
			WHEN - (1) THEN
				'Rejected'
			WHEN - (2) THEN
				'Rollback'
			ELSE
				'Closed'
			END
		) AS `status`,
		`issue`.`start_time` AS `start_time`,
		`issue`.`start_time_utc` AS `start_time_utc`,
		`issue`.`deadline` AS `deadline`,
		`issue`.`deadline_utc` AS `deadline_utc`,
		'' AS `pm`,
		`issue`.`owner_id` AS `owner`,
		`issue`.`progress` AS `progress`,
		`issue`.`handler` AS `handler`,
		`issue`.`create_time_utc` AS `create_time_utc`,
		`issue`.`update_time_utc` AS `update_time_utc`
	FROM
		`issue` ;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'systemadmin', '96e79218965eb72c92a549dd5a330112', 1, 'systemadmin@ovt.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL);

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', 'default cc', '默认抄送人员');
INSERT INTO `role` VALUES ('2', 'project admin', '项目管理人员');

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES (1, 1, 0);
