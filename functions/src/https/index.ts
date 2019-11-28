import * as functions from 'firebase-functions';

import bookingApp from './booking/routes';

export const booking = functions.https.onRequest(bookingApp);
