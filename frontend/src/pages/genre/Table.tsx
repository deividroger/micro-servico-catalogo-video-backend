
import React, { useState, useEffect  } from 'react';
import MUIDataTable, {MUIDataTableColumn} from 'mui-datatables'
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import genreHttp from '../../util/http/genre-http';
import { BadgeYes,BadgeNo } from '../../components/Badge';

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
                return value? <BadgeYes/> : <BadgeNo/>
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

        (async () => {
            const {data} = await genreHttp.list();
            setData(data.data);
        })();

    },[]);
    
    return (
        <MUIDataTable 
        title=''
        columns={columnsDefinition} data={data} />
        
        
    );
};
export default Table;