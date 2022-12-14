type PostLogin_request = { name: string; password: string; iat: number };
type PostLogin_response = {
  token: string;
};
type loginResponseDecoded = {
  _id: string;
  permission: "ADMIN" | "USER";
  iat: number;
  exp: number;
};

type Authenticate_response = loginResponseDecoded | boolean;

export type {
  Authenticate_response,
  PostLogin_request,
  PostLogin_response,
  loginResponseDecoded,
};
