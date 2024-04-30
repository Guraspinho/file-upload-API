const express = require('express');
const multer = require('multer');
const { s3Uploadv3 } = require('./s3service');

// const { s3Uploadv2 } = require('./s3service');

const uuid = require('uuid').v4;
const app = express(); 
require('dotenv').config();

app.use(express.json());

// const upload = multer({dest:"uploads"});

// single file upload

// app.post('/upload', upload.single('file') ,(req,res) =>
// {
//     res.json({user:{msg:'File was uploaded suecessfully'}})
// });


// multiple file upload

// app.post('/upload', upload.array('file') ,(req,res) =>
// {
//     res.json({user:{msg:'File was uploaded suecessfully'}})
// });


// multiple file upload on different fields

// const multyUpload = upload.fields([{name:'profile', maxCount: 1},{name:'resume',maxCount:1}])

// app.post('/upload', multyUpload ,(req,res) =>
// {
//     console.log(req.files);
//     res.json({user:{msg:'File was uploaded suecessfully'}})
// });



// custom file name


// const storage = multer.diskStorage(
//     {
//         destination: (req,file,cb) =>
//         {
//             cb(null,"uploads")
//         },
//         // file here is an object which stores information abt the file that is being uploaded
//         filename: (req,file,cb) =>
//         {
//             const {originalname} = file;
//             cb(null,`${uuid()} - ${originalname}`);
//         }
//     }
// );



const storage = multer.memoryStorage();

// filter files by their extensions 
const fileFilter = (req,file,cb) =>
{
    if(file.mimetype.split("/")[0] === "image")
    {
        cb(null,true);
    }
    else
    {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"),false)
    }
}

const upload = multer({ storage, fileFilter, limits: {fileSize: 50000000} }); // filesize here is in bits

// using SDK v2

// app.post('/upload', upload.array('file') ,async (req,res) =>
// {
//     try
//     {
//         const results = await s3Uploadv2(req.files);
//         console.log(results);
//         return res.json({user:{msg:'File was uploaded suecessfully'}})
//     } 
//     catch (error)
//     {
//         console.log(error)
//     }

// });


// using SDK v3

app.post('/upload', upload.array('file') ,async (req,res) =>
{
    try
    {
        if(!req.files)
        {
            return res.json({user:{msg:'Please upload a file'}});
        }
        const file = req.files[0];
        const results = await s3Uploadv3(file);
        console.log(results);
        return res.json({user:{msg:'File was uploaded successfully'}})
    } 
    catch (error)
    {
        console.log(error)
    }

});







// handling the errors
app.use((error,req,res,next) =>
{
    if(error instanceof multer.MulterError)
    {
        if(error.code === "LIMIT_FILE_SIZE")
        {
            return res.json({user:{msg:"The file you are trying to upload is too big"}});
        }
        else if(error.code === "LIMIT_FILE_COUNT")
        {
            return res.json({user:{msg:"You are trying to upload too many files"}});
        }
        else if(error.code === "LIMIT_UNEXPECTED_FILE")
        {
            return res.json({user:{msg:"You can only upload images"}});
        }
    }
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});