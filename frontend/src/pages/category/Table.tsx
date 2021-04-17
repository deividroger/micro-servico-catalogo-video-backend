
import React, { useState, useEffect } from 'react';

import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
import { BadgeYes, BadgeNo } from '../../components/Badge';

import { Category, ListResponse } from '../../util/models';

import DefaultTable, { TableColumn } from '../../components/Table';

import { useSnackbar } from 'notistack';


const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        width: '30%',
        options: {
            sort: false,
        }
    },
    {
        name: 'name',
        label: 'Nome',
        width: '43%'
    },

    {
        name: 'is_active',
        label: 'Ativo?',
        width: '4%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes /> : <BadgeNo />
            }
        }
    }, {
        name: 'created_at',
        label: 'Criado em',
        width: '10%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span> {format(parseIso(value), 'dd/MM/yyyy')} </span>
            }
        }
    },
    {
        name: 'actions',
        label: 'Ações',
        width: '13%'
    }
];

const Table = () => {

    const [data, setData] = useState < Category[] > ([]);
    const [loading, setLoading] = useState < boolean > (false);

    const snackBar = useSnackbar();

    useEffect(() => {
        let isSubscribed = true;

        (async () => {
            setLoading(true);
            try {
                if (isSubscribed) {

                    const { data } = await categoryHttp.list < ListResponse < Category >> ();

                    setData(data.data);
                }
            } catch (error) {
                console.error(error);
                snackBar.enqueueSnackbar("Não foi possível carregar as informações", {
                    variant: 'error'
                });
            } finally {
                setLoading(false);
            }

        })();
        return () => {
            isSubscribed = false;
        };
    }, []);

    return (
        <DefaultTable
            title=''
            columns={columnsDefinition} data={data} loading={loading} />


    );
};
export default Table;