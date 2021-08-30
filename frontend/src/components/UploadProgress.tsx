// @flow 
import { CircularProgress, Fade, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import * as React from 'react';
import { hasError } from '../store/upload/getters';
import { Upload, FileUpload } from '../store/upload/types';

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
    uploadOrFile: Upload | FileUpload;
    size: number;

};
const UploadProgress: React.FC<UploadProgressProps> = (props) => {

    const { uploadOrFile, size } = props;
    const classes = useStyles();

    const error = hasError(uploadOrFile);

    return (
        <Fade in={uploadOrFile.progress < 1} timeout={{ enter: 100, exit: 2000 }}>
            <div className={classes.progressContainer}>
                <CircularProgress
                    variant="static"
                    value={100}
                    size={size}
                    className={classes.progressBackground} />

                <CircularProgress
                    className={classes.progress}
                    size={size}
                    value={error ? 0 : uploadOrFile.progress * 100}
                    variant="static" />

            </div>
        </Fade>
    );
};

export default UploadProgress;