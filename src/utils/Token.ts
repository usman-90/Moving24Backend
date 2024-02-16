import jwt from "jsonwebtoken";

export const createToken = async (user : any) => {
  let userName = user.userName;
  let email = user.email;
  let token: string = "";
  if (userName) {
    token = await jwt.sign(
      { userName: user.userName, userId: user._id },
      process.env.JWT_PASSWORD,
    );
  } else if (email) {
    token = await jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_PASSWORD,
    );
  }
  return token;
};
