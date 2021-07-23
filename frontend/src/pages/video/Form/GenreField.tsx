import * as React from 'react';
import {RefAttributes, useImperativeHandle,useRef, MutableRefObject} from "react";

import { FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core'
import AsyncAutocomplete, {AsyncAutocompleteComponent}  from '../../../components/AsyncAutoComplete';
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import genreHttp from '../../../util/http/genre-http';

import useHttpHandled from '../../../hooks/useHttpHandled';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { getGenresFromCategory } from '../../../util/model-filters';



interface GenreFieldProps {
    genres: any[],
    setGenres: (genres) => void
    categories: any[],
    setCategories: (categories) => void
    error: any
    disabled?: boolean;
    FormControlProps?: FormControlProps
}

export interface GenreFieldComponent {
    clear: () => void
}

const GenreField = React.forwardRef<GenreFieldComponent, GenreFieldProps>((props, ref) => {

    const { genres,
        setGenres,
        categories,
        setCategories,
        error,
        disabled } = props;
    const autocompleteHttp = useHttpHandled();


    const { addItem, removeItem } = useCollectionManager(genres, setGenres);
    const { removeItem: removeCategory } = useCollectionManager(categories, setCategories);
    const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;

    function fetchOptions(searchText) {
        return autocompleteHttp(

            genreHttp.list(
                {
                    queryParams: {
                        search: searchText,
                        all: ""
                    }
                }
            )
        ).then(data => data.data);
    }

    useImperativeHandle(ref, () => ({
        clear: () => autocompleteRef.current.clear()
    }));

    return (

        <>
            <AsyncAutocomplete
                ref={autocompleteRef}
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    // autoSelect: true,
                    getOptionSelected: (option, value) => option.id === value.id,
                    clearOnEscape: true,
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: disabled
                }}
                TextFieldsProps={{
                    label: 'Gêneros',
                    error: error !== undefined
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
                        genres.map((genre, key) =>
                        (<GridSelectedItem
                            key={key} xs={12}
                            onDelete={() => {
                                const categoriesWithOneGenre = categories
                                    .filter(category => {
                                        const genresFromCategory = getGenresFromCategory(genres, category);
                                        return genresFromCategory.length === 1 && genres[0].id == genre.id
                                    });

                                categoriesWithOneGenre.forEach(cat => removeCategory(cat));
                                removeItem(genre);
                            }}>
                            <Typography noWrap={true} >
                                {genre.name}
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
});


export default GenreField;