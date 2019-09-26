import express from "express";
import { ImageObj } from "../models/image";
import { UserImage } from "../models/userImage";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { VideoObj } from "../models/video";
import ImagesRouter from "../routes/images";
const uuid = require('uuid/v1');
import moment from "moment";


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const checkAdmin = (req, res, next) => {
    const token = req.query.token;
    
    if ( token == null) {
        console.log(req.query);
        next('Unathorized');
    } else {        
        const v: any = jwt.verify(token, JWT_SECRET);
        if (v.role === 'admin'){
            next();
        } else {
            next('403');
        }        
    }    
}

router.use(checkAdmin);

router.use('/images', ImagesRouter);


// check if user is admin else redirect to dashboard -- saying unauthorized

router.get('/', async (req, res) => {

    const users = await User.find({});
    
    // const images = await ImageObj.find({}).sort({createdAt: -1}).populate('uploadedBy');
    
    const videos = await VideoObj.find({}).sort({createdAt: -1}).populate('uploadedBy');

    res.render('admin', {
        flash: null, users, videos, token: req.query.token
    });
});

router.post('/', async (req, res) => {
    console.log(req.body);

    const { name, password, email } = req.body;
    await User.create({
        name, password, email
    });

    const users = await User.find({});
    // const images = await ImageObj.find({}).populate('uploadedBy');
    const videos = await VideoObj.find({}).populate('uploadedBy');

    // console.log(images);

    res.render('admin', {
        flash: "User added successfully",
        users,        
        videos,
        token: req.query.token
    });
});

// Edit User
router.post('/users/:id', async (req, res) => {
    const id = req.params.id;

    console.log(req);

    const { name, email , password } = req.body;

    await User.findOneAndUpdate({ _id: id },
         { $set: {
             name, email, password
         }
    });
    const users = await User.find({});
    
    // const images = await ImageObj.find({}).populate('uploadedBy');
    const videos = await VideoObj.find({}).populate('uploadedBy');

    res.render('admin', {
        flash: "User updated successfully.",
        users, videos, token: req.query.token
    });    
});


router.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    await User.findOneAndRemove({ _id: id });

    const users = await User.find({});
    
    // const images = await ImageObj.find({}).populate('uploadedBy');
    const videos = await VideoObj.find({}).populate('uploadedBy');

    console.log('user deleted successfully');

    res.render('admin', {
        flash: "User deleted successfully.",
        users,  videos, token: req.query.token
    });    
});


router.delete('/images/:id', async (req, res) => {
    const id = req.params.id;

    console.log(await ImageObj.findOneAndRemove({ _id: id }));

    const users = await User.find({});  
    const videos = await VideoObj.find({}).populate('uploadedBy');

    console.log('image deleted successfully');

    res.render('admin', {
        flash: "Image deleted successfully.",
        users, videos, token: req.query.token
    });    
});

router.delete('/videos/:id', async (req, res) => {
    const id = req.params.id;

    console.log(await VideoObj.findOneAndRemove({ _id: id }));

    const users = await User.find({});

    console.log('video deleted successfully');
    
    // const images = await ImageObj.find({}).populate('uploadedBy');
    const videos = await VideoObj.find({}).populate('uploadedBy');

    res.render('admin', {
        flash: "Video deleted successfully.",
        users, videos, token: req.query.token
    });    
});



export default router;