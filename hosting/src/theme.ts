import { createMuiTheme } from '@material-ui/core/styles'

const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#50625D',
    },
    background: {
      default: '#F9F9F9',
    },
    text: {
      primary: '#50625D',
    },
  },
  typography: {
    fontFamily: 'Timeless',
    body1: {
      fontFamily: 'Gilroy',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        fontSize: '20px',
        borderRadius: 0,
      },
      outlinedPrimary: {
        borderWidth: '2px',
        borderColor: '#50625D',
        '&:hover': {
          borderWidth: '2px',
        },
      },
      label: {
        textTransform: 'none',
      },
    },
    MuiFormLabel: {
      root: {
        fontFamily: 'Timeless',
        textAlign: 'left',
        fontSize: '18px',
        color: '#50625D',
      },
    },
    MuiFormGroup: {
      root: {
        display: 'block',
        textAlign: 'left',
      }
    },
    MuiFormControlLabel: {
      label: {
        fontWeight: 'bold',
        fontSize: '16px',
      },
    },
    MuiInputLabel: {
      root: {
        fontFamily: 'Timeless',
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 0,
      },
    },
    MuiSelect: {
      root: {
        fontFamily: 'Gilroy',
      },
    },
    MuiTableCell: {
      head: {
        fontFamily: 'Gilroy',
        fontWeight: 'bold',
      },
      body: {
        fontFamily: 'Gilroy',
      },
    },
  },
})

export default customTheme
