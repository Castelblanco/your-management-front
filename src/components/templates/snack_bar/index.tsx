import { Snackbar } from '@mui/material';
import { useSnackbar } from '@storages/zustand/snackbar';
import Slide from '@mui/material/Slide';
import { IconButton } from '@atoms/icon_button';
import { IconClose } from '@atoms/icons/close';

export const SnackBar = () => {
    const { message, open, setClose } = useSnackbar();
    return (
        <Snackbar
            open={open}
            message={message}
            onClose={setClose}
            autoHideDuration={5000}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
            }}
            action={
                <>
                    <IconButton onClick={setClose} color="primary">
                        <IconClose />
                    </IconButton>
                </>
            }
            TransitionComponent={Slide}
        />
    );
};
