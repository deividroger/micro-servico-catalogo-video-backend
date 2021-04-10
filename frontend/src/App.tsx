import { Box, MuiThemeProvider, CssBaseline } from '@material-ui/core';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';
import { Navbar } from './components/Navbar';
import AppRouter from './routes/AppRouter';
import theme from './theme';
import SnackbarProvider from './components/SnackbarProvider'

const App: React.FC = () => {
  return (

    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <React.Fragment>
          <CssBaseline />
          <BrowserRouter>
            <Navbar />
            <Box paddingTop={'70px'}>
              <Breadcrumbs />
              <AppRouter />
            </Box>
          </BrowserRouter>
        </React.Fragment>
      </SnackbarProvider >
    </MuiThemeProvider>

  );
}

export default App;
