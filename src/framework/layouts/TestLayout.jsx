import { Box } from 'framework/mui';
import React from 'react';

export default (props) => {
    const { children } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100vw', // Ocupa toda a largura da janela
                height: '100vh', // Garante que o layout ocupe a tela inteira
                overflow: 'hidden', // Evita barras de rolagem no contêiner principal
            }}
        >
            {/* Box superior fixo */}
            <Box
                sx={{
                    position: 'fixed', // Fixa no topo
                    top: 0,
                    left: 0,
                    width: '100vw', // 100% da largura
                    height: '100px', // Altura fixa
                    backgroundColor: 'blue',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000, // Garante que fique acima das colunas
                }}
            >
                Box Superior
            </Box>

            {/* Contêiner das colunas */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '100px', // Compensa a altura do Box superior fixo
                    height: 'calc(100vh - 100px)', // Altura restante
                    width: '100vw',
                }}
            >
                {/* Coluna da esquerda */}
                {props.children}
            </Box>
        </Box>
    );
};