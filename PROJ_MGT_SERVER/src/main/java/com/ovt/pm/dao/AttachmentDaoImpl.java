package com.ovt.pm.dao;

import java.text.MessageFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ovt.common.dao.DaoHelper;
import com.ovt.common.utils.DaoRowMapper;
import com.ovt.pm.dao.vo.Attachment;

/**
 * AttachmentDaoImpl
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
@Repository
public class AttachmentDaoImpl implements AttachmentDao
{
    @Autowired
    private DaoHelper daoHelper;

    private static final String SQL_INSERT_ATTACHMENT = "INSERT INTO attachment(name,url) values (?,?)";

    private static final String SQL_DELETE_ATTACHMENT = "delete from t_token WHERE id = ?";

    private static final String SQL_GET_ATTACHMENT_BY_ID = "SELECT * FROM attachment WHERE id = ?";

    @Override
    public long add(Attachment attachment)
    {
        String errMsg = "failed to insert attachment";
        long attachmentId = daoHelper.save(SQL_INSERT_ATTACHMENT, errMsg, true,
                attachment.getName(), attachment.getUrl());
        return attachmentId;
    }

    @Override
    public void delete(Long id)
    {
        String errMsg = MessageFormat.format(
                "Failed to delete attachment [{0}]", id);
        daoHelper.update(SQL_DELETE_ATTACHMENT, errMsg, id);
    }

    @Override
    public Attachment getById(long attachmentId)
    {
        String errMsg = MessageFormat.format(
                "failed to get attachment by id={0}", attachmentId);
        Attachment attachment = daoHelper.queryForObject(
                SQL_GET_ATTACHMENT_BY_ID, new DaoRowMapper<Attachment>(
                        Attachment.class), errMsg, attachmentId);
        return attachment;
    }

}
