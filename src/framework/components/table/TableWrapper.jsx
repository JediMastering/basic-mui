import { Box } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export const TableWrapper = ({ children }) => {
    return (
        <Box
            sx={{
                flex: 1,
                height: '100%',
                minHeight: 0, // importante para o flex funcionar certo
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    padding: 2, // padding interno
                    maxHeight: '100%', // respeitar o espaço disponível
                    maxWidth: '100%',
                }}
            >
                <TableContainer component={Paper}>
                    {children}
                </TableContainer>
            </Box>
        </Box>
    );
};