//const {S3} = require('aws-sdk');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
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

exports.s3Uploadv3 = async (file) =>
{
    const s3client = new S3Client({
        region: 'nyc3', // replace with your Spaces region
        endpoint: 'https://nyc3.digitaloceanspaces.com', // replace with your Spaces endpoint
        credentials: {
            accessKeyId: process.env.SPACES_ACCESS_KEY, // replace with your Spaces access key
            secretAccessKey: process.env.SPACES_SECRET_KEY // replace with your Spaces secret key
        }
    });

    const param = 
    {
        Bucket: process.env.SPACES_BUCKET_NAME, // replace with your Spaces bucket name
        Key:`photos/${uuidv4()} - ${file.originalname}`,
        Body: file.buffer
    };

    await s3client.send(new PutObjectCommand(param));

    const url = `https://${param.Bucket}.nyc3.digitaloceanspaces.com/${encodeURIComponent(param.Key)}`; // replace with your Spaces URL

    return url;
}