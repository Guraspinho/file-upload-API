const express = require('express');
const multer = require('multer');
const { s3Uploadv3, s3Service } = require('./s3service');
const { getCommand, deleteCommand, uploadCommand, updateCommand, s3Operation } = require('./s3service');

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
        // const results = await s3Uploadv3(file);


        const { command, Key } = uploadCommand(file);
        const { response } = await s3Operation(Key, command);
        console.log(Key);

        return res.json({user:{msg:'File was uploaded successfully'}})
    } 
    catch (error)
    {
        console.log(error)
    }

});


app.get('/download', async (req,res) =>
{
    try
    {
        const command = getCommand('photos/b237b2c1-7a51-463c-a1df-13833ad5cc2c - 46996.png');
        const results = await s3Operation(command);
        console.log(results);   
        res.json({user:{msg:'File was downloaded successfully'}})
    }
    catch (error)
    {
        console.error(error);
    }
});


app.delete('/delete', async (req,res) =>
{
    try
    {
        const command = deleteCommand('photos/b237b2c1-7a51-463c-a1df-13833ad5cc2c - 46996.png');
        const results = await s3Operation(command);
        console.log(results);   
        res.json({user:{msg:'File was deleted successfully'}})
    }

    catch (error)
    {
        console.error(error);    
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






// file was uploaded, extracted the key and stored in a db
// key is used to access the file in the storage
// the url is signed and sent to the frontend

// key is used to display the file in the frontend
// key is used to delete the file
// key is used to update the file
// key is used to download the file






