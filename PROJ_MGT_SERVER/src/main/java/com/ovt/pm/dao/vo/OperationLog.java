package com.ovt.pm.dao.vo;

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
@Table("operation_log")
public class OperationLog extends BaseEntity {

	@Column("operator_id")
	private Long operatorId;

	@Column("operator")
	private String operator;
	
	@Column("field_name")
	private String fieldName;

	@Column("old_value")
	private String oldValue;

	@Column("new_value")
	private String newValue;

	@Column("task_id")
	private Long taskId;

	@Column("task_type")
	private String taskType;

	public OperationLog() {

	}

	public OperationLog(Long operatorId,String operator, Long taskId, String taskType,
			String fieldName, String oldValue, String newValue) {
		this.operatorId = operatorId;
		this.operator = operator;
		this.taskId = taskId;
		this.taskType = taskType;
		this.fieldName = fieldName;
		this.oldValue = oldValue;
		this.newValue = newValue;
	}

	public Long getOperatorId() {
		return operatorId;
	}

	public void setOperatorId(Long operatorId) {
		this.operatorId = operatorId;
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getOldValue() {
		return oldValue;
	}

	public void setOldValue(String oldValue) {
		this.oldValue = oldValue;
	}

	public String getNewValue() {
		return newValue;
	}

	public void setNewValue(String newValue) {
		this.newValue = newValue;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public String getTaskType() {
		return taskType;
	}

	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}
}
