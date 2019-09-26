import db from "./db";
import jwt from "jsonwebtoken";
import express from "express";
import methodOverride from 'method-override';
import session from "express-session";
import { User } from "./models/user";
import { VideoObj } from "./models/video";

import adminRouter from "./routes/admin";
import dashboardRouter from "./routes/dashboard";

const dotenv = require('dotenv');

const JWT_SECRET = process.env.JWT_SECRET;

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(methodOverride('_method'))
app.use(express.static('public'));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const verifyToken = (req, res, next) => {
    try{
        if (req.session.loggedIn){
            console.log('SESSION VALUES:---------------')
            console.log(req.session);
            const token = req.query.token;
            console.log('verifying token');
            console.log(token);
            const a = jwt.verify(token, JWT_SECRET);
            console.log(a);
            next();
        } else {
            console.log('invalid session')
            res.redirect('/');
        }        
    } catch (err) {
        res.redirect('/');
    }   
}

// LOGIN PAGE
app.get('/', (req, res) => {
    res.render('login', { flash: null });
});
app.get('/login', (req, res) => {
    res.render('login', { flash: null });
});


// Routes
app.use('/admin', verifyToken, adminRouter);
app.use('/dashboard', verifyToken, dashboardRouter);


// LOGIN
app.post('/login', async (req: any, res: any, next) => {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email, password }).exec();

    if ( user ){

        const token = jwt.sign({
            userId: user._id,
            name: user.name,
            role: user.role
        }, JWT_SECRET);

        req.session.loggedIn = true;

        if (user.role === 'admin'){
            res.redirect(`/admin/?token=${token}`);        
        } else {         
            res.redirect(`/dashboard?token=${token}`);
        }
    } else {
        next('login-error');
    }
});

app.get('/logout', (req: any, res, next) => {
    req.session.loggedIn = false;
});

app.get('/checkout', (req: any, res) => {

    console.log('called');

    const name = {
        name: 'abc',
        name2: 'abc2' 
    };

    res.status(500).json(name);
});


// app.post('/add-dummy-image/:id', upload.single('photo'), async (req, res) => {
//     console.log(req.body.filename);
//     console.log(req);
    
//     await ImageObj.create({ url: s3_base_url + req.params.id + ".jpg", name: req.body.filename});
//     res.send('Dummy Image uploaded');
// });


app.use(( err, req, res, next) => {
    if (err === 'login-error'){
        res.render('login', { flash: 'Invalid credentials'});
    } else {
        next(err);
    }
});


app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.render('error-page', { flash: "Something went wrong!"})
});

const addVideo = async () => {
    await VideoObj.create({
        url: "https://khatabook-videos.s3.ap-south-1.amazonaws.com/SampleVideo_1280x720_5mb.mp4"
    });
}

const updateVideo = async () => {
    await VideoObj.updateMany({}, {$set: {
        thumbnail: "https://khatabook-videos.s3.ap-south-1.amazonaws.com/default_thumbnail.jpeg"
    }})
}



db.once('open', ()=> {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=>{
        console.log(`Listening on ${PORT}!`);        
        // updateVideo();
    });
});
