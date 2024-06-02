import jwt, { Secret } from 'jsonwebtoken';

console.log(jwt);
export const createToken = async (email: string, _id: string) => {
  let token: string = '';
  let secret: Secret = process.env.JWT_SECRET || '20934u029nfajdn';
  token = jwt.sign({ email: email, userId: _id }, secret);
  return token;
};
