import * as React from 'react';
import { Box, Fab } from '@material-ui/core';
import { Page } from '../../components/Page';
import {Link} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add'
import Table from './Table'
const PageList = () => {
    return (
     <Page title='Listagem de gêneros'>
         <Box dir='rtl' paddingBottom={2}>
            <Fab
                title="Adicionar Genero"
                color={'secondary'}
                size="small"
                component={Link}
                to='/genres/create'
            >
                <AddIcon/>
            </Fab>
         </Box>
         <Box>
             <Table />
         </Box>
     </Page>
    );
};

export default PageList;