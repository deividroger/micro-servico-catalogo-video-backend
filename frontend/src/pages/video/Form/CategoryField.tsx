import * as React from 'react';
import {Typography} from '@material-ui/core'
import AsyncAutoComplete from '../../../components/AsyncAutoComplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import genreHttp from '../../../util/http/genre-http';

import useHttpHandled from '../../../hooks/useHttpHandled';

interface CategoryFieldProps {

}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {

    const autocompleteHttp = useHttpHandled();

    const fetchOptions = (searchText) => autocompleteHttp(
        genreHttp.list(
            {
                queryParams: {
                    search: searchText,
                    all: ""
                }
            }
        )
    ).then(data => data.data).catch(error => console.log(error));

    return (

        <>

            <AsyncAutoComplete
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    freeSolo: true,
                    getOptionLabel: option => option.name
                }}
                TextFieldsProps={{
                    label: 'Categorias'
                }}
            />

            <GridSelected>
                <GridSelectedItem xs={6} onClick={() => {
                    console.log('clicou');
                }}>
                    <Typography noWrap={true}>
                        Categorias
                    </Typography>

                </GridSelectedItem>
            </GridSelected>

        </>
    );
};


export default CategoryField;