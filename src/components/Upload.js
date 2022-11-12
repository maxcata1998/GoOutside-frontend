import React , {useState} from 'react';
import S3 from 'react-aws-s3';
import FileHeader from "./FileHeader";

// installed using npm install buffer --save
window.Buffer = window.Buffer || require("buffer").Buffer;

// a React functional component, used to create a simple upload input and button

  
  const Upload = ({setImageUrl, ImageUrl}) => {

    const addImageUrl = (url) => {
      setImageUrl([...ImageUrl, url])
    }
  
    const deleteImageUrl = (url) => {
      setImageUrl(ImageUrl.filter(f => f !== url));
    }

    const [selectedFile, setSelectedFile] = useState(null);

    // the configuration information is fetched from the .env file
    const config = {
        bucketName: process.env.REACT_APP_BUCKET_NAME,
        region: process.env.REACT_APP_REGION,
        accessKeyId: process.env.REACT_APP_ACCESS,
        secretAccessKey: process.env.REACT_APP_SECRET,
    }

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const ReactS3Client = new S3(config);

    const uploadFile = async (file) => {
      // the name of the file uploaded is used to upload it to S3
      ReactS3Client
      .uploadFile(file, file.name)
      .then(data => {console.log(data.location); addImageUrl(data.location);})
      .catch(err => console.error(err));
    }

    const deleteFile = async (fileUrl) => {
      let filename = fileUrl.slice(45);
      console.log(filename);
      ReactS3Client
      .deleteFile(filename)
      .then(response => {console.log(response); deleteImageUrl(fileUrl)})
      .catch(err => console.error(err));
    }

    return(
      <div>
        <div>Image Upload</div>
        <input type="file" onChange={handleFileInput}/>
        <br></br>
        <button onClick={() => uploadFile(selectedFile)}> Upload </button>
        {ImageUrl && ImageUrl.map((url) => {
          return (
            <FileHeader url={url} deleteFile={deleteFile}></FileHeader>
          )
        })}
      </div>
    )
}

export default Upload;