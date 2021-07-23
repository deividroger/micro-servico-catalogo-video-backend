import * as React from 'react';
import { FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core'
import AsyncAutoComplete from '../../../components/AsyncAutoComplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';

import useHttpHandled from '../../../hooks/useHttpHandled';
import useCollectionManager from '../../../hooks/useCollectionManager';
import categoryHttp from '../../../util/http/category-http';
import { Genre } from '../../../util/models';

interface CategoryFieldProps {
    categories: any[],
    setCategories: (categories) => void
    genres: Genre[],
    error: any,
    disabled?: boolean,
    FormControlProps?: FormControlProps;
}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {

    const { categories, setCategories, genres, error, disabled } = props;

    const autocompleteHttp = useHttpHandled();

    const { addItem, removeItem } = useCollectionManager(categories, setCategories);

    function fetchOptions(searchText) {

        return autocompleteHttp(

            categoryHttp.list(
                {
                    queryParams: {
                        genres: genres.map(genre => genre.id).join(','),
                        all: ""
                    }
                }
            )
        ).then(data => data.data);
    }

    return (
        <>
            <AsyncAutoComplete
                fetchOptions={fetchOptions}
                
                AutocompleteProps={{
                    // autoSelect: true,
                    getOptionSelected: (option, value) => option.id === value.id,
                    clearOnEscape: true,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: disabled ===true || !genres.length,
                    
                }}
                TextFieldsProps={{
                    label: 'Categorias',
                    error: error !== undefined,
                    
                }}
            />

            <FormControl
                error={error !== undefined}
                disabled={disabled === true}
                {...props.FormControlProps}
                fullWidth
                margin={"normal"}
            >
                <GridSelected>
                    {
                        categories.map((category, key) =>
                        (<GridSelectedItem key={key} xs={12} onClick={() => { console.log('clicou'); }}>

                            <Typography noWrap={true} >
                                {category.name}
                            </Typography>
                        </GridSelectedItem>
                        ))
                    }
                </GridSelected>


                {
                    error && <FormHelperText> {error.message} </FormHelperText>

                }

            </FormControl>

        </>
    );
};


export default CategoryField;