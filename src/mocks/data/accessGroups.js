export const accessGroups = [
  {
    id: 1,
    name: 'Administrador',
    permissions: {
      '1': { view: true },
      '2': { view: true, edit: true, delete: true },
      '3': { view: true, edit: true },
      '4': { view: true, delete: true },
      '5': { view: true, edit: true, delete: true },
    },
  },
  {
    id: 2,
    name: 'Usuário Padrão',
    permissions: {
      '1': { view: true },
      '2': { view: true, edit: false, delete: false },
      '3': { view: true, edit: false },
      '4': { view: false, delete: false },
      '5': { view: false, edit: false, delete: false },
    },
  },
];
