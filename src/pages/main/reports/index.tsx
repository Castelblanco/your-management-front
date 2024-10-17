import { Box, Card, CardHeader, Stack } from '@mui/material';
import styles from './styles.module.css';
import { useState } from 'react';
import { DateRange } from '@mui/lab';
import { DateTime } from 'luxon';
import { getFirstDateInMonth, getLastDateInMonth, getMillisDate } from '@tools/datetime';
import { DatePickerRange } from '@organisms/date_picker_range';
import { ButtonSecondary } from '@molecules/buttons/secondary';
import { useCallServices } from '@hooks/use_call_services';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';
import { guideServices } from '@services/guides_service';
import { useProfile } from '@storages/zustand/profile';

export default function Reports() {
    const { setSnackbarError } = useSnackbar();
    const { profile } = useProfile();
    const [dateFilter, setDateFilter] = useState<DateRange<DateTime>>([
        getFirstDateInMonth(),
        getLastDateInMonth(),
    ]);

    const { loading, callEndpointDowloadFile } = useCallServices();

    const handleChangeDateFilter = (date: DateRange<DateTime<boolean>>) => {
        setDateFilter(date);
    };

    const handleDownloadRouter = async () => {
        try {
            await callEndpointDowloadFile(
                guideServices.reportRouter({
                    userId: '',
                    pointSaleId: profile.pointSale?.id,
                    startDate: getMillisDate(dateFilter[0]!),
                    endDate: getMillisDate(dateFilter[1]!),
                }),
            );
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    return (
        <Box className={styles.container}>
            <Card className={styles.box_content}>
                <CardHeader title="Rutero" />
                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <DatePickerRange
                        value={dateFilter}
                        onChange={handleChangeDateFilter}
                    />
                    <ButtonSecondary
                        loading={loading}
                        tooltip=""
                        onClick={handleDownloadRouter}
                    >
                        Descargar Rutero
                    </ButtonSecondary>
                </Stack>
            </Card>
        </Box>
    );
}
