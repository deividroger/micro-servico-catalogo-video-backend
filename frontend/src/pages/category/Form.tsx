import * as React from 'react'
import { TextField, Checkbox, Box, Button, makeStyles, Theme } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import useForm from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        variant: "outlined",
        size: "medium",
        className: classes.submit

    };

    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            is_active: true
        }
    });

    function onSubmit(formData, event) {

        categoryHttp
            .create(formData)
            .then((response) => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} >

            <TextField
                inputRef={register}
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
            />

            <TextField
                inputRef={register}
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
            />

            <Checkbox
                inputRef={register}
                name="is_active"
                defaultChecked
            />
            Ativo?

            <Box dir={"rtl"}>

                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}  > Salvar</Button>
                <Button {...buttonProps} type={"submit"} >Salvar e continuar editando</Button>

            </Box>
        </form>

    );
};