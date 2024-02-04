const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const uniqid = require('uniqid');
const dotenv = require('dotenv');
dotenv.config();

const uploadFileToS3 = async (req, res) => {
    const file = req.files?.file;

    if (file) {
        const s3Client = new S3Client({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
        });

        const randomId = uniqid();
        const ext = file.name.split('.').pop();
        const newFilename = `${randomId}.${ext}`;

        try {
            const result = await s3Client.send(new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: newFilename,
                ACL: 'public-read',
                Body: file.data,
                ContentType: file.mimetype,
            }));

            const url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${newFilename}`;
            res.json(url);
        } catch (error) {
            console.error('Error uploading to S3:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(400).json({ error: 'No file provided' });
    }
};

module.exports = uploadFileToS3;
