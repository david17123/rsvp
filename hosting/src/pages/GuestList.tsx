import React from 'react'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import ChildCareIcon from '@material-ui/icons/ChildCare'

import TopBar from '../components/TopBar'
import { browseAllGuests, GuestApi } from '../services/guestApi'
import { UserContext } from '../services/UserContext'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
  },
  childIcon: {
    verticalAlign: 'text-top',
    height: theme.spacing(2),
    marginLeft: theme.spacing(0.5),
  },
}))

export default function GuestList() {
  const classes = useStyles({})
  const [guests, setGuests] = React.useState<Array<GuestApi.Model>>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const userContext = React.useContext(UserContext)
  React.useEffect(() => {
    if (userContext.user) {
      userContext.user.getIdToken()
        .then(idToken => browseAllGuests(idToken))
        .then((allGuests => {
          setGuests(allGuests)
          setLoading(false)
        }))
        .catch((err) => alert(err.message))
    }
  }, [userContext.loading])

  return (
    <React.Fragment>
      <TopBar />

      <Container maxWidth="lg" className={classes.container}>
        {loading && (
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop={6}
          >
            <CircularProgress />
          </Box>
        )}
        {!loading && (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Dietary requirements</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {guests.map((guest: GuestApi.Model) => (
                  <TableRow key={guest.name}>
                    <TableCell component="th" scope="row">
                      {guest.name}
                      {guest.isChild && <ChildCareIcon className={classes.childIcon} />}
                    </TableCell>
                    <TableCell>{guest.dietaryRequirements}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </React.Fragment>
  )
}
