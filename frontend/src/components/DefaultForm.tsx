// @flow 
import * as React from 'react';
import {  Grid, makeStyles } from '@material-ui/core'
import {  GridProps } from '@material-ui/core/Grid'

const useStyles = makeStyles(theme =>({
    gridItem: {
        padding: theme.spacing(1,0)
    }
}));

interface DefaultFormProps extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>  {
    GridItemProps?: GridProps;
    GridContainerProps?: GridProps;
}


export const DefaultForm: React.FC<DefaultFormProps> = (props) => {
    
    const classes = useStyles();
    const {GridContainerProps,GridItemProps, ...other } = props;

    return (
        <form {...other} >

        <Grid container {...GridContainerProps}>
            <Grid item className={classes.gridItem} {...GridItemProps} >
                {props.children}
            </Grid>
        </Grid>
        </form>
    );
};