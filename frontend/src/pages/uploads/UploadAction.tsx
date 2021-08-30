import React from "react";
import { Divider, Fade, IconButton, makeStyles, Theme } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import { Upload, FileUpload } from "../../store/upload/types";
import { Creators } from "../../store/upload";
import { useDispatch } from "react-redux";
import { hasError } from "../../store/upload/getters";

const useStyles = makeStyles((theme: Theme) => {
    return ({
        successIcon: {
            color: theme.palette.success.main,
            marginLeft: theme.spacing(1)
        },
        errorIcon: {
            color: theme.palette.error.main,
            marginLeft: theme.spacing(1)
        },
        divider: {
            height: '20px',
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        }
    })
});

interface UploadActionProps {
    uploadOrFile: Upload | FileUpload
}

const UploadAction: React.FC<UploadActionProps> = (props) => {

    const { uploadOrFile } = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const error = hasError(uploadOrFile);
    return (

        <Fade in={true} timeout={{ enter: 1000 }}>
            <>


                {uploadOrFile.progress === 1 && !error && <CheckCircleIcon className={classes.successIcon} />}


                { error && <ErrorIcon className={classes.errorIcon} />}

                <>
                    <Divider className={classes.divider} orientation={'vertical'} />
                    <IconButton
                        onClick={() => dispatch(Creators.removeUpload({ id: (uploadOrFile as any).video.id }))}
                    >
                        <DeleteIcon color={'primary'} />
                    </IconButton>
                    <IconButton
                        component={Link}
                        to={`/videos/uuid/edit`}
                    >
                        <EditIcon color={'primary'} />
                    </IconButton>
                </>
            </>
        </Fade>

    )
};

export default UploadAction;