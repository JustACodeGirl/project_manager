package com.ovt.pm.dao.vo;

import com.ovt.common.annotation.Column;
import com.ovt.common.annotation.Table;

/**
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
@Table("attachment")
public class Attachment
{

    @Column("id")
    private Long id;

    @Column("name")
    private String name;

    @Column("url")
    private String url;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getUrl()
    {
        return url;
    }

    public void setUrl(String url)
    {
        this.url = url;
    }

}
