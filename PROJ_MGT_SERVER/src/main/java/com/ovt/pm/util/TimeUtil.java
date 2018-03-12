package com.ovt.pm.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;

/**
 * 
 * @author lyman.meng
 *
 */
public class TimeUtil {

	private static DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");

	/**
	 * get current utc time
	 * 
	 * @return
	 */
	public static String getUTCTimeStr() {
		StringBuffer UTCTimeBuffer = new StringBuffer();
		Calendar cal = Calendar.getInstance();
		int zoneOffset = cal.get(java.util.Calendar.ZONE_OFFSET);
		int dstOffset = cal.get(java.util.Calendar.DST_OFFSET);
		cal.add(java.util.Calendar.MILLISECOND, -(zoneOffset + dstOffset));
		int year = cal.get(Calendar.YEAR);
		int month = cal.get(Calendar.MONTH) + 1;
		int day = cal.get(Calendar.DAY_OF_MONTH);
		int hour = cal.get(Calendar.HOUR_OF_DAY);
		int minute = cal.get(Calendar.MINUTE);
		UTCTimeBuffer.append(year).append("-").append(month).append("-")
				.append(day);
		UTCTimeBuffer.append(" ").append(hour).append(":").append(minute);
		try {
			format.parse(UTCTimeBuffer.toString());
			return UTCTimeBuffer.toString();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * utc time -> +8:00 time
	 * 
	 * @param UTCTime
	 * @return
	 */
	public static String getLocalTimeFromUTC(String UTCTime) {
		java.util.Date UTCDate = null;
		String localTimeStr = null;
		try {
			UTCDate = format.parse(UTCTime);
			format.setTimeZone(TimeZone.getTimeZone("GMT-8"));
			localTimeStr = format.format(UTCDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return localTimeStr;
	}
}
