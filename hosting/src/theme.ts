import { createMuiTheme } from '@material-ui/core/styles'
import { purple } from '@material-ui/core/colors'

const customTheme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#50625d',
    },
    secondary: {
      // This is green.A700 as hex.
      main: purple[100],
    },
  },
})

export default customTheme
