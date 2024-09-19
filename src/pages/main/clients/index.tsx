import { Box, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import { ElementType, SyntheticEvent, useState } from 'react';
import { ClientsNaturals } from '@templates/clients/naturals';
import { ClientsLegals } from '@templates/clients/legals';

export default function MainClients() {
    const [view, setView] = useState('0');

    const handleChangeView = (_: SyntheticEvent, value: string) => {
        setView(value);
    };

    return (
        <Box>
            <TabContext value={view}>
                <TabList
                    variant="fullWidth"
                    component={null as unknown as ElementType}
                    onChange={handleChangeView}
                    value={0}
                >
                    <Tab label="Naturales" value="0" />
                    <Tab label="Juridicos" value="1" />
                </TabList>
                <TabPanel value="0">
                    <ClientsNaturals />
                </TabPanel>
                <TabPanel value="1">
                    <ClientsLegals />
                </TabPanel>
            </TabContext>
        </Box>
    );
}
