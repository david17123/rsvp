import express from 'express';
import cors from 'cors';

import {
  readGuest,
  browseGuests,
  browseAllGuests,
  addGuest,
  editGuest,
  deleteGuest,
} from './controllers';
import loggedInMiddleware from '../middlewares/loggedin';

const app = express();

app.use(cors());

app.get('/', readGuest);
app.get('/browse', browseGuests);
app.get('/browse/all', loggedInMiddleware, browseAllGuests);
app.post('/', addGuest);
app.put('/', editGuest);
app.delete('/', deleteGuest);

export default app;
