
import React, { useState, useEffect } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import castMemberHttp from '../../util/http/cast-member-http'
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { BadgeYes, BadgeNo } from '../../components/Badge';


const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
    },
    {
        name: 'type',
        label: 'Tipo',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return CastMemberTypeMap[value];
            }
        }
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes /> : <BadgeNo />
            }
        }
    }, {
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span> {format(parseIso(value), 'dd/MM/yyyy')} </span>
            }
        }
    }
];

type Props = {

};
const Table = (props: Props) => {

    const [data, setData] = useState([]);

    useEffect(() => {

        let isSubscribed = true;
        
        (async () => {

            if(isSubscribed){
            const { data } = await castMemberHttp.list();
            setData(data.data);
        }

        })();

        return () => {
            isSubscribed = false;
        };

    }, []);

    return (
        <MUIDataTable
            title=''
            columns={columnsDefinition} data={data} />


    );
};
export default Table;