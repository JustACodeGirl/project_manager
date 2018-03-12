package com.ovt.pm.dao.vo;

import java.util.ArrayList;
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
@Table("project_act")
public class ProjectAct extends BaseEntity
{

    @Column("proj_id")
    private Long projId;

    @Column("operator_id")
    private Long operatorId;

    @Column("operator_code")
    private String operatorCode;

    @Column("action")
    private String action;

    @Column("comments")
    private String comments;

    @Column("attachment_ids")
    private String attachmentIds;

    private List<Attachment> attachment = new ArrayList<Attachment>();

    public ProjectAct()
    {

    }

    public ProjectAct(Long projId, Long operatorId, String operatorCode,
            String action, String comments, String attachmentIds)
    {
        this.projId = projId;
        this.operatorId = operatorId;
        this.operatorCode = operatorCode;
        this.action = action;
        this.comments = comments;
        this.attachmentIds = attachmentIds;
    }

    public Long getProjId()
    {
        return projId;
    }

    public void setProjId(Long projId)
    {
        this.projId = projId;
    }

    public Long getOperatorId()
    {
        return operatorId;
    }

    public void setOperatorId(Long operatorId)
    {
        this.operatorId = operatorId;
    }

    public String getAction()
    {
        return action;
    }

    public void setAction(String action)
    {
        this.action = action;
    }

    public String getComments()
    {
        return comments;
    }

    public void setComments(String comments)
    {
        this.comments = comments;
    }

    public String getAttachmentIds()
    {
        return attachmentIds;
    }

    public void setAttachmentIds(String attachmentIds)
    {
        this.attachmentIds = attachmentIds;
    }

    public List<Attachment> getAttachment()
    {
        return attachment;
    }

    public void setAttachment(List<Attachment> attachment)
    {
        this.attachment = attachment;
    }

    public String getOperatorCode()
    {
        return operatorCode;
    }

    public void setOperatorCode(String operatorCode)
    {
        this.operatorCode = operatorCode;
    }
}
