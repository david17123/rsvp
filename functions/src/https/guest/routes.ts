import express from 'express';
import cors from 'cors';

import {
  readGuest,
  browseGuests,
  addGuest,
  editGuest,
  deleteGuest,
} from './controllers';

const app = express();

app.use(cors());

app.get('/', readGuest);
app.get('/browse', browseGuests);
app.post('/', addGuest);
app.put('/', editGuest);
app.delete('/', deleteGuest);

export default app;
