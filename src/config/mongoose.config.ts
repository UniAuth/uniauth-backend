import {} from '@nestjs/mongoose';

// import * as config from 'config';

/**
 * initialize database connection based on config file(s)
 */
export const mongooseConfig = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true };
