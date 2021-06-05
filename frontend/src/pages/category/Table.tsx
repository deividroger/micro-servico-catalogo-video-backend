
import React, { useState, useEffect, useRef, useReducer } from 'react';

import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
import { BadgeYes, BadgeNo } from '../../components/Badge';

import { Category, ListResponse } from '../../util/models';

import DefaultTable, { makeActionStyles, TableColumn } from '../../components/Table';

import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider } from '@material-ui/core';

import { Link } from 'react-router-dom';
import { MUIDataTableMeta } from 'mui-datatables';
import EditIcon from '@material-ui/icons/Edit';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import { Creators } from '../../store/filter';
import useFilter from '../../hooks/useFilter';


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
        width: '13%',
        options: {
            sort: false,
            customBodyRender: (value, tableMeta: MUIDataTableMeta) => {
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/categories/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon fontSize={'inherit'} />
                    </IconButton>
                )
            }
        }
    }
];

const debouncedTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

const Table = () => {

    const snackBar = useSnackbar();
    const subscribed = useRef(true);

    const [data, setData] = useState < Category[] > ([]);
    const [loading, setLoading] = useState < boolean > (false);
    const {
        columns,
        filterManager,
        filterState,
        deboucedFilterState,
        dispatch,
        totalRecords,
        setTotalRecords
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: debouncedTime,
        rowsPerPage: rowsPerPage,
        rowsPerPageOptions: rowsPerPageOptions
    });

    

    useEffect(() => {
        subscribed.current = true;
        filterManager.pushHistory();
        getData();
        return () => {
            subscribed.current = false;
        };

    }, [
        filterManager.cleanSearchText(deboucedFilterState.search),
        deboucedFilterState.pagination.page,
        deboucedFilterState.pagination.per_page,
        deboucedFilterState.order
    ]);

    async function getData() {

        setLoading(true);

        try {
            const { data } = await categoryHttp.list < ListResponse < Category >> ({
                queryParams: {
                    search: filterManager.cleanSearchText(filterState.search),
                    page: filterState.pagination.page,
                    per_page: filterState.pagination.per_page,
                    sort: filterState.order.sort,
                    dir: filterState.order.dir,
                }
            });

            if (subscribed.current) {
                setData(data.data);
                setTotalRecords(data.meta.total);
            }

        } catch (error) {
            console.error(error);

            if (categoryHttp.isCacelledRequest(error)) {
                return;
            }

            snackBar.enqueueSnackbar("Não foi possível carregar as informações", {
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }

    }



    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>

            <DefaultTable
                title=''
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={debouncedSearchTime}
                options={
                    {
                        serverSide: true,
                        responsive: "scrollFullHeight",
                        searchText: filterState.search as any,
                        page: filterState.pagination.page - 1,
                        rowsPerPage: filterState.pagination.per_page,
                        rowsPerPageOptions: rowsPerPageOptions,
                        count: totalRecords,
                        customToolbar: () => (
                            <FilterResetButton handleClick={() => dispatch(Creators.setReset())
                            } />
                        ),
                        onSearchChange: (value) => filterManager.changeSearch(value),
                        onChangePage: (page) => filterManager.changePage(page),
                        onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
                        onColumnSortChange: (changedColumn, direction) =>
                            filterManager.changeColumnSort(changedColumn, direction)

                    }}
            />

        </MuiThemeProvider>

    );
};
export default Table;