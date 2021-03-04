import { createMuiTheme } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import {PaletteOptions, SimplePaletteColorOptions} from "@material-ui/core/styles/createPalette";

const palete: PaletteOptions = {
    primary: {
        main: '#79aec8',
        contrastText: '#fff'
    },
    secondary: {
       main: '#4db5ab',
       contrastText: '#fff',
       dark: '#055a52'
    },
    background:{
     default:   '#fafafa'
    },
    success: {
        main: green[500],
        contrastText: '#fff'
    },
    error:{
        main: red[500]
    }
    
}

const theme = createMuiTheme({
 palette:  palete,
 overrides: {
     MUIDataTable: {
        paper: {
            boxShadow: "none"
        }
     },
     MUIDataTableToolbar:{
         root:{
             minHeight: '58px',
             backgroundColor: palete!.background!.default
         },
         icon: {
            color: (palete!.primary as SimplePaletteColorOptions).main ,
             '&:hover, &:active, &.focus':{
                 color: (palete!.secondary as SimplePaletteColorOptions).dark,
             }
         },
         iconActive: {
            color: '#055a52',
            '&:hover, &:active, &.focus':{
                color: (palete!.secondary as SimplePaletteColorOptions).dark,
            }
         }
     },
     MUIDataTableHeadCell:{
         fixedHeader:{
             paddingTop : 8,
             paddingBottom: 8,
             backgroundColor: (palete!.primary as SimplePaletteColorOptions).main,
             color: '#ffffff',
             '&[aria-sort]':{
                 backgroundColor: '#459ac4',

             }
         },
         sortActive: {
             color: '#fff',
         },
         SortAction: {
             alignItems: 'center'
         },
         SortLabelRoot: {
             '& svg': {
                 color: '#fff !important'
             }
         }
     },
     MUIDataTableSelectCell:{
         headerCell: {
            backgroundColor: (palete!.primary as SimplePaletteColorOptions).main,
            '& span': {
                color: '#fff !important'
            }
         }
     },
     MUIDataTableBodyCell: {
         root: {
             color: (palete!.secondary as SimplePaletteColorOptions).main,
             '&:hover, &:active, &.focus': {
                 color: (palete!.secondary as SimplePaletteColorOptions).main,
             }
         }
     },
     MUIDataTableToolbarSelect: {
         title: {
            color: (palete!.primary as SimplePaletteColorOptions).main,
         },
         iconButton: {
             color: (palete!.primary as SimplePaletteColorOptions).main,
         }
     },
     MUIDataTableBodyRow: {
         root: {
             '&:nth-child(odd)': {
                 backgroundColor: palete!.background!.default
             }
         }
     },
     MUIDataTablePagination: {
         root: {
             color: (palete!.primary as SimplePaletteColorOptions).main
         }
     }
 }
});

export default theme;