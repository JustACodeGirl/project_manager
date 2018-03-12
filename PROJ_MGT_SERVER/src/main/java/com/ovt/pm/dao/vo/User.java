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
@Table("user")
public class User extends BaseEntity {

	@Column("user_code")
	private String userCode;

	@Column("password")
	private String password;

	@Column("type")
	private Integer type;

	@Column("entity")
	private String entity;

	@Column("location")
	private String location;

	@Column("email")
	private String email;

	@Column("office_tel")
	private String officeTel;

	@Column("home_tel")
	private String homeTel;

	@Column("company")
	private String company;

	@Column("department")
	private String department;

	@Column("title")
	private String title;

	@Column("is_valid")
	private Integer isValid;

	// 登陆人员的导航列表
	private List<String> navList;

	private List<Long> role;

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getEntity() {
		return entity;
	}

	public void setEntity(String entity) {
		this.entity = entity;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOfficeTel() {
		return officeTel;
	}

	public void setOfficeTel(String officeTel) {
		this.officeTel = officeTel;
	}

	public String getHomeTel() {
		return homeTel;
	}

	public void setHomeTel(String homeTel) {
		this.homeTel = homeTel;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Integer getIsValid() {
		return isValid;
	}

	public void setIsValid(Integer isValid) {
		this.isValid = isValid;
	}

	public List<String> getNavList() {
		return navList;
	}

	public void setNavList(List<String> navList) {
		this.navList = navList;
	}

	public List<Long> getRole() {
		return role;
	}

	public void setRole(List<Long> role) {
		this.role = role;
	}
	
}
