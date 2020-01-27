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
import ChildCareIcon from '@material-ui/icons/ChildCare'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import TopBar from '../components/TopBar'
import { browseAllGuests, deleteGuest, GuestApi } from '../services/guestApi'
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

export default function GuestList() {
  const classes = useStyles({})
  const [guests, setGuests] = React.useState<Array<GuestApi.Model>>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [sortBy, setSortBy] = React.useState<'name' | 'date'>('name')
  const [sortIsAscending, setSortIsAscending] = React.useState<boolean>(true)
  const userContext = React.useContext(UserContext)
  React.useEffect(() => {
    fetchGuests()
  }, [userContext.loading])

  const handleTableHeaderClick = (label: 'name' | 'date') => {
    if (sortBy === label) {
      setSortIsAscending(!sortIsAscending)
    } else {
      setSortBy(label)
      setSortIsAscending(true)
    }
  }

  const fetchGuests = async (showLoading: boolean = true) => {
    if (userContext.user) {
      if (showLoading) {
        setLoading(true)
      }

      try {
        const idToken = await userContext.user.getIdToken()
        const allGuests = await browseAllGuests(idToken)
        setGuests(allGuests)
      } catch (err) {
        alert(err.message)
      }

      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const handleDeleteGuest = async (guest: GuestApi.Model) => {
    await deleteGuest(guest.bookingEmail, guest.name)
    fetchGuests(false)
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
                  <TableCell component="th" sortDirection={sortBy === 'name' ? (sortIsAscending ? 'asc' : 'desc') : false}>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortIsAscending ? 'asc' : 'desc'}
                      onClick={() => handleTableHeaderClick('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell component="th">Dietary requirements</TableCell>
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
                {getSortedGuests().map((guest: GuestApi.Model) => (
                  <GuestRow
                    key={guest.name}
                    guest={guest}
                    onDelete={handleDeleteGuest}
                    onEdit={() => {}}
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

const GuestRow = (props: GuestList.GuestRow.Props) => {
  const { guest, onDelete, onEdit } = props
  const classes = useStyles()
  const [disabled, setDisabled] = React.useState<boolean>(false)

  const handleEdit = () => {
    onEdit(guest)
  }

  const handleDelete = () => {
    setDisabled(true)
    onDelete(guest)
  }

  return (
    <TableRow key={guest.name} className={disabled ? classes.disabledRow : ''}>
      <TableCell className={classes.rowCell} scope="row">
        {guest.name}
        {guest.isChild && <ChildCareIcon className={classes.childIcon} />}
      </TableCell>
      <TableCell className={classes.rowCell}>{guest.dietaryRequirements}</TableCell>
      <TableCell className={classes.rowCell}>{guest.addedDate.toLocaleDateString()}</TableCell>
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

export namespace GuestList {
  export namespace GuestRow {
    export interface Props {
      guest: GuestApi.Model
      onDelete: (guest: GuestApi.Model) => any
      onEdit: (guest: GuestApi.Model) => any
    }
  }
}
