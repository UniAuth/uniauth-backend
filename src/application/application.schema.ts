import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';

export type ApplicationDocument = Application & Document;

/**
 * @Todo
 * - add support for participant array
 */
@Schema()
export class Application {
  constructor(partial: Partial<Application>) {
    Object.assign(this, partial);
  }

  /** Application information */
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  admin: User;

  @Prop({ required: true })
  supportEmail: string;

  @Prop()
  description: string;

  /** Application Configuration */
  @Prop({ required: true, type: [String] })
  authorizedOrigin: Array<string>;

  @Prop({ required: true, type: [String] })
  authorizedRedirect: Array<string>;

  @Prop({ required: true, type: [String] })
  scope: Array<string>;

  /** applicaiton keys */
  @Prop({ required: true })
  clientSecret: string;

  @Prop({ required: true, type: Date })
  creationDate: Date;

  /** list of participants */
  //   @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', required: true, default: [] })
  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
      required: true,
      default: [],
    },
  ])
  participants: Array<User>;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
