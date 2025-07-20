import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  Paper,
  Skeleton,
  Box,
  Typography,
} from 'framework/mui';

import { requestBackend } from '../../utils/connections';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Text from '../../../framework/components/fields/Text';

const SmartTable = forwardRef(({
  data: externalData,
  columns,
  url,
  rowKey,
  page: externalPage,
  externalPageSize,
  total: externalTotal,
  onPageChange: externalOnPageChange,
  onRowSelect,
  selectedRows = [],
  selectable = false,
  onSortChange: externalOnSortChange,
  sortColumn: externalSortColumn,
  sortDirection: externalSortDirection = 'asc',
  loading: externalLoading = false,
  emptyMessage = 'Nenhum dado encontrado',
  actions,
}, ref) => {
  // Estados internos
  const [pageData, setPageData] = useState(
    { content: externalData || [], number: externalPage || 0, size: externalPageSize || 10, totalElements: externalTotal || 0 }
  );
  const [page, setPage] = useState(externalPage || 0);
  const [pageSize] = useState(externalPageSize || 50);
  const [sortColumn, setSortColumn] = useState(externalSortColumn || null);
  const [sortDirection, setSortDirection] = useState(externalSortDirection);
  const [loading, setLoading] = useState(externalLoading);

  const getData = async (url) => {
    onRowSelect([], []);
    return await requestBackend(url);
  };

  // Dados a serem exibidos
  const data = externalData || pageData.content || [];
  const total = externalTotal || pageData.totalElements || 0;

  // Função para buscar dados
  const fetchData = async (pageNum, sortCol, sortDir) => {
    if (!url) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        size: pageSize,
        ...(sortCol && sortDir ? { sort: `${sortCol},${sortDir}` } : {}),
      });
      const fullUrl = `${url}?${params.toString()}`;
      const response = await getData(fullUrl);

      setPageData({
        content: response.content || [],
        number: response.number || pageNum,
        size: response.size || pageSize,
        totalElements: response.totalElements || 0,
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setPageData({ content: [], number: pageNum, size: pageSize, totalElements: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados na montagem inicial e quando page, sortColumn ou sortDirection mudarem
  useEffect(() => {
    if (url && !externalData) {
      fetchData(page, sortColumn, sortDirection);
    }
  }, [page, sortColumn, sortDirection, url, externalData, pageSize]);

  const isSelected = (row) => selectedRows.includes(rowKey(row));

  const handleSelectAll = (event) => {
    if (!onRowSelect) return;

    if (event.target.checked) {
      const newSelected = data.map((row) => rowKey(row));
      const selectedData = data;
      onRowSelect(selectedData, newSelected);
    } else {
      onRowSelect([], []);
    }
  };

  const handleSelectRow = (row) => {
    if (!onRowSelect) return;

    const key = rowKey(row);
    const selectedIndex = selectedRows.indexOf(key);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, key];
    } else {
      newSelected = selectedRows.filter((id) => id !== key);
    }

    const selectedData = data.filter((row) => newSelected.includes(rowKey(row)));
    onRowSelect(selectedData, newSelected);
  };

  const handleSort = (col) => {
    if (!col.sortable) return;
    const colKey = typeof col.field === 'string' ? col.field : col.columnName;
    const isAsc = sortColumn === colKey && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';

    setSortColumn(colKey);
    setSortDirection(newDirection);

    if (externalOnSortChange) {
      externalOnSortChange(colKey, newDirection);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (externalOnPageChange) {
      externalOnPageChange(newPage);
    }
  };

  const renderCell = (col, row) => {
    if (typeof col.field === 'function') {
      return col.field(row);
    }
    return <Text value={row[col.field]} />;
  };

  // Expondo o método de recarga para o componente pai
  useImperativeHandle(ref, () => ({
    reload: () => {
      fetchData(page, sortColumn, sortDirection);
    }
  }));

  return (
    <Paper elevation={3} sx={{ width: '100%' }}>
      {actions && <Box p={2}>{actions}</Box>}
      <TableContainer sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    disabled={loading || data.length === 0}
                  />
                </TableCell>
              )}
              {columns.map((col, index) => {
                const colKey = typeof col.field === 'string' ? col.field : col.columnName;
                return (
                  <TableCell
                    key={index}
                    align={col.align || 'left'}
                    sortDirection={sortColumn === colKey ? sortDirection : false}
                    onClick={() => handleSort(col)}
                    sx={{
                      cursor: col.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      fontWeight: 'bold',
                      backgroundColor: 'background.paper',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {col.sortable && sortColumn === colKey && (
                        sortDirection === 'asc' ? (
                          <KeyboardArrowUp sx={{ fontSize: '16px', padding: 0 }} />
                        ) : (
                          <KeyboardArrowDown sx={{ fontSize: '16px', padding: 0 }} />
                        )
                      )}
                      {col.label}
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={24} height={24} />
                    </TableCell>
                  )}
                  {columns.map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={rowKey(row)} hover selected={isSelected(row)} onClick={()=> handleSelectRow(row)}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected(row)} onChange={() => handleSelectRow(row)} />
                    </TableCell>
                  )}
                  {columns.map((col, i) => (
                    <TableCell key={i} align={col.align || 'left'} style={{padding:0}}>
                      {renderCell(col, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(e, newPage) => handlePageChange(newPage)}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
      />
    </Paper>
  );
});

export default SmartTable;