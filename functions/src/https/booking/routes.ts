import express from 'express';
import cors from 'cors';

import {
  readBooking,
  browseBookings,
  addBooking,
  editBooking,
  deleteBooking,
} from './controllers';
import loggedInMiddleware from '../middlewares/loggedIn';

const app = express();

app.use(cors());

app.get('/', readBooking);
app.get('/browse', loggedInMiddleware, browseBookings);
app.post('/', addBooking);
app.put('/', editBooking);
app.delete('/', loggedInMiddleware, deleteBooking);

export default app;
