import type {NextApiRequest, NextApiResponse} from 'next'
import jwt from 'jsonwebtoken'
import fs from "fs"
import Cors from 'cors'
import cookie from 'cookie'

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

//import TokenPrivate from './../../SecureToken/jwtRS256.key'

function validateEmail(email:string) {
    /*const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;*/
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
    return re.test(String(email).toLowerCase());
}

function validatePassword(password:string) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/
    return re.test(String(password).toLowerCase());
}

export default async function handler(req : NextApiRequest, res: NextApiResponse)
{
    await cors(req, res)
    if(req.method === "POST")
    {
        let data = JSON.parse(req.body)
        const {email, password} = data
        if(email !== undefined && password !== undefined)
        {
            if(validateEmail(email)){
                if(true)
                {
                    let privateKey = fs.readFileSync('./SecureToken/jwtRS256.key', "utf8");
                    const data = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
                    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
                    res.setHeader('Access-Control-Allow-Credentials', "true")
                    res.setHeader(
                        "Set-Cookie",
                        cookie.serialize("token", "ok", {
                          httpOnly: true,
                          sameSite:"none",
                          path:"/",
                          secure: true,
                          maxAge: 60 * 60,
                        })
                      );
                      console.log("ok")
                    
                    
                    //res.setHeader('Set-Cookie', cookie.serialize("token", "ok"))
                    res.status(200).json({token:data})
                }
                else 
                {
                    res.status(205).json({error: "password invalid"})
                }
            }
            else 
            {
                res.status(205).json({error: "email invalid"})
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
            console.log(req)
        }
        
    }
    else{
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}