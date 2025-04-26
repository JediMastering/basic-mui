import React, { useState, useEffect } from 'react';
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
  Button,
} from '@mui/material';

import { requestBackend } from '../../utils/connections';

// Mock de dados interno
const mockSpringResponse = {
  content: [
    { id: '1', nome: 'João Silva', email: 'joao@email.com', idade: 30 },
    { id: '2', nome: 'Maria Oliveira', email: 'maria@email.com', idade: 25 },
    { id: '3', nome: 'Carlos Souza', email: 'carlos@email.com', idade: 28 },
  ],
  totalElements: 50,
  totalPages: 10,
  size: 5,
  number: 0,
  sort: {},
  first: true,
  last: false,
  numberOfElements: 3,
  empty: false,
};

function SmartTable({
  data: externalData,
  columns,
  url,
  rowKey,
  page: externalPage,
  pageSize: externalPageSize,
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
  useMock = false,
}) {
  // Estados internos
  const [pageData, setPageData] = useState(
    useMock
      ? mockSpringResponse
      : { content: externalData || [], number: externalPage || 0, size: externalPageSize || 50, totalElements: externalTotal || 0 }
  );
  const [page, setPage] = useState(useMock ? mockSpringResponse.number : externalPage || 0);
  const [pageSize] = useState(useMock ? mockSpringResponse.size : externalPageSize || 50);
  const [sortColumn, setSortColumn] = useState(useMock ? null : externalSortColumn || null);
  const [sortDirection, setSortDirection] = useState(useMock ? 'asc' : externalSortDirection);
  const [loading, setLoading] = useState(externalLoading);

  const getData = async (url) => {
    onRowSelect([], [])
    return await requestBackend(url);
  };

  // Dados a serem exibidos
  const data = useMock ? pageData.content : externalData || pageData.content || [];
  const total = useMock ? pageData.totalElements : externalTotal || pageData.totalElements || 0;

  // Função para buscar dados
  const fetchData = async (pageNum, sortCol, sortDir) => {
    if (useMock || !url) return;

    setLoading(true);
    try {
      // Construir a URL com parâmetros de paginação e ordenação
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
    if (!useMock && url && !externalData) {
      fetchData(page, sortColumn, sortDirection);
    }
  }, [page, sortColumn, sortDirection, url, useMock, externalData, pageSize]);

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
    const colKey = typeof col.field === 'string' ? col.field : col.label;
    const isAsc = sortColumn === colKey && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';

    setSortColumn(colKey);
    setSortDirection(newDirection);

    if (externalOnSortChange) {
      externalOnSortChange(colKey, newDirection);
    } else if (useMock) {
      console.log(`Ordenado por ${colKey} em ordem ${newDirection}`);
      // Aqui você pode adicionar lógica para reordenar o mock, se necessário
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (useMock) {
      setPageData({ ...mockSpringResponse, number: newPage });
      console.log('Nova página requisitada:', newPage);
    }
    if (externalOnPageChange) {
      externalOnPageChange(newPage);
    }
  };

  const renderCell = (col, row) => {
    if (typeof col.field === 'function') {
      return col.field(row);
    }
    return row[col.field];
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', overflowX: 'auto' }}>
      {actions && <Box p={2}>{actions}</Box>}
      <TableContainer>
        <Table>
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
                const colKey = typeof col.field === 'string' ? col.field : col.label;
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
                    }}
                  >
                    {col.label}
                    {col.sortable && sortColumn === colKey && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
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
                <TableRow key={rowKey(row)} hover selected={isSelected(row)}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected(row)} onChange={() => handleSelectRow(row)} />
                    </TableCell>
                  )}
                  {columns.map((col, i) => (
                    <TableCell key={i} align={col.align || 'left'}>
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
}

export default SmartTable;