// import * as mongoose from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Application } from '../application/application.schema';

export type UserDocument = User & Document;
@Schema()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  /**
   * Personal Details
   */
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: false })
  verified: boolean;

  /**
   * Registration Details
   */
  @Prop({ required: true })
  registrationNumber: string;

  @Prop({ required: true })
  batch: string;

  @Prop({ required: true })
  branch: string;

  /**
   * Emails
   */
  @Prop({ required: true, unique: true })
  collegeEmail: string;

  @Prop()
  personalEmail: string;

  /**
   * Contact Numbers
   */
  @Prop()
  contactPrimary: string;

  @Prop()
  contactSecondary: string;

  /**
   * Social Links
   */
  @Prop([String])
  profile: string[];

  /** Applications created by User */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', required: true, default: [] })
  authorizedApplications: Array<Application>;
}

export const UserSchema = SchemaFactory.createForClass(User);
