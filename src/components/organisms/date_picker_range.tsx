import { DateRange } from '@mui/lab';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro';
import { DateTime } from 'luxon';

export type TDatePickerRangeProps = {
    value: DateRange<DateTime<boolean>>;
    onChange?: (value: DateRange<DateTime<boolean>>) => void;
};

export const DatePickerRange = (props: TDatePickerRangeProps) => {
    return (
        <DateTimeRangePicker
            {...props}
            viewRenderers={{
                hours: null,
                minutes: null,
            }}
            localeText={{ start: 'Desde', end: 'Hasta', endTime: '' }}
        />
    );
};
