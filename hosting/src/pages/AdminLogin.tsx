import React from 'react'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { login, Login } from '../services/login'

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  loginCard: {
    margin: 'auto',
    width: theme.spacing(70),
    padding: theme.spacing(3),
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}))

export default function AdminLogin() {
  const classes = useStyles()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<{[key: string]: any}>({})
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setLoading(true)
    setError({})
    const res = await login(email, password)
    if (res === Login.Error.INVALID_EMAIL) {
      setError({
        email: 'Invalid email',
      })
    } else if (res === Login.Error.USER_DISABLED) {
      setError({
        email: 'Account is locked',
      })
    } else if (res === Login.Error.USER_NOT_FOUND) {
      setError({
        email: 'Cannot find user with email',
      })
    } else if (res === Login.Error.WRONG_PASSWORD) {
      setError({
        password: 'Invalid password',
      })
    }
    setLoading(false)
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper className={classes.loginCard}>
        <Typography variant="h5" className={classes.header}>Admin</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            error={!!error.email}
            helperText={error.email}
          />
          <TextField
            className={classes.textField}
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            error={!!error.password}
            helperText={error.password}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            Login
          </Button>
        </form>
      </Paper>
      <div id="firebase-drop-in-ui" />
    </Container>
  )
}
