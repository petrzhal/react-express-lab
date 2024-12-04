import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const hallSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'The hall name is required.'], 
      trim: true,
      minlength: [3, 'The name must be at least 3 characters long.'], 
      maxlength: [100, 'The name must not exceed 100 characters.'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'The description must not exceed 300 characters.'],
    },
    exhibition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exhibition', 
      required: [true, 'The hall must be associated with an exhibition.'], 
    },
  },
  {
    timestamps: true,
  }
);

export default model('Hall', hallSchema);
