import mongoose, { Schema } from 'mongoose';
import { User } from '../user/index';
import { FCM } from '../../services/firebase';
import { asyncRedisClient } from '../../services/redis';

// типы уведомлений
const types = ['system', 'comment', 'update', 'newmanga'];

const notificationSchema = new Schema({
  // id пользователя котору должно прийти это уведомление
  target: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: types,
    required: true
  },
  picture: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; }
  }
});

notificationSchema.pre('save', async function (next) {
  await asyncRedisClient.publish(`notif.${this.target}.new`, JSON.stringify({
    id: this.id,
    title: this.title,
    body: this.body,
    type: this.type,
    picture: this.picture,
    url: this.url,
    user: {
      id: this.user.id,
      picture: this.user.picture,
      name: this.user.name,
      role: this.user.role
    }
  }));
  const user = await User.findById(this.target);

  for await (let token of user.fcm) {
    FCM.send({
      to: token,
      priority: 'high',
      notification: {
        title: this.title,
        body: this.body,
        sound: 'default'
      },
      data: {
        id: this.id,
        title: this.title,
        body: this.body,
        type: this.type,
        picture: this.picture,
        url: this.url,
        user: this.user
      }
    }, (e, res) => console.log(e, res));
  }
  next();
});

notificationSchema.methods = {
  view () {
    return {
      // simple view
      id: this.id,
      title: this.title,
      body: this.body,
      type: this.type,
      picture: this.picture,
      url: this.url,
      user: this.user,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

const model = mongoose.model('Notification', notificationSchema);

notificationSchema.statics = {
  types
};

export const schema = model.schema;
export default model;
