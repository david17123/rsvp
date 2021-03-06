import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { login, LoginError } from '../services/login'
import { UserContext } from '../services/UserContext'

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

export default function AdminLogin(props: RouteComponentProps) {
  const classes = useStyles()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<{[key: string]: any}>({})
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const { user, loading: loadingLoggedInUser } = React.useContext(UserContext)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setLoading(true)
    setError({})
    const res = await login(email, password)
    if (res === LoginError.INVALID_EMAIL) {
      setError({
        email: 'Invalid email',
      })
    } else if (res === LoginError.USER_DISABLED) {
      setError({
        email: 'Account is locked',
      })
    } else if (res === LoginError.USER_NOT_FOUND) {
      setError({
        email: 'Cannot find user with email',
      })
    } else if (res === LoginError.WRONG_PASSWORD) {
      setError({
        password: 'Invalid password',
      })
    } else if (res === LoginError.TOO_MANY_FAILED_ATTEMPTS) {
      setError({
        password: 'Too many failed attempts. Try again later.',
      })
    } else if (res === LoginError.GENERIC) {
      setError({
        email: 'Failed to authenticate',
      })
    }
    setLoading(false)
  }

  if (!loadingLoggedInUser && user) {
    const { location } = props
    const redirectTo = location.state && location.state.from
      ? location.state.from.pathname
      : '/'

    return (
      <Redirect to={redirectTo} />
    )
  }
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
    </Container>
  )
}
