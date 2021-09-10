import { Box, MuiThemeProvider, CssBaseline } from '@material-ui/core';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';
import { Navbar } from './components/Navbar';
import AppRouter from './routes/AppRouter';
import theme from './theme';
import SnackbarProvider from './components/SnackbarProvider'
import Spinner from './components/Spinner';

import { LoadingProvider } from './components/loading/LoadingProvider';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <React.Fragment>
              <CssBaseline />
              <BrowserRouter basename="/admin">
                <Spinner />
                <Navbar />
                <Box paddingTop={'70px'}>
                  <Breadcrumbs />
                  <AppRouter />
                </Box>
              </BrowserRouter>
            </React.Fragment>
          </SnackbarProvider >
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
  );
}

export default App;
