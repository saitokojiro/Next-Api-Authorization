import type {NextApiRequest, NextApiResponse} from 'next'
import jwt from 'jsonwebtoken'
import fs from "fs"
import Cors from 'cors'
import cookie from 'cookie'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import OriginSite from '../../lib/allHeader'
const prisma = new PrismaClient()


import initMiddleware from '../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    origin: 'true',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders:['Content-Type, Accept, Origin, Authorization']
  })
)

//import TokenPrivate from './../../SecureToken/jwtRS256.key'

function validateEmail(email:any) {
    /*const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;*/
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    console.log(email)
    return re.test(String(email).toLowerCase());
}

function validatePassword(password:string) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/
    return re.test(String(password).toLowerCase());
}

export default async function handler(req : NextApiRequest, res: NextApiResponse)
{
    
    await cors(req, res)
    OriginSite(req,res)

   // res.setHeader('Access-Control-Allow-Origin',"http://localhost:3000"),
    
    if(req.method === "GET")
    {
        res.setHeader('Access-Control-Allow-Origin', String(req.headers.origin))
        //res.setHeader('Access-Control-Allow-Origin',"*")
        //res.setHeader('Access-Control-Allow-Origin',req.headers.origin)
        res.setHeader('Access-Control-Allow-Credentials', "true"),
        res.setHeader('Content-Type', "application/json")

        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", "", {
            httpOnly: true,
            secure: true,
            //maxAge: 60-60,
            expires: new Date('10.08.1975 00:00:00'),
            sameSite:"none",
            path:"/",
            })
        );
        res.status(200).end("success")
        console.log('ok')
    }
    else{
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}