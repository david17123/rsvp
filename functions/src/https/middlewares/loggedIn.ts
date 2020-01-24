import { Request, Response, NextFunction } from 'express';

import { auth } from '../../admin';

export default function loggedIn(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  const tokenMatches = authHeader ? authHeader.match(/^Bearer (.*)$/i) : null;
  if (!tokenMatches) {
    res.status(401).send();
    return;
  }
  const idToken = tokenMatches[1];

  auth.verifyIdToken(idToken)
    .then(function() {
      next();
    }).catch(function(error) {
      // Might want to report to error reporting tool like Sentry
      res.status(401).send();
    });
}
