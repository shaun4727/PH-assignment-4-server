import AppError from "../../app/utils/AppError";
import { TLoginUser, TUser, TUserWithId } from "./user_auth.interface";
import { User } from "./user_auth.model";
import { createToken } from "./user_auth.utils";
import config from "../../app/config";
import jwt, { JwtPayload } from "jsonwebtoken";

const createUserIntoDB = async (user: TUser) => {
  const result = await User.create(user);
  return {
    _id: result._id,
    name: result.name,
    email: result.email,
  };
};

const loginUser = async (payload: TLoginUser) => {
  const user = (await User.isUserExistsByEmail(payload.email)) as TUserWithId;

  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  if (user.isBlocked) {
    throw new AppError(403, "User is blocked!");
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(401, "Invalid credentials");
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user._id,
    name: user.name,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;
  const { iat, userEmail } = decoded;

  // checking if the user is exist
  const user = (await User.isUserExistsByEmail(userEmail)) as TUserWithId;

  if (!user) {
    throw new AppError(404, "This user is not found !");
  }
  // checking if the user is already deleted
  const userStatus = user?.isBlocked;

  if (userStatus) {
    throw new AppError(403, "This user is Blocked !");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(401, "You are not authorized !");
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user._id,
    name: user.name,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const getUsersFromDB = async () => {
  const allUsers = await User.find({ role: "user" }).select(
    "-password -createdAt -updatedAt -__v"
  );
  return allUsers;
};
const updateUserStatus = async (id: string) => {
  const user: Record<string, unknown> = (await User.findOne({ _id: id })) || {};

  await User.findByIdAndUpdate(id, {
    $set: { isBlocked: !user.isBlocked },
  });
  return;
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
  refreshToken,
  getUsersFromDB,
  updateUserStatus,
};
