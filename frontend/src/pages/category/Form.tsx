import * as React from 'react'
import { useEffect, useState,useContext } from 'react'
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core'

import {useForm} from "react-hook-form";
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup'
import { useHistory, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { Category } from '../../util/models';
import SubmmitActions from '../../components/SubmmitActions';
import { DefaultForm } from '../../components/DefaultForm'
import LoadingContext from '../../components/loading/LoadingContext';


const validationSchema = yup.object().shape({
    name: yup
        .string()
        .label("Nome")
        .required()
        .max(255)

});

export const Form = () => {

    const { register, handleSubmit, getValues, setValue, errors, reset, watch, triggerValidation } = useForm<{
        name,is_active
    }>({

        validationSchema: validationSchema,
        defaultValues: {
            is_active: true
        }
    });

    const snackBar = useSnackbar();
    const { id }: any = useParams();
    const history = useHistory();
    const [category, setCategory] = useState < Category | null > (null);
    
    const loading = useContext(LoadingContext);

    useEffect(() => {

        let isSubscribed = true;

        if (!id) {
            return;
        };

        if (isSubscribed) {

            (async () => {
                
                try {
                    const { data } = await categoryHttp.get(id);
                    setCategory(data.data)
                    reset(data.data);
                } catch (error) {
                    console.error(error);
                    snackBar.enqueueSnackbar("Não foi possível carregar as informações", {
                        variant: 'error'
                    });
                } 
            })();
        }

        return () => {
            isSubscribed = false;
        };

    }, []);


    useEffect(() => {
        register({ name: 'is_active' })

    }, [register])

    async function onSubmit(formData, event) {

        try {
            const http = !category
                ? categoryHttp.create(formData)
                : categoryHttp.update(category.id, formData);

            const { data } = await http;
            snackBar.enqueueSnackbar("Categoria salva com sucesso", {
                variant: 'success'
            });

            setTimeout(() => {

                event ? (
                    id ?
                        history.replace(`/categories/${data.data.id}/edit`)
                        :
                        history.push(`/categories/${data.data.id}/edit`)
                ) : history.push('/categories')
            });

        } catch (error) {
            console.error(error);
            snackBar.enqueueSnackbar("Não foi possível salvar a categoria", {
                variant: 'error'
            });
        } 
    }
    

    return (

        <DefaultForm onSubmit={handleSubmit(onSubmit)}>

            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register}
                disabled={loading}
                error={errors.name !== undefined}
                helperText={errors.name && errors.name?.message}
                InputLabelProps={{ shrink: true }}

            />

            <TextField
                inputRef={register}
                disabled={loading}
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
                InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        color={"primary"}
                        name="is_active"
                        onChange={
                            () => setValue('is_active', !getValues()['is_active'])
                        }
                        checked={watch('is_active') as boolean}
                    />
                }
                label={"Ativo?"}
                labelPlacement={'end'}
                disabled={loading}
            />

            <SubmmitActions disabledButtons={loading} handleSave={() => triggerValidation().then(isvalid => { isvalid && onSubmit(getValues(), null) })} />

        </DefaultForm>
    );
};

