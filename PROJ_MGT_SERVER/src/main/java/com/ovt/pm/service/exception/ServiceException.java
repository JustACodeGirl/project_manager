package com.ovt.pm.service.exception;

import com.ovt.common.exception.OVTException;

/**
 * ServiceException
 * 
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[SERVICE] 1.0
 */
public class ServiceException extends OVTException
{
    private static final long serialVersionUID = -8991620565895380650L;

    public ServiceException()
    {
        super();
    }

    public ServiceException(String errCode, String message)
    {
        super(errCode, message);
    }

    public ServiceException(String errCode, Throwable cause)
    {
        super(errCode, cause);
    }

    public ServiceException(String errCode, String message, Throwable cause)
    {
        super(errCode, message, cause);
    }

}
