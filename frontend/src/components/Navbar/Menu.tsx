import * as React from 'react';
import { IconButton, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'

export const Menu = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const opened = Boolean(anchorEl);
    const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <React.Fragment>

    <IconButton
            color="inherit"
            edge="start"
            aria-label="open drawer"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpen}

        >
            <MenuIcon />
        </IconButton>
            <MuiMenu
                id="menu-appbar"
                open={opened}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                getContentAnchorEl={null}
            >
                <MenuItem
                    onClick={handleClose}
                >
                    Categorias
                </MenuItem>
            </MuiMenu>
            </React.Fragment>
    );
};