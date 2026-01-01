import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "./../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "./../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError("All fields are required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError("Invalid email address", 400);
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError("User with given email or username already exists", 409);
  }
  if (password.length < 6) {
    throw new ApiError("Password must be at least 6 characters long", 400);
  }
  if (username.length < 3) {
    throw new ApiError("Username must be at least 3 characters long", 400);
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError("Avatar image is required", 400);
  }
  const avtar = await uploadToCloudinary(avatarLocalPath);

  const coverImage = coverImageLocalPath
    ? await uploadToCloudinary(coverImageLocalPath)
    : null;

  if (!avtar) {
    throw new ApiError("Failed to upload avatar image", 500);
  }
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    avatar: avtar.url,
    coverImage: coverImage ? coverImage.url : "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError("Failed to create user", 500);
  }

  return res
    .status(200)
    .json(new ApiResponse(200,"User registered successfully",  createdUser));
});

export { registerUser };
// get user data from req.body and frontend
// validation can be added here - not empty fields, valid email, password strength, etc.
// check if user already exists in the database
// hash the password using bcrypt
// save the new user to the database
// check for images, check for avatar upload to cloudinary
// check the avatar URL and save it to the user profile
// create user object - create entry in the database
// remove password and refresh token field from response
// check for user creation
// return response with user data (excluding sensitive info)
