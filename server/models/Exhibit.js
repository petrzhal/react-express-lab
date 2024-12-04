import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const exhibitSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'The exhibit name is required.'], 
      trim: true,
      minlength: [3, 'The name must be at least 3 characters long.'], 
      maxlength: [100, 'The name must not exceed 100 characters.'], 
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'The description must not exceed 500 characters.'],
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
      required: [true, 'An exhibit must belong to a hall.'],
    },
    year: {
      type: Number,
      required: [true, 'The year is required.'],
      min: [0, 'The year cannot be less than 0.'], 
      max: [new Date().getFullYear(), 'The year cannot be in the future.'], 
    },
    creator: {
      type: String,
      default: 'Unknown',
      trim: true,
      maxlength: [100, 'The creator name must not exceed 100 characters.'],
    },
  },
  {
    timestamps: true,
  }
);

export default model('Exhibit', exhibitSchema);
