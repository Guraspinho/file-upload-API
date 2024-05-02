//const {S3} = require('aws-sdk');
const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { v4: uuidv4 } = require('uuid');

// exports.s3Uploadv2 = async (files) =>
// {
//     const s3 = new S3();
//     const params = files.map(file =>
//     {
        
//         return {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key:`uploads/${uuid()} - ${file.originalname}`,
//             Body: file.buffer
//         };
//     });
//     return await Promise.all(params.map(param =>
//         {
//             s3.upload(param).promise();
//         }));
// }

// exports.s3Uploadv3 = async (files) =>
// {
//     const s3client = new S3Client();

//     const params = files.map(file =>
//         {
//             return {
//                 Bucket: process.env.AWS_BUCKET_NAME,
//                 Key:`uploads/${uuid()} - ${file.originalname}`,
//                 Body: file.buffer
//             };
//         });

//         return await Promise.all(params.map(param => s3client.send(new PutObjectCommand(param))));

// }


// amazon s3

// exports.s3Uploadv3 = async (file) =>
// {
//     const s3client = new S3Client();

//     const param = 
//     {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key:`photos/${uuid()} - ${file.originalname}`,
//         Body: file.buffer
//     };

//     await s3client.send(new PutObjectCommand(param));

//     const url = `https://${param.Bucket}.s3.amazonaws.com/${encodeURIComponent(param.Key)}`;

//     return url;
// }


// Digitalocean Spaces


// uploads a file to digitalocean spaces


// exports.s3Uploadv3 = async (file) =>
// {
    
//     const s3client = new S3Client({
//         region: 'nyc3', // replace with your Spaces region
//         endpoint: 'https://nyc3.digitaloceanspaces.com', // replace with your Spaces endpoint
//         credentials: {
//             accessKeyId: process.env.SPACES_ACCESS_KEY, // replace with your Spaces access key
//             secretAccessKey: process.env.SPACES_SECRET_KEY // replace with your Spaces secret key
//         }
//     });
//     const param = 
//     {
//         Bucket: process.env.SPACES_BUCKET_NAME, // replace with your Spaces bucket name
//         Key:`photos/${uuidv4()} - ${file.originalname}`,
//         Body: file.buffer
//     };

//     await s3client.send(new PutObjectCommand(param));

//     const url = `https://${param.Bucket}.nyc3.digitaloceanspaces.com/${encodeURIComponent(param.Key)}`; // replace with your Spaces URL

//     return url, param;
// }






// for getting an object (file) from digitalocean spaces

const getCommand = (Key) =>
{
    return new GetObjectCommand(
        {
            Bucket: process.env.SPACES_BUCKET_NAME,
            Key
        }
    );
}

// for deleting an object (file) from digitalocean spaces

const deleteCommand = (Key) =>
{
    return new DeleteObjectCommand(
        {
            Bucket: process.env.SPACES_BUCKET_NAME,
            Key
        }
    );
}

// for uploading an object (file) to digitalocean spaces

const uploadCommand = (file) =>
{
    const Key = `photos/${uuidv4()} - ${file.originalname}`;
    return {
        Key,
        command: new PutObjectCommand({
            Bucket: process.env.SPACES_BUCKET_NAME,
            Key,
            Body: file.buffer
        })
    };
}

// for updating an object (file) in digitalocean spaces

const updateCommand = (Key, file) =>
{
    return new PutObjectCommand(
        {
            Bucket: process.env.SPACES_BUCKET_NAME,
            Key,
            Body: file.buffer
        }
    );
}    

const s3Operation = async (Key, command) => {
    const s3client = new S3Client({
        region: 'nyc3',
        endpoint: 'https://nyc3.digitaloceanspaces.com',
        credentials: {
            accessKeyId: process.env.SPACES_ACCESS_KEY,
            secretAccessKey: process.env.SPACES_SECRET_KEY
        }
    });

    const response = await s3client.send(command);
    return { Key, response };
}

const getSignedUrlFunction = async (Key) =>
{
    const s3client = new S3Client({
        region: 'nyc3',
        endpoint: 'https://nyc3.digitaloceanspaces.com',
        credentials: {
            accessKeyId: process.env.SPACES_ACCESS_KEY,
            secretAccessKey: process.env.SPACES_SECRET_KEY
        }
    });

    const command = new GetObjectCommand({
        Bucket: process.env.SPACES_BUCKET_NAME,
        Key: Key
    });

    const signedUrl = await getSignedUrl(s3client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return signedUrl;
}


module.exports =
{
    getCommand,
    deleteCommand,
    uploadCommand,
    updateCommand,
    s3Operation,
    getSignedUrlFunction
}