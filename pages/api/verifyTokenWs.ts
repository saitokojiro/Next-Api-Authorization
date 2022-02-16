// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import OriginSite from "../../lib/allHeader";
import Cors from "cors";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import fs from "fs";
type Data = {
  username: string;
  success: boolean;
};

import initMiddleware from "../../lib/init-middleware";

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    origin: "true",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    exposedHeaders: "helloworld"
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await cors(req, res);
  //OriginSite(req, res);
  res.setHeader("Access-Control-Allow-Origin", "*");
  //console.log(req.headers.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const token = req.headers.token;
  console.log(token)
  //console.log(req)


  let publicKey = fs.readFileSync("./SecureToken/jwtRS256.key.pub", "utf8");

  jwt.verify(String(token), publicKey, { algorithms: ['RS256'] }, (err, payload) => {
    if (err) {
      res.status(200).json({ 
        username : "none",
        success: false });
    } else {
      console.log(payload);
      res.status(200).json({
        username : payload?.username, 
        success: true });
    }
  });
}
