import * as React from 'react';
import {

    Checkbox,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
    useTheme,
    Button,
    Card,
    CardContent,
    makeStyles,
    Theme

} from "@material-ui/core";

import { useForm } from "react-hook-form";

import { useEffect, useState, useRef, MutableRefObject, createRef } from "react";
import { useParams, useHistory } from "react-router";
import { useSnackbar } from "notistack";

import { DefaultForm } from '../../../components/DefaultForm';
import SubmmitActions from '../../../components/SubmmitActions';
import videoHttp from "../../../util/http/video-http";
import * as yup from '../../../util/vendor/yup';
import { Video, VideoFileFieldsMap } from "../../../util/models";
import { RatingField } from './RatingField';
import UploadField from './UploadField'
import { useMediaQuery } from '@material-ui/core';

import GenreField, { GenreFieldComponent } from "./GenreField";
import CategoryField, { CategoryFieldComponent } from "./CategoryField";
import CastMemberField, { CastMemberFieldComponent } from "./CastMemberField";
import { omit, zipObject } from 'lodash';
import { InputFileComponent } from "../../../components/InputFile";

import { FormHelperText } from '@material-ui/core';

import useSnackbarFormError from '../../../hooks/useSnackbarFormError'
import SnackbarUpload from '../../../components/SnackbarUpload';
import { useDispatch } from 'react-redux';
import { Creators } from '../../../store/upload';
import { FileInfo } from '../../../store/upload/types';
import { useContext } from 'react';
import LoadingContext from '../../../components/loading/LoadingContext';

const useStyles = makeStyles((theme: Theme) => ({
    cardUpload: {
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        margin: theme.spacing(2, 0)
    },
    cardOpened: {
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
    },
    cardContentOpened: {
        paddingBottom: theme.spacing(2) + 'px !important'
    },
}));

const validationSchema = yup.object().shape({
    title: yup.string()
        .label('Título')
        .required()
        .max(255),
    description: yup.string()
        .label('Sinopse')
        .required(),
    year_launched: yup.number()
        .label('Ano de lançamento')
        .required()
        .min(1),
    duration: yup.number()
        .label('Duração')
        .required()
        .min(1),
    cast_members: yup.array()
        .label('Elenco')
        .required(),
    genres: yup.array()
        .label('Gêneros')
        .required(),
    categories: yup.array()
        .label('Categorias')
        .required()
        .test({
            message: 'Cada gênero escolhido precisa ter pelo menos uma categoria selecionada',
            test(value) {
                return value.every(
                    v => v.categories.filter(
                        cat => this.parent.categories.map(c => c.id).includes(cat.id)
                    ).length !== 0
                );
            }
        }),
    rating: yup.string()
        .label('Classificação')
        .required()
});

const fileFields = Object.keys(VideoFileFieldsMap);

