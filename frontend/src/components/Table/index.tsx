import * as React from 'react';

import MUIDataTable, { MUIDataTableOptions, MUIDataTableProps, MUIDataTableColumn } from 'mui-datatables';
import  { merge, omit, cloneDeep } from 'lodash';
import { MuiThemeProvider, Theme, useMediaQuery, useTheme } from '@material-ui/core';

export interface TableColumn extends MUIDataTableColumn {
    width?: string;
}

const defaultOptions: MUIDataTableOptions = {
    print: false,
    download: false,
    textLabels: {
        body: {
            noMatch: "Nenhum registro encontrado",
            toolTip: "Classificar"
        },
        pagination: {
            next: "Próxima página",
            previous: "Página anterior",
            rowsPerPage: "Por página",
            displayRows: "de"
        },
        toolbar: {
            search: "Busca",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Ver colunas",
            filterTable: "Filtrar Tabelas"
        },
        filter: {
            all: "Todos",
            title: "Filtros",
            reset: "LIMPAR"
        },
        viewColumns: {
            title: "Ver colunas",
            titleAria: "Ver/Esconder Colunas da Tabela",
        },
        selectedRows: {
            text: "registro(s) selecionados",
            delete: "Excluir",
            deleteAria: "Excluir registros selecionados"
        }
    }
};

interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
    loading?: boolean;
}

const Table: React.FC<TableProps> = (props) => {

    function extractMuiDataTableColumns(columns: TableColumn[]): MUIDataTableColumn[] {

        setColumnsWith(columns);

        return columns.map(column => omit(column, 'width'));
    }

    function setColumnsWith(column: TableColumn[]) {

        column.forEach((column, key) => {
            if (column.width) {

                const overrides = theme.overrides as any;
                overrides.MUIDataTableHeadCell.fixedHeader[`&:nth-child(${key + 2})`] = {
                    width: column.width
                }
            }

        });
    }

    function applyResponsive(){
        newProps.options.responsive = isSmOrDown ? 'scrollMaxHeight' : 'stacked';
    }

    function applyLoading() {
        const textLabels = (newProps.options as any).textLabels;

        textLabels.body.noMatch = newProps.loading === true ?
            'Carregando...' :
            textLabels.body.noMatch;
    }

    function getOriginalMuiDataTableProps() {
        return omit(newProps, 'loading');
    }


    const theme = cloneDeep < Theme > (useTheme());
    
    const isSmOrDown = useMediaQuery(theme.breakpoints.down('sm'));


    const newProps = merge(
        { options: cloneDeep( defaultOptions) }
        , props,
        { columns: extractMuiDataTableColumns(props.columns) }
    );

    applyLoading();
    applyResponsive();

    const originalProps = getOriginalMuiDataTableProps();

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable {...originalProps} />
        </MuiThemeProvider>
    );
};

export default Table;