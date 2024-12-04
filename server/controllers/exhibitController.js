import Exhibit from '../models/Exhibit.js';

export const getAllExhibits = async (req, res, next) => {
  try {
    const exhibits = await Exhibit.find().populate('hall');
    res.status(200).json(exhibits);
  } catch (error) {
    next(error);
  }
};

export const getExhibitById = async (req, res, next) => {
  try {
    const exhibit = await Exhibit.findById(req.params.id).populate('hall');
    if (!exhibit) {
      return res.status(404).json({ message: 'Exhibit not found' });
    }
    res.status(200).json(exhibit);
  } catch (error) {
    next(error);
  }
};

export const createExhibit = async (req, res, next) => {
  try {
    const { name, description, hall, year, creator } = req.body;

    const newExhibit = await Exhibit.create({
      name,
      description,
      hall,
      year,
      creator,
    });

    res.status(201).json(newExhibit);
  } catch (error) {
    next(error);
  }
};

export const updateExhibit = async (req, res, next) => {
  try {
    const { name, description, hall, year, creator } = req.body;

    const exhibit = await Exhibit.findById(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ message: 'Exhibit not found' });
    }

    exhibit.name = name ?? exhibit.name;
    exhibit.description = description ?? exhibit.description;
    exhibit.hall = hall ?? exhibit.hall;
    exhibit.year = year ?? exhibit.year;
    exhibit.creator = creator ?? exhibit.creator;

    const updatedExhibit = await exhibit.save();
    res.status(200).json(updatedExhibit);
  } catch (error) {
    next(error);
  }
};

export const deleteExhibit = async (req, res, next) => {
  try {
    const exhibit = await Exhibit.findById(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ message: 'Exhibit not found' });
    }

    await exhibit.deleteOne({  _id: exhibit._id });
    res.status(200).json({ message: 'Exhibit deleted successfully' });
  } catch (error) {
    next(error);
  }
};
