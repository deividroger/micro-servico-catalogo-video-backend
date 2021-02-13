
import React, { useState, useEffect  } from 'react';
import MUIDataTable, {MUIDataTableColumn} from 'mui-datatables'
import {httpVideo} from '../../util/http'
import { Chip } from '@material-ui/core';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';

const columnsDefinition:MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
    },
    {
        name: 'categories',
        label: 'Categorias',
        options: {
            customBodyRender(value,tableMeta,updateValue){

                return value.map(value =>value.name).join(', ');
            }
        }
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        options:{
            customBodyRender(value,tableMeta,updateValue){
                return value? <Chip label="Sim" color="primary" /> : <Chip label="Não" color="secondary" />
            }
        }
    },{
        name: 'created_at',
        label: 'Criado em',
        options:{
            customBodyRender(value,tableMeta,updateValue){
                return <span> {  format( parseIso(value),'dd/MM/yyyy') } </span>
            }
        }
    }
];


type Props = {
    
};
 const Table = (props: Props) => {
    
    const[data,setData] = useState([]);


    useEffect(() => {
        httpVideo.get('genres').then(
            response => setData(  response.data.data)
        )
    },[]);
    
    return (
        <MUIDataTable 
        title=''
        columns={columnsDefinition} data={data} />
        
        
    );
};
export default Table;