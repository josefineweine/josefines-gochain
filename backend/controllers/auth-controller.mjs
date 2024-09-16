import User from '../models/UserModel.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
import { asyncHandler } from '../middleware/asyncHandler.mjs';
import Wallet from '../models/Wallet.mjs';
import { body, validationResult } from 'express-validator';

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = [
  body('fname').notEmpty().withMessage('First name is required'),
  body('lname').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array().map(err => err.msg).join(', '), 400));
    }

    const { fname, lname, email, password, role } = req.body;

    const { publicKey } = new Wallet();

    const user = await User.create({
      fname,
      lname,
      email,
      password,
      role,
      publicKey,
    });

    createAndSendToken(user, 201, res);
  }),
];

// @desc    Login new user
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array().map(err => err.msg).join(', '), 400));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) return next(new ErrorResponse('Wrong login', 401));

    const isCorrect = await user.validatePassword(password);

    if (!isCorrect) return next(new ErrorResponse('Wrong login', 401));

    createAndSendToken(user, 200, res);
  }),
];

// @desc    Receive user info
// @route   GET /api/v1/auth/me
// @access  PRIVATE
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'course',
    select: 'title -_id',
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updateuser
// @access  PRIVATE
export const updateUserDetails = [
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('fname').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lname').optional().notEmpty().withMessage('Last name cannot be empty'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array().map(err => err.msg).join(', '), 400));
    }

    const fieldToUpdate = {
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, statusCode: 200, data: user });
  }),
];

// @desc    Change password
// @route   PUT /api/v1/auth/updatepassword
// @access  PRIVATE
export const updatePassword = [
  body('password').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array().map(err => err.msg).join(', '), 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.validatePassword(req.body.password))) {
      return next(new ErrorResponse('Wrong password'));
    }

    user.password = req.body.newPassword;
    await user.save();

    createAndSendToken(user, 200, res);
  }),
];

const createAndSendToken = (user, statusCode, res) => {
  const token = user.generateToken();

  res.status(statusCode).json({ success: true, statusCode, token });
};
