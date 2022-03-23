// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import jwt from 'jsonwebtoken'
import fs from "fs"

import Cors from "cors";
import cookie from "cookie";
//const prisma = new PrismaClient();

type Data = {
  data : string
  success: boolean
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
  //const saltRounds = 12;
  //const myPlaintextPassword = "s0//P4$$w0rD";
  //const someOtherPlaintextPassword = "not_bacon";
  //const salt = bcrypt.genSaltSync(saltRounds);
 // const hash = bcrypt.hashSync(someOtherPlaintextPassword, salt);

  //const date = new Date("08/18/1998 00:00:00");

  res.setHeader("Access-Control-Allow-Origin", String(req.headers.origin)!);
  //console.log(req.headers.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  //res.status(200).json({ data:"data",success: true });

  
  if (req.method === "GET") {
    const getCookie = req.headers.cookie;
    let privateKey = fs.readFileSync("./SecureToken/jwtRS256.key", "utf8");
    const data = jwt.sign({ 
        username: "Kojiro"
    }, privateKey, { algorithm: "RS256" });
    console.log('created')
    res.status(200).json({ 
      data:data,
      success: true });
  }
}
