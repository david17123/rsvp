import React from 'react'

import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'

import TopBar from '../components/TopBar'
import { browseAllGuests, GuestApi } from '../services/guestApi'
import { UserContext } from '../services/UserContext'

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
  },
}))

export default function GuestList() {
  const classes = useStyles({})
  const [guests, setGuests] = React.useState<Array<GuestApi.Model>>([])
  const userContext = React.useContext(UserContext)
  React.useEffect(() => {
    if (userContext.user) {
      userContext.user.getIdToken()
        .then(idToken => browseAllGuests(idToken))
        .then((allGuests => setGuests(allGuests)))
        .catch((err) => alert(err.message))
    }
  }, [userContext.loading])

  return (
    <React.Fragment>
      <TopBar />

      <Container maxWidth="lg" className={classes.container}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Dietary requirements</TableCell>
                <TableCell>Is child</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guests.map((guest: GuestApi.Model) => (
                <TableRow key={guest.name}>
                  <TableCell component="th" scope="row">
                    {guest.name}
                  </TableCell>
                  <TableCell>{guest.dietaryRequirements}</TableCell>
                  <TableCell>{guest.isChild ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </React.Fragment>
  )
}
