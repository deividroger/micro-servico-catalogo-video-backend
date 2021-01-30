import * as React from 'react';
import { IconButton, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import routes, { MyRouteProps } from '../../routes';

const listRoutes = ['dashboard', 'categories.list'];

const menuRoutes = routes.filter(route => listRoutes.includes(route.name));

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
                getContentAnchorEl={null} >

                {
                    listRoutes.map(
                        (routeName, key) => {
                            const route = menuRoutes.find(route => route.name === routeName) as MyRouteProps;

                            return (
                                <MenuItem
                                    key={key}
                                    to={route.path as string}
                                    onClick={handleClose}
                                    component={Link}
                                >
                                    {route.label}
                                </MenuItem>
                            )
                        }
                    )
                }

            </MuiMenu>
        </React.Fragment>
    );
};