import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const exhibitionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'The exhibition title is required.'], 
      trim: true,
      minlength: [3, 'The title must be at least 3 characters long.'], 
      maxlength: [100, 'The title must not exceed 100 characters.'], 
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'The description must not exceed 500 characters.'],
    },
    startDate: {
      type: Date,
      required: [true, 'The start date is required.'],
      validate: {
        validator: (value) => value <= new Date(), 
        message: 'The start date cannot be in the future.',
      },
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.startDate; 
        },
        message: 'The end date cannot be earlier than the start date.',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default model('Exhibition', exhibitionSchema);
