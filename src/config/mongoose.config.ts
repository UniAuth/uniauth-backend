import {} from '@nestjs/mongoose';

/**
 * initialize database connection based on config file(s)
 */
export const mongooseConfig = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true };
