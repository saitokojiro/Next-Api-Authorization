import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import fs from "fs";
import Cors from "cors";
import cookie from "cookie";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import OriginSite from "../../lib/allHeader";
const prisma = new PrismaClient();

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

//import TokenPrivate from './../../SecureToken/jwtRS256.key'

function validateEmail(email: any) {
  /*const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;*/
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  console.log(email);
  return re.test(String(email).toLowerCase());
}

function validatePassword(password: string) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;
  return re.test(String(password).toLowerCase());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  OriginSite(req, res);
  if (req.method === "POST") {
    //let data = JSON.parse(req.body);
    let data = req.body;
    const { email, password, firstName, lastName, gender, birthday, country, status } = data;
    console.log(password);
    if (email !== undefined && password !== undefined) {
      if (validateEmail(email)) {
        const findAccount = await prisma.user.findUnique({
          where: {
            email: email
          },
          select: {
            id: true,
            email: true,
            password: true,
            profile: true
          }
        });

        console.log(findAccount);
        if (findAccount?.email !== email) {
            //const date = new Date('08/18/1998 00:00:00')

          const saltRounds = 12
          const salt = bcrypt.genSaltSync(saltRounds);
          const hash = bcrypt.hashSync(password, salt);
            const date = new Date(birthday)
            await prisma.profile.create({
                data : {
                    userId: 999,
                    //bio: "val",
                    //description:"ok",
                    //relationShip:"celib"
                }
            })
            /*await prisma.user.create({
                data: {
                  email: email,
                  password: hash,
                  firstName: firstName,
                  lastName: lastName,
                  gender: gender,
                  birthday: date,
                  country: country,
                  status: status,
                  profile:{create:{
                    bio: " ",
                    description: " ",
                    relationShip:" "
                  }},
                  gallery:{create:{
                    media: "path:/data/ok"
                  }},
                  /*profile: {
                    create:{
                      bio: "val",
                      description:"ok",
                      relationShip:"celib"
                    }
                  }*/
               /* },
              })*/
              res.status(200).json({ account: "success" });

        } else {
          res.status(400).json({ error: "email existant" });
        }
      } else {
        //console.log(email)
        res.status(400).json({ error: "format email invalid" });
      }
    } else {
      fetch("https://api.ipify.org?format=json", { method: "GET", redirect: "follow" })
        .then((response) => response.json())
        .then((result) => {
          return res.status(404).json({
            error: "Violation",
            IP: result.ip
          });
        });
      //console.log(req)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}