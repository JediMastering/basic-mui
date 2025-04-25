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
} from '@mui/material';

function SmartTable({
  data,
  columns,
  rowKey,
  page,
  pageSize,
  total,
  onPageChange,
  onRowSelect,
  selectable = false,
  onSortChange,
  loading = false,
  emptyMessage = 'Nenhum dado encontrado',
  actions,
}) {
  const [selected, setSelected] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const isSelected = (row) => selected.includes(rowKey(row));

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = data.map(row => rowKey(row));
      setSelected(newSelected);
      if (onRowSelect) onRowSelect(data);
    } else {
      setSelected([]);
      if (onRowSelect) onRowSelect([]);
    }
  };

  const handleSelectRow = (row) => {
    const key = rowKey(row);
    const selectedIndex = selected.indexOf(key);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, key];
    } else {
      newSelected = selected.filter(id => id !== key);
    }

    setSelected(newSelected);
    if (onRowSelect) {
      const selectedRows = data.filter(row => newSelected.includes(rowKey(row)));
      onRowSelect(selectedRows);
    }
  };

  const handleSort = (col) => {
    if (!col.sortable) return;
    const colKey = typeof col.field === 'string' ? col.field : col.label;
    const isAsc = sortColumn === colKey && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setSortColumn(colKey);
    setSortDirection(newDirection);
    if (onSortChange) onSortChange(colKey, newDirection);
  };

  const renderCell = (col, row) => {
    if (typeof col.field === 'function') {
      return col.field(row);
    }
    return row[col.field];
  };

  useEffect(() => {
    if (!selectable) setSelected([]);
  }, [data]);

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
                    checked={selected.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    disabled={loading || data.length === 0}
                  />
                </TableCell>
              )}
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  align={col.align || 'left'}
                  sortDirection={sortColumn === (typeof col.field === 'string' ? col.field : col.label) ? sortDirection : false}
                  onClick={() => handleSort(col)}
                  sx={{
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  {col.label}
                  {col.sortable && sortColumn === (typeof col.field === 'string' ? col.field : col.label) && (
                    sortDirection === 'asc' ? ' 🔼' : ' 🔽'
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => (
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
              : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {emptyMessage}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow
                      key={rowKey(row)}
                      hover
                      selected={isSelected(row)}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected(row)}
                            onChange={() => handleSelectRow(row)}
                          />
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
        onPageChange={(e, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
      />
    </Paper>
  );
}

export default SmartTable;
