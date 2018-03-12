package com.ovt.pm.dao.vo;

import java.util.List;

import com.ovt.common.annotation.Column;
import com.ovt.common.annotation.Table;
import com.ovt.common.dao.BaseEntity;

/**
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
@Table("project")
public class Project extends BaseEntity {

	@Column("proj_name")
	private String projName;

	@Column("description")
	private String description;

	@Column("keywords")
	private String keywords;

	@Column("priority")
	private Integer priority;

	@Column("pm")
	private String pm;

	@Column("creator")
	private Long creator;

	private String creatorCode;

	@Column("status")
	private Integer status;

	@Column("progress")
	private Integer progress;

	@Column("start_time")
	private String startTime;

	@Column("deadline")
	private String deadline;
	
	@Column("update_time_utc")
	private String updateTime;

	private List<String> relatedUser;

	private List<String> ccUser;

	private String attachmentIds;

	private Integer type = 0;

	public String getProjName() {
		return projName;
	}

	public void setProjName(String projName) {
		this.projName = projName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	public String getPm() {
		return pm;
	}

	public void setPm(String pm) {
		this.pm = pm;
	}

	public Long getCreator() {
		return creator;
	}

	public String getCreatorCode() {
		return creatorCode;
	}

	public void setCreatorCode(String creatorCode) {
		this.creatorCode = creatorCode;
	}

	public void setCreator(Long creator) {
		this.creator = creator;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getProgress() {
		return progress;
	}

	public void setProgress(Integer progress) {
		this.progress = progress;
	}
	 
	public String getStartTime()
    {
        return startTime;
    }

    public void setStartTime(String startTime)
    {
        this.startTime = startTime;
    }

    public String getDeadline() {
		return deadline;
	}

	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}

	public List<String> getRelatedUser() {
		return relatedUser;
	}

	public void setRelatedUser(List<String> relatedUser) {
		this.relatedUser = relatedUser;
	}

	public List<String> getCcUser() {
		return ccUser;
	}

	public void setCcUser(List<String> ccUser) {
		this.ccUser = ccUser;
	}

	public String getAttachmentIds() {
		return attachmentIds;
	}

	public void setAttachmentIds(String attachmentIds) {
		this.attachmentIds = attachmentIds;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

    public String getUpdateTime()
    {
        return updateTime;
    }

    public void setUpdateTime(String updateTime)
    {
        this.updateTime = updateTime;
    }

}
