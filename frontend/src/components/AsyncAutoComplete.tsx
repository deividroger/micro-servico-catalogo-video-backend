import * as React from 'react';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { CircularProgress, TextFieldProps } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

interface AsyncAutoCompleteProps {
  fetchOptions: (searchText) => Promise<any>
  TextFieldsProps?: TextFieldProps
  AutocompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'>
};

const AsyncAutoComplete: React.FC<AsyncAutoCompleteProps> = (props) => {

  const { AutocompleteProps } = props;
  const { freeSolo, onOpen, onClose, onInputChange } = AutocompleteProps as any;

  const [open, setOpen] = useState(true);
  const [searchText, setsearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const snackbar = useSnackbar();

  const textFieldsProps: TextFieldProps = {
    margin: 'normal',
    variant: 'outlined',
    fullWidth: true,
    InputLabelProps: { shrink: true },
    ...(props.TextFieldsProps && { ...props.TextFieldsProps })
  }

  const autoCompleteProps: AutocompleteProps<any> = {
    ...(AutocompleteProps && { ...AutocompleteProps }),
    open,
    loading: loading,
    options,
    loadingText: 'Carregando...',
    noOptionsText: 'Nenhum item encontrado',
    onOpen() {
      setOpen(true);
      onOpen && onOpen();
    },
    onClose() {
      setOpen(false);
      onClose && onClose();

    },
    onInputChange(event, value) {
      setsearchText(value);
      onInputChange && onInputChange();
    },
    renderInput: params => (
      <TextField
        {...params}
        {...textFieldsProps}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading && <CircularProgress color={"inherit"} size={20} />}
              {params.InputProps.endAdornment}
            </>
          )
        }}
      />
    )
  }

  useEffect(() => {
    if (!open || searchText === "" && freeSolo) {
      setOptions([]);
    }

  }, [open])

  useEffect(() => {

    if (!open || searchText === "" && freeSolo) {
      return;
    }

    let isSubscribed = true;

    (async () => {
      setLoading(true);
      try {

        const data = await props.fetchOptions(searchText);
        if (isSubscribed) {
          setOptions(data)
        }

      } catch (error) {
        console.error(error);
        snackbar.enqueueSnackbar("Não foi possível carregar as informações", {
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    })();


    return () => {
      isSubscribed = false;
    };

  }, [freeSolo ? searchText : open]);



  return (
    <Autocomplete {...autoCompleteProps} />
  );
};

export default AsyncAutoComplete;