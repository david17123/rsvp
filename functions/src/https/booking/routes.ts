import express from 'express';
import cors from 'cors';

import {
  readBooking,
  browseBookings,
  addBooking,
  editBooking,
} from './controllers';

const app = express();

app.use(cors());

app.get('/', readBooking);
app.get('/browse', browseBookings);
app.post('/', addBooking);
app.put('/', editBooking);

export default app;
