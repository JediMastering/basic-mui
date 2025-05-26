import React from 'react';
import CrudTable from '../../framework/components/table/CrudTable';
import UserForm from './UserForm';
import Number from '../../framework/components/fields/Number';

const UsersPage = () => {
  const columns = [
    {
      label: 'Identificador',
      field: (row) => <Number value={row.id} />,
      sortable: true,
      columnName: 'id',
    },
    {
      label: 'ATP',
      field: 'name',
      sortable: true,
    },
    {
      label: 'Status 3ª',
      field: 'email',
      sortable: true,
    }
  ];

  return (
    <CrudTable
      columns={columns}
      url="api/users"
      title="Usuários"
      EditForm={UserForm}
    />
  );
};

export default UsersPage; 