import { getToken } from "next-auth/jwt";

import type { NextApiRequest, NextApiResponse } from "next";

const getDataFromUserInfo = (
  req: NextApiRequest,
  res: NextApiResponse,
  token: string
) => {
  const userInfoEndpoint = `https://instance1-wtitmp.zitadel.cloud/oidc/v1/userinfo`;

  return fetch(userInfoEndpoint, {
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "GET",
  })
    .then((resp) => {
      return resp.json();
    })
    .then((resp) => {
      return res.status(200).send(resp);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  // console.log("HANDLER", token, req, res);
  if (!token?.accessToken) {
    return res.status(401).end();
  }

  switch (req.method) {
    case "GET":
      return getDataFromUserInfo(req, res, token.accessToken as string);
    default:
      return res.status(405).end();
  }
};

export default handler;
