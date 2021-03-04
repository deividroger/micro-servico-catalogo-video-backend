import  * as React  from 'react';
import {useState} from 'react'
import useForm from 'react-hook-form';
import { useEffect } from 'react';
import { Box,  makeStyles,  TextField, Theme,Button, MenuItem } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import categoryHttp from '../../util/http/category-http';
import genreHttp from '../../util/http/genre-http';


const usestyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

export const Form = () => {

    const classes = usestyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: "outlined",
        color:"secondary"
    };

    const [categories,setCategories] = useState<any[]>([]);
    const { register, handleSubmit, getValues, setValue,watch } = useForm({
        defaultValues: {
            categories_id: [] as any
        }
    });

//    const category = getValues()['categories_id'];


    useEffect(() => {
        register({ name: "categories_id" })

    }, [register]);

    useEffect( ()=>{
        categoryHttp
            .list()
            .then(({data}) => setCategories(data.data))
            
    },[]);

    function onSubmit(formData, event) {
        genreHttp
            .create(formData)
            .then((response)=> console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register}
            />

            <TextField
                select
                name="categories_id"
                value={watch('categories_id')}
                label='Categorias'
                margin={'normal'}
                variant={'outlined'}                
                fullWidth
                onChange={(e)=>{
                    setValue('categories_id',e.target.value);
                }}
                
                SelectProps = {{  multiple:true}}
                >
                <MenuItem value="" disabled>
                    <em>Selecione categorias</em>
                </MenuItem>
                    {
                        categories.map(
                            (category,key) => (
                            <MenuItem key={key} value={category.id} >{category.name}</MenuItem>
                            )
                        )
                    }

                </TextField>


            <Box dir={"rtl"}>
                <Button {...buttonProps} onChange={() => onSubmit(getValues(), null)}>Salvar </Button>
                <Button {...buttonProps} type="submit" >Salvar e continuar editando </Button>
            </Box>

        </form>
    );

}