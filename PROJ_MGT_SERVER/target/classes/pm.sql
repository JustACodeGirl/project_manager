/*
Navicat MySQL Data Transfer

Source Server         : sales
Source Server Version : 50520
Source Host           : localhost:3307
Source Database       : pm

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2017-05-12 17:11:23
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `message`
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `to_user_id` bigint(20) DEFAULT NULL,
  `type` tinyint(2) DEFAULT NULL COMMENT '类型1普通2提醒3催促',
  `title` varchar(200) DEFAULT NULL,
  `attatchment` varchar(200) DEFAULT NULL,
  `read_status` tinyint(1) DEFAULT '1' COMMENT '1未看，2已看',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT=' 消息表';

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES ('1', '1', '2', '4', '进度要加快', '/leave/approval/66618286464307200', '1', '2017-05-08 16:33:48');
INSERT INTO `message` VALUES ('2', '2', '3', '1', '请明天汇报下具体情况', '/knowledge/66618679508340736', '1', '2017-05-08 16:34:40');
INSERT INTO `message` VALUES ('3', '3', '1', '1', '辛苦了', '/album/66621262012616704', '1', '2017-05-08 16:34:45');

-- ----------------------------
-- Table structure for `permission`
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '中文名称',
  `status` tinyint(1) DEFAULT '0' COMMENT '0正常1删除',
  PRIMARY KEY (`id`),
  KEY `INDEX_PNETW` (`name`,`status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COMMENT='权限表';

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('17', '任务克隆', '0');
INSERT INTO `permission` VALUES ('7', '任务列表', '0');
INSERT INTO `permission` VALUES ('10', '任务删除', '0');
INSERT INTO `permission` VALUES ('11', '任务查看', '0');
INSERT INTO `permission` VALUES ('4', '团队列表', '0');
INSERT INTO `permission` VALUES ('12', '文档列表', '0');
INSERT INTO `permission` VALUES ('15', '文档删除', '0');
INSERT INTO `permission` VALUES ('16', '文档查看', '0');
INSERT INTO `permission` VALUES ('14', '文档添加', '0');
INSERT INTO `permission` VALUES ('13', '文档编辑', '0');
INSERT INTO `permission` VALUES ('8', '添加任务', '0');
INSERT INTO `permission` VALUES ('5', '添加团队', '0');
INSERT INTO `permission` VALUES ('2', '添加项目', '0');
INSERT INTO `permission` VALUES ('9', '编辑任务', '0');
INSERT INTO `permission` VALUES ('6', '编辑团队', '0');
INSERT INTO `permission` VALUES ('3', '编辑项目', '0');
INSERT INTO `permission` VALUES ('1', '项目列表', '0');

-- ----------------------------
-- Table structure for `project`
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `proj_name` varchar(100) DEFAULT NULL COMMENT '项目名称',
  `initiator_id` bigint(20) DEFAULT NULL COMMENT '创建人',
  `manager_id` bigint(20) DEFAULT NULL COMMENT '项目负责人',
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL COMMENT '结束时间',
  `read_time` timestamp NULL DEFAULT NULL,
  `desc` text COMMENT '描述',
  `status` tinyint(1) DEFAULT '0' COMMENT '0新建1进行中,2挂起中,3延期中,4结束',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '添加日期',
  PRIMARY KEY (`id`),
  KEY `INDEX_UNCS` (`initiator_id`,`proj_name`,`create_time`,`status`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='项目表';

-- ----------------------------
-- Records of project
-- ----------------------------
INSERT INTO `project` VALUES ('1', 'OV580', '1461312703628858832', '2', null, '2017-05-08 14:52:51', null, null, '1', '2017-05-08 14:53:30');

-- ----------------------------
-- Table structure for `project_doc`
-- ----------------------------
DROP TABLE IF EXISTS `project_doc`;
CREATE TABLE `project_doc` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `keyword` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `INDEX_PUTK` (`project_id`,`user_id`,`title`,`keyword`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='项目文档表';

-- ----------------------------
-- Records of project_doc
-- ----------------------------
INSERT INTO `project_doc` VALUES ('1', '1', '1', '需求文档', 'ov580', 'http://www.baidu.com', '2017-05-08 16:13:53', '2017-05-08 16:13:50');
INSERT INTO `project_doc` VALUES ('2', '1', '2', '设计文档', '设计', '', '2017-05-08 16:13:58', '2017-05-08 16:13:55');

-- ----------------------------
-- Table structure for `project_log`
-- ----------------------------
DROP TABLE IF EXISTS `project_log`;
CREATE TABLE `project_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `proj_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL COMMENT '操作人',
  `note` text,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='任务日志表';

-- ----------------------------
-- Records of project_log
-- ----------------------------
INSERT INTO `project_log` VALUES ('1', '1', '2', 'lyman创建了任务', '2017-05-08 16:11:29');
INSERT INTO `project_log` VALUES ('2', '2', '2', 'lyman创建了任务', '2017-05-08 16:11:30');
INSERT INTO `project_log` VALUES ('3', '3', '2', 'lyman创建了任务', '2017-05-08 16:11:31');
INSERT INTO `project_log` VALUES ('4', '4', '2', 'lyman创建了任务', '2017-05-08 16:11:32');
INSERT INTO `project_log` VALUES ('5', '5', '2', 'lyman创建了任务', '2017-05-08 16:11:32');
INSERT INTO `project_log` VALUES ('6', '6', '2', 'lyman创建了任务', '2017-05-08 16:11:34');
INSERT INTO `project_log` VALUES ('7', '7', '2', 'lyman创建了任务', '2017-05-08 16:11:35');
INSERT INTO `project_log` VALUES ('8', '8', '2', 'lyman创建了任务', '2017-05-08 16:11:36');
INSERT INTO `project_log` VALUES ('9', '9', '2', 'lyman创建了任务', '2017-05-08 16:11:38');
INSERT INTO `project_log` VALUES ('10', '10', '2', 'lyman创建了任务', '2017-05-08 16:11:39');
INSERT INTO `project_log` VALUES ('11', '11', '2', 'lyman更改任务状态为立项', '2017-05-08 16:11:41');

-- ----------------------------
-- Table structure for `project_task`
-- ----------------------------
DROP TABLE IF EXISTS `project_task`;
CREATE TABLE `project_task` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL COMMENT '项目ID',
  `cc_code` varchar(100) DEFAULT NULL COMMENT '抄送给',
  `task_name` varchar(100) DEFAULT NULL COMMENT '任务名称',
  `desc` varchar(0) DEFAULT NULL COMMENT '描述',
  `note` text COMMENT '备注',
  `level` tinyint(1) DEFAULT '4' COMMENT '优先级1,2,3,4',
  `read_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL COMMENT '预计结束时间',
  `create_user_id` bigint(20) DEFAULT NULL COMMENT '创建人',
  `create_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `accept_user_id` bigint(20) DEFAULT NULL COMMENT '任务接受人ID',
  `close_user_id` bigint(20) DEFAULT NULL COMMENT '关闭者ID',
  `close_time` timestamp NULL DEFAULT NULL COMMENT '关闭时间',
  `cancel_user_id` bigint(20) DEFAULT NULL COMMENT '取消者ID',
  `cancel_time` timestamp NULL DEFAULT NULL COMMENT '取消时间',
  `reopen_user_id` bigint(20) DEFAULT NULL COMMENT '重新打开人ID',
  `reopen_time` timestamp NULL DEFAULT NULL COMMENT '重新打开时间',
  `attachment` varchar(255) DEFAULT NULL COMMENT '附件',
  `status` tinyint(1) DEFAULT '1' COMMENT '1未开始,2进行中,3已完成,4已暂停,5已取消,6已关闭',
  PRIMARY KEY (`id`),
  KEY `INDEX_NSPACS` (`create_user_id`,`project_id`,`accept_user_id`,`create_time`,`status`)
) ENGINE=MyISAM AUTO_INCREMENT=66565032388857857 DEFAULT CHARSET=utf8 COMMENT='项目需求任务表';

-- ----------------------------
-- Records of project_task
-- ----------------------------
INSERT INTO `project_task` VALUES ('1', '1', '', '我的任务1', null, '', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2', '2017-05-08 16:09:43', '4', '0', null, '0', null, null, null, '', '1');
INSERT INTO `project_task` VALUES ('2', '1', '', '我的任务2', '', '', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:09:44', '4', '0', null, '0', null, null, null, '', '1');
INSERT INTO `project_task` VALUES ('3', '1', '', '我的任务3', '', '', '2', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:09:44', '4', '0', null, '0', null, null, null, '', '2');
INSERT INTO `project_task` VALUES ('4', '1', '', '我的任务4', '', '', '2', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:09:45', '5', '0', null, '0', null, null, null, '', '1');
INSERT INTO `project_task` VALUES ('5', '1', '', '我的任务5', '', '', '3', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:09:46', '5', '0', null, '0', null, null, null, '', '1');
INSERT INTO `project_task` VALUES ('6', '1', '', '我的任务6', '', '', '3', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:09:48', '2', '0', null, '0', null, null, null, '', '1');
INSERT INTO `project_task` VALUES ('7', '1', '', '我的任务7', '', '', '3', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:09:49', '2', '0', null, '0', null, null, null, '', '1');
INSERT INTO `project_task` VALUES ('8', '1', '', '我的任务8', '', '', '3', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:09:50', '1', '0', null, '0', null, null, null, '', '1');
INSERT INTO `project_task` VALUES ('9', '1', '', '我的任务9', '', '', '3', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:09:51', '1', '0', null, '0', null, null, null, '', '1');
INSERT INTO `project_task` VALUES ('10', '1', '', '我的任务10', '', '', '3', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3', '2017-05-08 16:26:18', '3', '0', null, '0', null, null, null, '', '1');

-- ----------------------------
-- Table structure for `project_task_log`
-- ----------------------------
DROP TABLE IF EXISTS `project_task_log`;
CREATE TABLE `project_task_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL COMMENT '操作人',
  `note` text,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='任务日志表';

-- ----------------------------
-- Records of project_task_log
-- ----------------------------
INSERT INTO `project_task_log` VALUES ('1', '1', '2', 'lyman创建了任务', '2017-05-08 16:11:29');
INSERT INTO `project_task_log` VALUES ('2', '2', '2', 'lyman创建了任务', '2017-05-08 16:11:30');
INSERT INTO `project_task_log` VALUES ('3', '3', '2', 'lyman创建了任务', '2017-05-08 16:11:31');
INSERT INTO `project_task_log` VALUES ('4', '4', '2', 'lyman创建了任务', '2017-05-08 16:11:32');
INSERT INTO `project_task_log` VALUES ('5', '5', '2', 'lyman创建了任务', '2017-05-08 16:11:32');
INSERT INTO `project_task_log` VALUES ('6', '6', '2', 'lyman创建了任务', '2017-05-08 16:11:34');
INSERT INTO `project_task_log` VALUES ('7', '7', '2', 'lyman创建了任务', '2017-05-08 16:11:35');
INSERT INTO `project_task_log` VALUES ('8', '8', '2', 'lyman创建了任务', '2017-05-08 16:11:36');
INSERT INTO `project_task_log` VALUES ('9', '9', '2', 'lyman创建了任务', '2017-05-08 16:11:38');
INSERT INTO `project_task_log` VALUES ('10', '10', '2', 'lyman创建了任务', '2017-05-08 16:11:39');
INSERT INTO `project_task_log` VALUES ('11', '11', '2', 'lyman更改任务状态为立项', '2017-05-08 16:11:41');

-- ----------------------------
-- Table structure for `project_team`
-- ----------------------------
DROP TABLE IF EXISTS `project_team`;
CREATE TABLE `project_team` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `team_name` varchar(255) DEFAULT NULL COMMENT '项目名称',
  `project_id` bigint(20) DEFAULT NULL COMMENT '项目ID',
  `user_code` varchar(255) DEFAULT NULL COMMENT '成员ID',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `INDEX_PU` (`project_id`,`user_code`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='项目成员表';

-- ----------------------------
-- Records of project_team
-- ----------------------------
INSERT INTO `project_team` VALUES ('1', 'web团队', '1', '2', '2017-05-08 16:12:36');
INSERT INTO `project_team` VALUES ('2', 'mobile团队', '2', '2', '2017-05-08 16:12:37');
INSERT INTO `project_team` VALUES ('3', '嵌入式团队', '1', '2', '2017-05-08 16:12:40');
