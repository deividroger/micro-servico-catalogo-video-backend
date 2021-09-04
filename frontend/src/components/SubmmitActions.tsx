// @flow 
import * as React from 'react';
import { Box, Button, makeStyles, Theme } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

interface SubmmitActionsProps {
    disabledButtons?: boolean;
    handleSave: () => void;
};


const  SubmmitActions: React.FC<SubmmitActionsProps> = (props) => {
    const classes = useStyles();

    const buttonProps: ButtonProps = {
        variant: "contained",
        size: "medium",
        className: classes.submit,
        color: "secondary",
        disabled: props.disabledButtons === undefined ? false : props.disabledButtons
    };

    return (
        <Box dir={"lft"}>

            <Button color={"primary"} {...buttonProps} onClick={props.handleSave}> Salvar</Button>

            <Button {...buttonProps} type="submit" >Salvar e continuar editando </Button>
        </Box>
    );
};

export default SubmmitActions;