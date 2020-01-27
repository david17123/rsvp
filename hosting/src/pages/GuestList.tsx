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
import TableSortLabel from '@material-ui/core/TableSortLabel'
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
  const [sortBy, setSortBy] = React.useState<'name' | 'date'>('name')
  const [sortIsAscending, setSortIsAscending] = React.useState<boolean>(true)
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

  const handleTableHeaderClick = (label: 'name' | 'date') => {
    if (sortBy === label) {
      setSortIsAscending(!sortIsAscending)
    } else {
      setSortBy(label)
      setSortIsAscending(true)
    }
  }

  const getSortedGuests = () => {
    return guests.sort((guest1, guest2) => {
      if (sortBy === 'name') {
        if (guest1.name === guest2.name) {
          return 0
        } else {
          return (guest1.name > guest2.name ? 1 : -1) * (sortIsAscending ? 1 : -1)
        }
      } else if (sortBy === 'date') {
        const date1 = guest1.addedDate.valueOf()
        const date2 = guest2.addedDate.valueOf()
        return (date1 - date2) * (sortIsAscending ? 1 : -1)
      }

      return 0
    })
  }

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
                  <TableCell sortDirection={sortBy === 'name' ? (sortIsAscending ? 'asc' : 'desc') : false}>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortIsAscending ? 'asc' : 'desc'}
                      onClick={() => handleTableHeaderClick('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell onClick={() => alert('Clicked diet')}>Dietary requirements</TableCell>
                  <TableCell sortDirection={sortBy === 'date' ? (sortIsAscending ? 'asc' : 'desc') : false}>
                    <TableSortLabel
                      active={sortBy === 'date'}
                      direction={sortIsAscending ? 'asc' : 'desc'}
                      onClick={() => handleTableHeaderClick('date')}
                    >
                      Date added
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getSortedGuests().map((guest: GuestApi.Model) => (
                  <TableRow key={guest.name}>
                    <TableCell component="th" scope="row">
                      {guest.name}
                      {guest.isChild && <ChildCareIcon className={classes.childIcon} />}
                    </TableCell>
                    <TableCell>{guest.dietaryRequirements}</TableCell>
                    <TableCell>{guest.addedDate.toLocaleDateString()}</TableCell>
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
