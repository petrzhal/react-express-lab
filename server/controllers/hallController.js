import Hall from '../models/Hall.js';

export const getAllHalls = async (req, res, next) => {
  try {
    const halls = await Hall.find().populate('exhibition'); 
    res.status(200).json(halls);
  } catch (error) {
    next(error);
  }
};

export const getHallById = async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.id).populate('exhibition'); 
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    res.status(200).json(hall);
  } catch (error) {
    next(error);
  }
};

export const createHall = async (req, res, next) => {
  try {
    const { name, description, exhibition } = req.body;

    const newHall = await Hall.create({
      name,
      description,
      exhibition,
    });

    res.status(201).json(newHall);
  } catch (error) {
    next(error);
  }
};

export const updateHall = async (req, res, next) => {
  try {
    const { name, description, exhibition } = req.body;

    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    hall.name = name ?? hall.name;
    hall.description = description ?? hall.description;
    hall.exhibition = exhibition ?? hall.exhibition;

    const updatedHall = await hall.save();
    res.status(200).json(updatedHall);
  } catch (error) {
    next(error);
  }
};

export const deleteHall = async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    await hall.deleteOne({  _id: hall._id });
    res.status(200).json({ message: 'Hall deleted successfully' });
  } catch (error) {
    next(error);
  }
};
