package com.ovt.pm.dao;

import com.ovt.pm.dao.vo.Attachment;

/**
 * AttachmentDao
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[DAO] 1.0
 */
public interface AttachmentDao
{

    long add(Attachment attachment);

    void delete(Long id);

    Attachment getById(long attachmentId);
}
