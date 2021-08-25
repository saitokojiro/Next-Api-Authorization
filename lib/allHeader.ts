export default function OriginSite(req:any,res:any)
{

    res.setHeader('Access-Control-Allow-Origin',"http://localhost:3000"),
    //res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Credentials', "true"),
    res.setHeader('Content-Type', "application/json")
}