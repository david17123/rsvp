import express from 'express';
import cors from 'cors';

import {
  readBooking,
  browseBookings,
  addBooking,
  editBooking,
} from './controllers';
import loggedInMiddleware from '../middlewares/loggedin';

const app = express();

app.use(cors());

app.get('/', readBooking);
app.get('/browse', loggedInMiddleware, browseBookings);
app.post('/', addBooking);
app.put('/', editBooking);

export default app;
