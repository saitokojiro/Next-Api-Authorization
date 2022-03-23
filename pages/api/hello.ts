// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import Cors from 'cors'
import cookie from 'cookie'
const prisma = new PrismaClient()

type Data = {
  success: boolean
}


import initMiddleware from '../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    origin: 'true',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    exposedHeaders: "helloworld"
  })
)



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await cors(req, res)
  const saltRounds = 12
  const myPlaintextPassword = 's0/\/\P4$$w0rD';
  const someOtherPlaintextPassword = 'not_bacon';
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(someOtherPlaintextPassword, salt);

  const date = new Date('08/18/1998 00:00:00')

  res.setHeader('Access-Control-Allow-Origin', String(req.headers.origin)!)
  console.log(req.headers.origin)
  res.setHeader('Access-Control-Allow-Credentials', "true")

 /* await prisma.user.create({
    data: {
      email:"saitokojiro@hotmail.fr",
      password: hash,
      firstName: "val",
      lastName: "val",
      gender: "val",
      birthday: date,
      country: "val",
      status: "val",
      profile:{create:{}},
      gallery:{create:{}}
      /*profile: {
        create:{
          bio: "val",
          description:"ok",
          relationShip:"celib"
        }
      }
    },
  })
/*
  await prisma.profile.create({
    data: {
      userId:1,
      bio :'ok'
    },
  })*/
  
  /*const allUsers:any = await prisma.user.findUnique(
    {
     where :{ id : 1 },
     include:
     {
       profile: true,
       //friend: true,
       gallery: true,
     }
     
    }
  )
  //let dataGet:allUsers = allUsers

  console.log(allUsers === null)*/
  const getCookie = req.headers.cookie!;
  if(getCookie !== undefined && cookie.parse(getCookie).token !== undefined)
  {
      res.status(200).json({ success: true })
  }
  else{
    res.status(401).json({ success: false })
  }
  
}
