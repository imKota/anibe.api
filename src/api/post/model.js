import mongoose, {
  Schema
} from 'mongoose';
import mongooseKeywords from 'mongoose-keywords';

const postSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  annotation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genre: [{
    type: String
  }],
  type: {
    type: String,
    default: 'Manga'
  },
  rating: {
    type: Number,
    default: 5.0
  },
  status: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    required: true
  },
  chapters: {
    type: String,
    default: ''
  },
  pages: {
    type: String,
    default: ''
  },
  reading: {
    type: String,
    default: ''
  },
  episodes: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => {
      delete ret._id;
    }
  }
});

postSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      annotation: this.annotation,
      description: this.description,
      genre: this.genre,
      type: this.type,
      rating: this.rating,
      status: this.status,
      date: this.date,
      author: this.author,
      cover: this.cover,
      chapters: this.chapters,
      pages: this.pages,
      reading: this.reading,
      episodes: this.episodes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    return full ? {
      ...view
    } : {
      id: this.id,
      name: this.name,
      annotation: this.annotation,
      cover: this.cover,
      author: this.author,
      genre: this.genre,
      type: this.type,
      rating: this.rating
    };
  }
};

const model = mongoose.model('Post', postSchema);
postSchema.plugin(mongooseKeywords, { paths: ['name', 'annotation', 'author'] });
export const schema = model.schema;
export default model;
