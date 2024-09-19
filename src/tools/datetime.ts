import { DateTime } from 'luxon';

export const getTodayDate = () => DateTime.local();

export const getFirstDateInMonth = () => {
    const today = DateTime.local();
    return DateTime.local(today.year, today.month, 1).set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
    });
};

export const getLastDateInMonth = () => {
    const today = DateTime.local();
    return DateTime.local(today.year, today.month + 1, 1)
        .minus({
            days: 1,
        })
        .set({
            hour: 12,
            minute: 59,
            second: 59,
            millisecond: 999,
        });
};

export const getMillisDate = (date: DateTime) => {
    return date.toMillis();
};
