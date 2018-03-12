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
@Table("issue")
public class Issue extends BaseEntity {
	@Column("proj_id")
	private Long projId;

//	@Column("proj_name")
	private String projName;

	@Column("issue_name")
	private String issueName;

	@Column("issue_desc")
	private String issueDesc;

	@Column("keywords")
	private String keywords;

	@Column("depends_on")
	private String dependsOn;

	@Column("blocks")
	private String blocks;

	@Column("risks")
	private String risks;

	@Column("type")
	private Integer type;

	@Column("status")
	private Integer status;

	@Column("progress")
	private Integer progress;

	@Column("priority")
	private Integer priority;

	private String owner;

	@Column("owner_id")
	private Long ownerId;

	@Column("creator")
	private Long creator;

//	@Column("creator_code")
	private String creatorCode;

	@Column("cost_estimate")
	private Integer costEstimate;

	@Column("cost_actual")
	private Integer costActual;

	@Column("url")
	private String url;

	@Column("start_time")
	private String startTime;

	@Column("approve_time_utc")
	private String approveTimeUtc;

	@Column("deadline")
	private String deadline;
	
    @Column("update_time_utc")
    private String updateTime;

	private List<String> relatedUser;

	private List<String> ccUser;

	private String attachmentIds;

	public Long getProjId() {
		return projId;
	}

	public void setProjId(Long projId) {
		this.projId = projId;
	}

	public String getProjName() {
		return projName;
	}

	public void setProjName(String projName) {
		this.projName = projName;
	}

	public String getIssueName() {
		return issueName;
	}

	public void setIssueName(String issueName) {
		this.issueName = issueName;
	}

	public String getIssueDesc() {
		return issueDesc;
	}

	public void setIssueDesc(String issueDesc) {
		this.issueDesc = issueDesc;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	public String getDependsOn() {
		return dependsOn;
	}

	public void setDependsOn(String dependsOn) {
		this.dependsOn = dependsOn;
	}

	public String getBlocks() {
		return blocks;
	}

	public void setBlocks(String blocks) {
		this.blocks = blocks;
	}

	public String getRisks() {
		return risks;
	}

	public void setRisks(String risks) {
		this.risks = risks;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
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

	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public Long getCreator() {
		return creator;
	}

	public void setCreator(Long creator) {
		this.creator = creator;
	}

	public String getCreatorCode() {
		return creatorCode;
	}

	public void setCreatorCode(String creatorCode) {
		this.creatorCode = creatorCode;
	}

	public Integer getCostEstimate() {
		return costEstimate;
	}

	public void setCostEstimate(Integer costEstimate) {
		this.costEstimate = costEstimate;
	}

	public Integer getCostActual() {
		return costActual;
	}

	public void setCostActual(Integer costActual) {
		this.costActual = costActual;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getApproveTimeUtc() {
		return approveTimeUtc;
	}

	public void setApproveTimeUtc(String approveTimeUtc) {
		this.approveTimeUtc = approveTimeUtc;
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

    public String getUpdateTime()
    {
        return updateTime;
    }

    public void setUpdateTime(String updateTime)
    {
        this.updateTime = updateTime;
    }
}
