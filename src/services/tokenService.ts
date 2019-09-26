import * as jwt from "jsonwebtoken";

export const checkAccessToken = async (req: any, res: any, next: any) => {
    try{

    const access_token = req.headers.authorization.split(" ")[1];

    const JWT_SECRET = process.env.JWT_SECRET;

    console.log(access_token);

    const payload = await jwt.verify(access_token, JWT_SECRET);
    req.body.payload = payload;

    next();
    } catch (err) {
        res.status(401).redirect('/login');
    }
}
