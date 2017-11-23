package org.pipes.util;

import org.joda.time.DateTime;
import org.pipes.stats.Log;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Created by saipkri on 23/11/17.
 */
public final class TimeAggregateUtil {
    private TimeAggregateUtil() {
    }

    public static Map<String, Long> aggregate(final List<Log> logs, final TimeUnit timeUnit) {
        Map<String, Long> aggs = new LinkedHashMap<>();
        logs.stream()
                .forEach(m -> {
                    String key;
                    if (timeUnit == TimeUnit.SECONDS) {
                        key = secondKey(new DateTime(m.getTimestamp()));
                    } else if (timeUnit == TimeUnit.MILLISECONDS) {
                        key = millisecondKey(new DateTime(m.getTimestamp()));
                    } else if (timeUnit == TimeUnit.MINUTES) {
                        key = minuteKey(new DateTime(m.getTimestamp()));
                    } else if (timeUnit == TimeUnit.HOURS) {
                        key = hourKey(new DateTime(m.getTimestamp()));
                    } else {
                        throw new IllegalArgumentException("Timeunit not supported: " + timeUnit);
                    }
                    aggs.compute(key, (k, v) -> v == null ? m.getCount() : v + m.getCount());

                });
        return aggs;
    }

    private static String secondKey(final DateTime dateTime) {
        return dateTime.getDayOfMonth() + "/" + dateTime.getMonthOfYear() + "/" + dateTime.getYear() + " " + dateTime.getHourOfDay() + ":" + dateTime.getMinuteOfHour() + ":" + dateTime.getSecondOfMinute();
    }

    private static String millisecondKey(final DateTime dateTime) {
        return dateTime.getDayOfMonth() + "/" + dateTime.getMonthOfYear() + "/" + dateTime.getYear() + " " + dateTime.getHourOfDay() + ":" + dateTime.getMinuteOfHour() + ":" + dateTime.getSecondOfMinute() + ":" + dateTime.millisOfSecond();
    }

    private static String minuteKey(final DateTime dateTime) {
        return dateTime.getDayOfMonth() + "/" + dateTime.getMonthOfYear() + "/" + dateTime.getYear() + " " + dateTime.getHourOfDay() + ":" + dateTime.getMinuteOfHour();
    }

    private static String hourKey(final DateTime dateTime) {
        return dateTime.getDayOfMonth() + "/" + dateTime.getMonthOfYear() + "/" + dateTime.getYear() + " " + dateTime.getHourOfDay();
    }
}
