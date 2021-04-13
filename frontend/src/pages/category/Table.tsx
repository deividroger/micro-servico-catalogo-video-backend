
import React, { useState, useEffect } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'

import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
import { BadgeYes, BadgeNo } from '../../components/Badge';

import {Category, ListResponse} from '../../util/models';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
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

const Table = () => {

    const [data, setData] = useState < Category[]> ([]);

    useEffect(() => {
        let isSubscribed = true;

        (async () => {
            
            if (isSubscribed) {
                const { data } = await categoryHttp.list<ListResponse<Category>>();
                
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