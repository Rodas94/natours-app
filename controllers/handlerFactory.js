const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    //not containt 204
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (query) query = query.populate(popOption);

    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'sucssful',
      result: doc.length,
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.TourId) filter = { tour: req.params.tourId };
    const doc = await Model.find();
    res.status(200).json({
      status: 'sucssful',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });
