import Exhibition from '../models/Exhibition.js';

export const getAllExhibitions = async (req, res, next) => {
  try {
    const exhibitions = await Exhibition.find();
    res.status(200).json(exhibitions);
  } catch (error) {
    next(error);
  }
};

export const getExhibitionById = async (req, res, next) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }
    res.status(200).json(exhibition);
  } catch (error) {
    next(error);
  }
};

export const createExhibition = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, isActive } = req.body;

    const newExhibition = await Exhibition.create({
      title,
      description,
      startDate,
      endDate,
      isActive,
    });

    res.status(201).json(newExhibition);
  } catch (error) {
    next(error);
  }
};

export const updateExhibition = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, isActive } = req.body;

    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    exhibition.title = title ?? exhibition.title;
    exhibition.description = description ?? exhibition.description;
    exhibition.startDate = startDate ?? exhibition.startDate;
    exhibition.endDate = endDate ?? exhibition.endDate;
    exhibition.isActive = isActive ?? exhibition.isActive;

    const updatedExhibition = await exhibition.save();
    res.status(200).json(updatedExhibition);
  } catch (error) {
    next(error);
  }
};

export const deleteExhibition = async (req, res, next) => {
    try {
      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ message: 'Exhibition not found' });
      }
  
      await Exhibition.deleteOne({ _id: exhibition._id });
  
      res.status(200).json({ message: 'Exhibition deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
  
