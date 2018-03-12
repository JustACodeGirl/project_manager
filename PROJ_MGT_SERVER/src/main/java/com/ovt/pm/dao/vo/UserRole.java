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
@Table("user_role")
public class UserRole extends BaseEntity {

	@Column("role_id")
	private Long RoleId;
	
	@Column("user_id")
	private Long userId;
	
	public UserRole(){
		
	}

	public UserRole(Long roleId, Long userId) {
		RoleId = roleId;
		this.userId = userId;
	}

	public Long getRoleId() {
		return RoleId;
	}

	public void setRoleId(Long roleId) {
		RoleId = roleId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}
}
