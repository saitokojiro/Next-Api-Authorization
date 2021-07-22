import {NextApiRequest , NextApiResponse} from "next"
import fs from 'fs'

export default function handler(req : NextApiRequest, res: NextApiResponse)
{
    if(req.method === "GET")
    {
        const publicKey =  fs.readFileSync('./SecureToken/jwtRS256.key.pub', "utf-8")
        res.status(200).send(publicKey)
    }
    else{
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}