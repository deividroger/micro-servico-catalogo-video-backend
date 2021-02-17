
import React, { useState, useEffect  } from 'react';
import MUIDataTable, {MUIDataTableColumn} from 'mui-datatables'
import { Chip } from '@material-ui/core';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
const columnsDefinition:MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
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

interface Category {
    id: string;
    name: string;
}

type Props = {
    
};
 const Table = (props: Props) => {
    
    const[data,setData] = useState<Category[]>([]);

    useEffect(() => {
        categoryHttp
        .list<{ data: Category[] }>()
        .then(({data}) => setData(data.data) 
        );

    },[]);
    
    return (
        <MUIDataTable 
        title=''
        columns={columnsDefinition} data={data} />
        
        
    );
};
export default Table;