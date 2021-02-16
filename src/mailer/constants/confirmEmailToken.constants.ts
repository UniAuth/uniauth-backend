import * as config from 'config';

export const confirmEmailTokenConstants = {
  secret: config.get('confirm_email_token.secret'),
  expiresIn: config.get('confirm_email_token.expires'),
  issuer: config.get('confirm_email_token.issuer'),
};
