import * as React from 'react';
import useForm from 'react-hook-form';
import castMember from '../../util/http/cast-member-http';
import { useEffect } from 'react';
import { Box, FormControl, FormLabel, makeStyles, Radio, TextField, Theme, RadioGroup, FormControlLabel, Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

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
        variant: "outlined"
    };



    const { register, handleSubmit, getValues, setValue } = useForm();


    useEffect(() => {
        register({ name: "type" })

    }, [register]);

    function onSubmit(formData, event) {
        castMember
            .create(formData)
            .then((response) => console.log(response));
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

            <FormControl margin={"normal"}  >
                <FormLabel component="legend" >Tipo</FormLabel>
                <RadioGroup
                    name="type"
                    onChange={(e) => {
                        setValue("type", parseInt(e.target.value));
                    }}>

                    <FormControlLabel value="1" control={<Radio />} label="Diretor" />
                    <FormControlLabel value="2" control={<Radio />} label="Ator" />
                </RadioGroup>
            </FormControl>

            <Box dir={"rtl"}>
                <Button {...buttonProps} onChange={() => onSubmit(getValues(), null)}>Salvar </Button>
                <Button {...buttonProps} type="submit" >Salvar e continuar editando </Button>
            </Box>

        </form>
    );

}