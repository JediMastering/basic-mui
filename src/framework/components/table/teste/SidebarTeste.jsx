import { Box } from '@mui/material';

export default ({ content }) => {
  return (<>
    {/* Coluna da esquerda */}
    <Box
      sx={{
        width: '200px',
        height: '100%',
        backgroundColor: 'green',
        color: 'white',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      Coluna Esquerda
      {/* Conteúdo de exemplo para testar rolagem */}
      {Array.from({ length: 200 }).map((_, i) => (
        <div key={i}>Item {i + 1}</div>
      ))}
    </Box>

    {/* Coluna da direita */}
    <Box
      sx={{
        flex: 1,
        height: '100%',
        backgroundColor: 'red',
        color: 'white',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Renderiza content como função ou ReactNode */}
      {typeof content === 'function' ? content() : content || <div>Conteúdo padrão</div>}
    </Box>
  </>
  );
};
