import * as React from 'react';
import { Autocomplete, AutocompleteProps, UseAutocompleteSingleProps } from '@material-ui/lab';
import { CircularProgress, TextFieldProps } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { useState, useEffect, useImperativeHandle, RefAttributes } from 'react';

import { useDebounce } from 'use-debounce/lib';

interface AsyncAutocompleteProps extends RefAttributes<AsyncAutocompleteComponent> {
  fetchOptions: (searchText) => Promise<any>
  debounceTime?: number
  TextFieldsProps?: TextFieldProps
  AutocompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'> & UseAutocompleteSingleProps<any>;

};

export interface AsyncAutocompleteComponent {
  clear: () => void;
}

const AsyncAutocomplete = React.forwardRef < AsyncAutocompleteComponent, AsyncAutocompleteProps> ((props, ref) => {


  const { AutocompleteProps, debounceTime = 300,fetchOptions } = props;
  const { freeSolo = false, onOpen, onClose, onInputChange } = AutocompleteProps as any;

  const [open, setOpen] = useState(false);
  const [searchText, setsearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, debounceTime);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

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
    inputValue: searchText,
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


    if (!open && !freeSolo) {
      setOptions([]);
    }

  }, [open, freeSolo])

  useEffect(() => {

    if(!open) {
      return;
    }
    if(debouncedSearchText === "" && freeSolo) {
      return;
    }

    

    let isSubscribed = true;

    (async () => {
      setLoading(true);
      try {

        const data = await fetchOptions(debouncedSearchText);
        if (isSubscribed) {
          setOptions(data)
        }

      } finally {
        setLoading(false);
      }
    })();


    return () => {
      isSubscribed = false;
    };

  }, [freeSolo, debouncedSearchText, open, fetchOptions]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setsearchText("");
      setOptions([]);
    }
  }));


  return (
    <Autocomplete {...autoCompleteProps} />
  );
});

export default AsyncAutocomplete;