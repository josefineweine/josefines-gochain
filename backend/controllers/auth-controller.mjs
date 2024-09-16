import User from '../models/UserModel.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
import { asyncHandler } from '../middleware/asyncHandler.mjs';
import Wallet from '../models/Wallet.mjs';

// @desc    Register new use
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = asyncHandler(async (req, res, next) => {
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
});

// @desc    Login new user
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('E-mail or password is missing', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorResponse('Wrong login', 401));

  const isCorrect = await user.validatePassword(password);

  if (!isCorrect) return next(new ErrorResponse('Wrong login', 401));

  createAndSendToken(user, 200, res);
});

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
// @route   GET /api/v1/auth/updateuser
// @access  PRIVATE

export const updateUserDetails = asyncHandler(async (req, res, next) => {
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
});

// @desc    Change password
// @route   GET /api/v1/auth/updatepassword
// @access  PRIVATE

export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.validatePassword(req.body.password))) {
    return next(new ErrorResponse('Wrong password'));
  }

  user.password = req.body.newPassword;
  await user.save();

  createAndSendToken(user, 200, res);
});

const createAndSendToken = (user, statusCode, res) => {
  const token = user.generateToken();

  res.status(statusCode).json({ success: true, statusCode, token });
};
