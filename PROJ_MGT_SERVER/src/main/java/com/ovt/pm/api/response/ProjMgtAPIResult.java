 /**
 * @Author lyman.meng
 * @Version 1.0
 * @See
 * @Since [ProjMgt]/[API] 1.0
 */
package com.ovt.pm.api.response;

import com.ovt.common.model.JsonDocument;

public class ProjMgtAPIResult extends JsonDocument
{
    public static final JsonDocument SUCCESS = new ProjMgtAPIResult();

    private static final String SERVICE_PMSM_ARTH = "pmsm";

    public ProjMgtAPIResult()
    {
        super(SERVICE_PMSM_ARTH, JsonDocument.STATE_SUCCESS);
    }

    public ProjMgtAPIResult(Object data)
    {
        super(SERVICE_PMSM_ARTH, data);
    }

    public ProjMgtAPIResult(String errCode)
    {
        super(SERVICE_PMSM_ARTH, errCode);
    }

}