export const Form = () => {
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset,
        watch,
        triggerValidation,
        formState
    } = useForm < {
        title,
        description,
        year_launched,
        duration,
        rating,
        cast_members,
        genres,
        categories,
        opened
        
    } > ({
        validationSchema,
        defaultValues: {
            rating: null,
            cast_members: [],
            genres: [],
            categories: [],
            opened: false
            
        }
    });

    const snackbar = useSnackbar();
    const classes = useStyles();
    const history = useHistory();
    const { id }: any = useParams();
    const [video, setVideo] = useState < Video | null > (null);
    const loading = useContext(LoadingContext);

    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));

    const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
    const genreRef = useRef() as MutableRefObject<GenreFieldComponent>;
    const categoryRef = useRef() as MutableRefObject<CategoryFieldComponent>;
    const uploadsRef = useRef(
        zipObject(fileFields, fileFields.map(() => createRef()))
    ) as MutableRefObject<{ [key: string]: MutableRefObject<InputFileComponent> }>;


    // const uploads = useSelector < UploadModule, Upload[]> ((state) => state.upload.uploads);
    const dispatch = useDispatch();
    useSnackbarFormError(formState.submitCount, errors);

    useEffect(() => {

    }, [formState.submitCount])

    useEffect(() => {
        ['rating',
            'opened',
            'cast_members',
            'genres',
            'categories',
            ...fileFields].forEach(name => register({ name }));
    }, [register])


    useEffect(() => {
        snackbar.enqueueSnackbar('', {
            key: 'snackbar-upload',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            },
            content: (key, message) => {
                const id = key as any
                return <SnackbarUpload id={id} />
            }
        })

        if (!id) {
            return;
        }

        let isSubscribed = true;

        (async () => {
            
            try {
                const { data } = await videoHttp.get(id);
                if (isSubscribed) {
                    setVideo(data.data);
                    resetForm(data.data);
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' });
            } 
        })();
        return () => {
            isSubscribed = false;
        }
    }, []);

    async function onSubmit(formData, event) {

        const sendData = omit(formData, [...fileFields,
            'cast_members',
            'genres',
            'categories']);

        sendData['cast_members_id'] = formData['cast_members'].map(cast_member => cast_member.id);
        sendData['categories_id'] = formData['categories'].map(category => category.id);
        sendData['genres_id'] = formData['genres'].map(genre => genre.id);

        try {
            const http = !video
                ? videoHttp.create(sendData)
                : videoHttp.update(video.id, sendData);
            const { data } = await http;

            snackbar.enqueueSnackbar('Vídeo salvo com sucesso', { variant: 'success' });

            uploadFiles(data.data);

            id && resetForm(video);
            setTimeout(() => {
                event ?
                    (
                        id
                            ? history.replace(`/videos/${data.data.id}/edit`)
                            : history.push(`/videos/${data.data.id}/edit`)


                    ) : history.push('/videos')
            });

        } catch (error) {
            console.error(error);
            snackbar.enqueueSnackbar('Não foi possível salvar o vídeo', { variant: 'error' });
        } 
    }


    function resetForm(data) {
        Object.keys(uploadsRef.current).forEach(
            field => uploadsRef.current[field].current.clear()
        );
        castMemberRef.current.clear();
        genreRef.current.clear();
        categoryRef.current.clear();
        reset(data);
    }

    function uploadFiles(video) {
        const files: FileInfo[] = fileFields
            .filter(fileField => getValues()[fileField])
            .map(fileField => ({ fileField, file: getValues()[fileField] }));

            if(!files.length){
                return;
            }

        dispatch(Creators.addUpload({ video, files }));

        snackbar.enqueueSnackbar('',{
            key:'snackbar-upload',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            },
            content:(key,message) => {
                const id = key as any;
                return <SnackbarUpload id={id} />
            }
        });
    }

    return (
        <DefaultForm
            GridItemProps={{ xs: 12 }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="title"
                        label="Título"
                        variant={'outlined'}
                        fullWidth
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                        error={errors.title !== undefined}
                        helperText={errors.title && errors.title.message}
                    />
                    <TextField
                        name="description"
                        label="Sinopse"
                        multiline
                        rows="4"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                        error={errors.description !== undefined}
                        helperText={errors.description && errors.description.message}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                name="year_launched"
                                label="Ano de lançamento"
                                type="number"
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                error={errors.year_launched !== undefined}
                                helperText={errors.year_launched && errors.year_launched.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="duration"
                                label="Duração"
                                type="number"
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                error={errors.duration !== undefined}
                                helperText={errors.duration && errors.duration.message}
                            />
                        </Grid>
                    </Grid>

                    <CastMemberField
                        ref={castMemberRef}
                        castMembers={watch('cast_members')}
                        error={errors.genres}
                        disabled={loading}
                        setCastMembers={(value) => setValue('cast_members', value, true)}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <GenreField
                                ref={genreRef}
                                error={errors.genres}
                                disabled={loading}
                                genres={watch('genres')}
                                setGenres={(value) => setValue('genres', value, true)}
                                setCategories={(value) => setValue('categories', value, true)}
                                categories={watch('categories')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CategoryField
                                ref={categoryRef}
                                error={errors.categories}
                                disabled={loading}
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value, true)}
                                genres={watch('genres')}

                            />
                        </Grid>

                    </Grid>

                </Grid>
                <Grid item xs={12} md={6}>
                    <RatingField
                        value={watch('rating')}
                        setValue={(value) => setValue('rating', value, true)}
                        error={errors.rating}
                        disabled={loading}
                        FormControlProps={{
                            margin: isGreaterMd ? 'none' : 'normal'
                        }}
                    />
                    <br />
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Imagens
                            </Typography>

                            <UploadField
                                ref={uploadsRef.current['thumb_file']}
                                accept={'image/*'}
                                label={'Thumb'}
                                setValue={(value) => setValue('thumb_file', value)} />

                            <UploadField
                                ref={uploadsRef.current['banner_file']}

                                accept={'image/*'}
                                label={'Banner'}
                                setValue={(value) => setValue('banner_file', value)} />

                        </CardContent>
                    </Card>

                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Videos
                            </Typography>

                            <UploadField
                                ref={uploadsRef.current['trailer_file']}
                                accept={'video/mp4'}
                                label={'Trailer'}
                                setValue={(value) => setValue('trailer_file', value)} />

                            <UploadField
                                ref={uploadsRef.current['video_file']}
                                accept={'video/mp4'}
                                label={'Principal'}
                                setValue={(value) => setValue('video_file', value)} />

                        </CardContent>
                    </Card>

                    <Card className={classes.cardOpened}>
                        <CardContent className={classes.cardContentOpened}>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="opened"
                                        color={'primary'}
                                        onChange={
                                            () => setValue('opened', !getValues()['opened'])
                                        }
                                        checked={watch('opened') as boolean}
                                        disabled={loading} />
                                }
                                label={
                                    <Typography color={'primary'} variant={'subtitle2'} >
                                        Quero que esse conteúdo apareça na seção de lançamentos
                                    </Typography>
                                }
                                labelPlacement="end"
                            />
                        </CardContent>

                    </Card>

                </Grid>

            </Grid>
            <SubmmitActions
                disabledButtons={loading}
                handleSave={() =>
                    triggerValidation().then(isValid => {
                        isValid && onSubmit(getValues(), null)
                    })
                }
            />
        </DefaultForm>
    )
}