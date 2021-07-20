import * as React from 'react';
import {useForm} from "react-hook-form";
import castMemberHttp from '../../util/http/cast-member-http';
import { useEffect, useState } from 'react'
import { FormControl, FormLabel, Radio, TextField, RadioGroup, FormControlLabel, FormHelperText } from '@material-ui/core';
import * as yup from '../../util/vendor/yup'
import { useHistory, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { CastMember } from '../../util/models';
import SubmmitActions from '../../components/SubmmitActions';
import { DefaultForm } from '../../components/DefaultForm'


const validationSchema = yup.object().shape({
    name: yup
        .string()
        .label("Nome")
        .required()
        .max(255),
    type: yup
        .number()
        .label("Tipo")
        .required(),

});

export const Form = () => {

    const { register, handleSubmit, getValues, setValue, errors, reset, watch, triggerValidation } = useForm({

        validationSchema: validationSchema,

    });

    const snackBar = useSnackbar();
    const history = useHistory();
    const { id }: any = useParams();
    const [castMember, setCastMember] = useState < CastMember | null > (null);
    const [loading, setLoading] = useState < boolean > (false);



    useEffect(() => {

        let isSubscribed = true;

        if (!id) {
            return;
        }

        if (isSubscribed) {

            (async () => {
                setLoading(true);
                try {
                    const { data } = await castMemberHttp.get(id);
                    setCastMember(data.data);
                    reset(data.data);
                } catch (error) {
                    console.error(error);
                    snackBar.enqueueSnackbar("Não foi possível carregar as informações", {
                        variant: "error"
                    });
                } finally {
                    setLoading(false);
                }
            })();
        }

        return () => {
            isSubscribed = false;
        };

    }, []);

    useEffect(() => {
        register({ name: "type" })

    }, [register]);

    async function onSubmit(formData, event) {

        setLoading(true);

        try {
            const http = !castMember
                ? castMemberHttp.create(formData)
                : castMemberHttp.update(castMember.id, formData);
            const { data } = await http;

            snackBar.enqueueSnackbar("Membro de elenco salvo com sucesso", {
                variant: "success"
            });

            setTimeout(() => {

                event ? (
                    id ?
                        history.replace(`/cast-members/${data.data.id}/edit`)
                        :
                        history.push(`/cast-members/${data.data.id}/edit`)
                ) : history.push('/cast-members')
            });

        } catch (error) {
            console.error(error);
            snackBar.enqueueSnackbar("Não foi possível salvar o membro de elenco", {
                variant: "error"
            });
        } finally {
            setLoading(false);
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
                helperText={errors.name && errors.name.message}
                InputLabelProps={{ shrink: true }}
            />

            <FormControl
                margin={"normal"}
                error={errors.type !== undefined}
                disabled={loading}
            >
                <FormLabel component="legend" >Tipo</FormLabel>
                <RadioGroup
                    name="type"
                    onChange={(e) => {
                        setValue("type", parseInt(e.target.value));
                    }}
                    value={watch('type') + ""}
                >

                    <FormControlLabel value="1" control={<Radio />} label="Diretor" />
                    <FormControlLabel value="2" control={<Radio />} label="Ator" />
                </RadioGroup>

                {
                    errors.type && <FormHelperText id="text-helper-text"> {errors.type.message} </FormHelperText>

                }

            </FormControl>

            <SubmmitActions disabledButtons={loading} handleSave={() => triggerValidation().then(isvalid => { isvalid && onSubmit(getValues(), null) })} />

        </DefaultForm>
    );

}