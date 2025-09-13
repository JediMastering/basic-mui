export const permissions = [
  {
    id: '1',
    name: 'Página Principal',
    permissions: ['view'],
  },
  {
    id: '2',
    name: 'Usuários',
    permissions: ['view', 'edit', 'delete'],
    children: [
      {
        id: '3',
        name: 'Criar Usuário',
        permissions: ['view', 'edit'],
      },
      {
        id: '4',
        name: 'Deletar Usuário',
        permissions: ['view', 'delete'],
      },
    ],
  },
  {
    id: '5',
    name: 'Grupos de Acesso',
    permissions: ['view', 'edit', 'delete'],
  },
];
