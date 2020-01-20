import { createMuiTheme } from '@material-ui/core/styles'
import { purple } from '@material-ui/core/colors'

const customTheme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#50625D',
    },
    secondary: {
      // This is green.A700 as hex.
      main: purple[100],
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
    }
  },
  overrides: {
    MuiButton: {
      outlined: {
        borderRadius: 0,
      },
      outlinedPrimary: {
        borderWidth: '2px',
        borderColor: '#50625D',
        fontSize: '20px',
        '&:hover': {
          borderWidth: '2px',
        },
      },
      label: {
        textTransform: 'none',
      },
    },
  },
})

export default customTheme
