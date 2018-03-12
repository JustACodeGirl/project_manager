package com.ovt.pm.dao.vo;

import com.ovt.common.annotation.Column;

/**
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
public class Task {

	@Column("task_id")
	private Long taskId;
	
	@Column("proj_id")
    private Long projId;

	@Column("task_type")
	private String taskType;

	@Column("task_name")
	private String taskName;

	@Column("priority")
	private String priority;

	@Column("progress")
	private Integer progress;

	@Column("status")
	private String status;

	@Column("creator")
	private Long creator;

	@Column("start_time")
	private String startTime;

	@Column("start_time_utc")
	private String startTimeUtc;

	@Column("deadline")
	private String deadline;

	@Column("deadline_utc")
	private String deadlineUtc;

	@Column("menu")
	private String menu;

	@Column("create_time_utc")
	private String createTime;
	
    @Column("update_time_utc")
    private String updateTime;
	
	@Column("pm")
    private String pm;
	
	@Column("owner")
    private String owner;

	private String instruction;

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public Long getProjId()
    {
        return projId;
    }

    public void setProjId(Long projId)
    {
        this.projId = projId;
    }

    public String getTaskType() {
		return taskType;
	}

	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getCreator() {
		return creator;
	}

	public void setCreator(Long creator) {
		this.creator = creator;
	}
	 
	public String getStartTime()
    {
        return startTime;
    }

    public void setStartTime(String startTime)
    {
        this.startTime = startTime;
    }

    public String getStartTimeUtc()
    {
        return startTimeUtc;
    }

    public void setStartTimeUtc(String startTimeUtc)
    {
        this.startTimeUtc = startTimeUtc;
    }

    public String getDeadline() {
		return deadline;
	}

	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}

	public String getDeadlineUtc() {
		return deadlineUtc;
	}

	public void setDeadlineUtc(String deadlineUtc) {
		this.deadlineUtc = deadlineUtc;
	}

	public String getMenu() {
		return menu;
	}

	public void setMenu(String menu) {
		this.menu = menu;
	}

	public String getInstruction() {
		return instruction;
	}

	public void setInstruction(String instruction) {
		this.instruction = instruction;
	}

	public Integer getProgress() {
		return progress;
	}

	public void setProgress(Integer progress) {
		this.progress = progress;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

    public String getPm()
    {
        return pm;
    }

    public void setPm(String pm)
    {
        this.pm = pm;
    }

    public String getOwner()
    {
        return owner;
    }

    public void setOwner(String owner)
    {
        this.owner = owner;
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
