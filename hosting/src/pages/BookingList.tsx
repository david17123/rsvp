import React from 'react'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import TopBar from '../components/TopBar'
import { browseBookings, deleteBooking, BookingApiModel } from '../services/bookingApi'
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
  disabledRow: {
    backgroundColor: theme.palette.grey[200],
    opacity: 0.5,
  },
  rowCell: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

export default function BookingList() {
  const classes = useStyles({})
  const [bookings, setBookings] = React.useState<Array<BookingApiModel>>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [sortBy, setSortBy] = React.useState<'name' | 'email' | 'date'>('name')
  const [sortIsAscending, setSortIsAscending] = React.useState<boolean>(true)
  const userContext = React.useContext(UserContext)
  React.useEffect(() => {
    fetchBookings() // tslint:disable-line no-floating-promises
  }, [userContext.loading])

  const handleTableHeaderClick = (label: 'name' | 'email' | 'date') => {
    if (sortBy === label) {
      setSortIsAscending(!sortIsAscending)
    } else {
      setSortBy(label)
      setSortIsAscending(true)
    }
  }

  const fetchBookings = async (showLoading: boolean = true) => {
    if (userContext.user) {
      if (showLoading) {
        setLoading(true)
      }

      try {
        const idToken = await userContext.user.getIdToken()
        const allBookings = await browseBookings(idToken)
        setBookings(allBookings)
      } catch (err) {
        alert(err.message)
      }

      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const handleDeleteBooking = async (booking: BookingApiModel) => {
    if (userContext.user) {
      try {
        const idToken = await userContext.user.getIdToken()
        await deleteBooking(idToken, booking.email)
        await fetchBookings(false)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  const getSortedBookings = () => {
    return bookings.sort((booking1, booking2) => {
      if (sortBy === 'name') {
        if (booking1.name === booking2.name) {
          return 0
        } else {
          return (booking1.name > booking2.name ? 1 : -1) * (sortIsAscending ? 1 : -1)
        }
      } else if (sortBy === 'email') {
        if (booking1.email === booking2.email) {
          return 0
        } else {
          return (booking1.name > booking2.name ? 1 : -1) * (sortIsAscending ? 1 : -1)
        }
      } else if (sortBy === 'date') {
        const date1 = booking1.bookingDate.valueOf()
        const date2 = booking2.bookingDate.valueOf()
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
                  <TableCell component="th" sortDirection={sortBy === 'name' ? (sortIsAscending ? 'asc' : 'desc') : false}>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortIsAscending ? 'asc' : 'desc'}
                      onClick={() => handleTableHeaderClick('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell component="th" sortDirection={sortBy === 'email' ? (sortIsAscending ? 'asc' : 'desc') : false}>
                    <TableSortLabel
                      active={sortBy === 'email'}
                      direction={sortIsAscending ? 'asc' : 'desc'}
                      onClick={() => handleTableHeaderClick('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell component="th">Booking type</TableCell>
                  <TableCell component="th" sortDirection={sortBy === 'date' ? (sortIsAscending ? 'asc' : 'desc') : false}>
                    <TableSortLabel
                      active={sortBy === 'date'}
                      direction={sortIsAscending ? 'asc' : 'desc'}
                      onClick={() => handleTableHeaderClick('date')}
                    >
                      Date added
                    </TableSortLabel>
                  </TableCell>
                  <TableCell component="th" />
                </TableRow>
              </TableHead>
              <TableBody>
                {getSortedBookings().map((booking: BookingApiModel) => (
                  <BookingRow
                    key={booking.email}
                    booking={booking}
                    onDelete={handleDeleteBooking}
                    onEdit={() => { console.log('Edit handler placeholder') }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </React.Fragment>
  )
}

const BookingRow = (props: BookingRowProps) => {
  const { booking, onDelete, onEdit } = props
  const classes = useStyles()
  const [disabled, setDisabled] = React.useState<boolean>(false)

  const handleEdit = () => {
    onEdit(booking)
  }

  const handleDelete = () => {
    setDisabled(true)
    onDelete(booking)
  }

  return (
    <TableRow key={booking.email} className={disabled ? classes.disabledRow : ''}>
      <TableCell className={classes.rowCell} scope="row">{booking.name}</TableCell>
      <TableCell className={classes.rowCell}>{booking.email}</TableCell>
      <TableCell className={classes.rowCell}>{booking.type}</TableCell>
      <TableCell className={classes.rowCell}>{booking.bookingDate.toLocaleDateString()}</TableCell>
      <TableCell className={classes.rowCell} align="right">
        <IconButton disabled aria-label="edit" onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton disabled={disabled} aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export interface BookingRowProps {
  booking: BookingApiModel
  onDelete: (booking: BookingApiModel) => any
  onEdit: (booking: BookingApiModel) => any
}
