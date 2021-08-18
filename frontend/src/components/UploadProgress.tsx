// @flow 
import { CircularProgress, Fade, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import * as React from 'react';

const useStyles = makeStyles({
    progressContainer: {
        position: 'relative'
    },
    progress: {
        position: 'absolute',
        left: 0
    },
    progressBackground: {
        color: grey["300"]
    }
})

interface UploadProgressProps {
    size: number;

};
const UploadProgress: React.FC<UploadProgressProps> =  (props) => {

    const {size} = props;
    const classes = useStyles();

    return (
        <Fade in={true} timeout={{enter:100,exit: 2000}}>
        <div className={classes.progressContainer}>
            <CircularProgress 
            variant="static"
            value={100}
            size={size}
            className={classes.progressBackground} />

            <CircularProgress
                className={classes.progress}
                size={size}
                value={50}
                variant="static" />

        </div>
        </Fade>
    );
};

export default UploadProgress;