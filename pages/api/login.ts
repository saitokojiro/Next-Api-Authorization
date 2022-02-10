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
    
    if(req.method === "POST")
    {
        let requestOrigin = String(req.headers.origin);
        //res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        res.setHeader('Access-Control-Allow-Origin', requestOrigin)
        //res.setHeader('Access-Control-Allow-Origin',req.headers.origin)
        res.setHeader('Access-Control-Allow-Credentials', "true"),
        res.setHeader('Content-Type', "application/json")

        let data = JSON.parse(req.body)
        
        const {email, password} = data
        console.log(password)
        if(email !== undefined && password !== undefined)
        {
            if(validateEmail(email)){

                const findAccount= await prisma.user.findUnique(
                    {
                     where:
                     { 
                        email: email
                     },
                     select:{
                        id: true,
                        email:true,
                        password:true,
                        profile:true
                     },
                    }
                  )

                console.log(findAccount)
                if(findAccount?.email !== undefined)
                {
                    bcrypt.compare(password, findAccount.password, function(err, result) {
                        console.log(result)
                        if(result !== false)
                        {
                            console.log('connected')
                            const date = new Date('08/13/2021 01:54:00')
                            /*let dateNows = new Date('10.08.2021 00:00:00').getTime()/1000
                            let dateNow = new Date(dateNows*1000).toLocaleDateString('fr-FR')*/
                            let privateKey = fs.readFileSync('./SecureToken/jwtRS256.key', "utf8");
                            const data = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
                            res.setHeader(
                                "Set-Cookie",
                                cookie.serialize("token", data, {
                                httpOnly: true,
                                secure: true,
                                maxAge: 60 * 60 * 24,
                                sameSite:"none",
                                path:"/",
                                })
                            );
                            res.status(200).json({
                                token:data,
                                success: true
                            })
                        }
                        else
                        {

                            console.log('password Invalid')
                            res.status(400).json({'error': "password Invalid"})
                        }

                    })
                }
                else 
                {
                    res.status(400).json({'error': "email not found"})
                }
            }
            else 
            {
                //console.log(email)
                res.status(400).json({error: "format email invalid"})
            }
            
        }
        else 
        {
            fetch("https://api.ipify.org?format=json", {method: 'GET',
                redirect: 'follow'})
                .then(response => response.json())
                .then(result => {
                    return res.status(404).json({
                        error : "Violation",
                        "IP" : result.ip
                    })
                })
            //console.log(req)
        }
        
    }
    else{
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}