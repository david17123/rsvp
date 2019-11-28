import * as functions from 'firebase-functions';

import bookingApp from './booking/routes';
import guestApp from './guest/routes';

export const booking = functions.https.onRequest(bookingApp);
export const guest = functions.https.onRequest(guestApp);
