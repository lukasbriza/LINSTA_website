import type { NextApiRequest, NextApiResponse } from "next";
import { Methods } from "src/models";
import { isAllowed, badRequestResponse } from "@utils";
import { login, authenticate, logout } from "@abl";

const allowed: Methods = ["POST", "GET", "DELETE"];

export default async function usersApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (!isAllowed(allowed, method)) {
    return badRequestResponse(res);
  }

  switch (method) {
    case "POST":
      return await login(req, res);
    case "GET":
      return await authenticate(req, res);
    case "DELETE":
      return await logout(req, res);
    default:
      return badRequestResponse(res);
  }
}
