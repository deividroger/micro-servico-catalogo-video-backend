
import React, { useState, useEffect } from 'react';
import castMemberHttp from '../../util/http/cast-member-http'
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { BadgeYes, BadgeNo } from '../../components/Badge';
import { CastMember, ListResponse } from '../../util/models';

import { useSnackbar } from 'notistack';

import { MUIDataTableMeta } from 'mui-datatables';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import DefaultTable, { makeActionStyles, TableColumn } from '../../components/Table';
import { Link } from 'react-router-dom';

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

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
    },
    {
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span> {format(parseIso(value), 'dd/MM/yyyy')} </span>
            }
        }
    },
    {
        name: 'actions',
        label: 'Ações',
        width: '13%',
        options: {
            sort: false,
            customBodyRender: (value, tableMeta: MUIDataTableMeta) => {
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/cast-members/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon fontSize={'inherit'} />
                    </IconButton>
                )
            }
        }
    }
];

const Table = () => {

    const [data, setData] = useState < CastMember[] > ([]);
    const [loading, setLoading] = useState < boolean > (false);

    const snackBar = useSnackbar();

    useEffect(() => {

        let isSubscribed = true;

        (async () => {
            setLoading(true);

            try {
                if (isSubscribed) {
                    const { data } = await castMemberHttp.list < ListResponse < CastMember >> ();
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
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>

            <DefaultTable
                title=''
                columns={columnsDefinition}
                data={data}
                loading={loading}
                options={{ responsive: "scrollFullHeight" }}
            />

        </MuiThemeProvider>


    );
};
export default Table;