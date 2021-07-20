import * as React from 'react';
import { Typography } from '@material-ui/core'
import AsyncAutoComplete from '../../../components/AsyncAutoComplete';
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import genreHttp from '../../../util/http/genre-http';

import useHttpHandled from '../../../hooks/useHttpHandled';
import useCollectionManager from '../../../hooks/useCollectionManager';



interface GenreFieldProps {
    genres: any[],
    setGenres: (genres) => void
    
}

const GenreField: React.FC<GenreFieldProps> = (props) => {

    const { genres, setGenres } = props;
    const autocompleteHttp = useHttpHandled();
    
    
    const {addItem, removeItem} = useCollectionManager(genres, setGenres);

    

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
        ).then(data => data.data).catch(error => console.log(error));
    }

    return (

        <>

            <AsyncAutoComplete
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value)
                }}
                TextFieldsProps={{
                    label: 'Gêneros'
                }}
            />



            <GridSelected>
                
                    {genres.map((genre, key) => 
                        (<GridSelectedItem key={key} xs={12} onClick={() => { console.log('clicou'); }}>
                           
                             <Typography noWrap={true} >
                                    {genre.name}  1
                                </Typography> 
                        </GridSelectedItem>
                        ))}
                    
                

            </GridSelected>
            
        </>
    );
};


export default GenreField;