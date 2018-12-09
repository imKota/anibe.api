import mongoose, { Schema } from 'mongoose'

const genreSchema = new Schema({
  name: {
    type: String
  },
  rating: {
    type: String
  },
  visible: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

genreSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      rating: this.rating,
      visible: this.visible,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Genre', genreSchema)

export const schema = model.schema
export default model