import React, { Component } from 'react'
import { Card } from 'antd'
import { Upload, message, Icon } from 'antd';
import { TOKEN_KEY } from '../constants/auth';
// import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function uploadFile(base64, file) {
  console.log(file);
  console.log(base64);

  let requestObject={
    fileID: localStorage.getItem('fileId'),
    name: file.name,
    confidential: "True",
    file: base64
  }

  const fileID = localStorage.getItem('fileId');
  const stepID = localStorage.getItem('stepId');

  const url = window.__env__.API_URL + '/blink/api/file?fileID=' + fileID + '&stepID=' + stepID;
        axios
          .put(
            url,
            requestObject,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem(TOKEN_KEY)
              }
            }
          )
          .then(response => {
            if (response.status === 200) {
              message.success('Data saved successfully');
              markStepComplete();
            }
          })
          .catch(function(error) {
            message.destroy();
            if (error.response) {
              // Request made and server responded
              message.error(error.response.data.error);
            } else if (error.request) {
              // The request was made but no response was received
              message.error('Server not responding');
            } else {
              // Something happened in setting up the request that triggered an Error
              message.error('Error setting up request');
            }
          });
}

function markStepComplete() {
  const url = window.__env__.API_URL + '/blink/api/workflow/step/complete?id=' + localStorage.getItem('stepId');;
        axios
          .put(
            url,
            null,
            {
              headers: {
                Authorization: localStorage.getItem(TOKEN_KEY)
              }
            }
          )
          .then(response => {
            if (response.status === 200) {
              window.location.href = '/dashboard';
            }
          })
          .catch(function(error) {
            message.destroy();
            if (error.response) {
              // Request made and server responded
              message.error(error.response.data.error);
            } else if (error.request) {
              // The request was made but no response was received
              message.error('Server not responding');
            } else {
              // Something happened in setting up the request that triggered an Error
              message.error('Error setting up request');
            }
          });
}

const props = {
  name: 'file',
  multiple: false,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  beforeUpload(file) {
    getBase64(file).then(
      data => uploadFile(data, file)
    );
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default class Uploads extends Component {
  
  render() {
    return (
      <Card title="Upload">
        <Card style={{ width: "60%", margin: "auto", height: "40vh", display: "flex", flexDirection: "column", justifyContent: "center", }}>
          <Dragger {...props} style={{  margin: "auto", padding: "0 0", width: "70%", height: "50%"}}>
            <p className="ant-upload-drag-icon">
            <Icon type="inbox" theme="outlined"/>
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other
              band files
            </p>
          </Dragger>
        </Card>
      </Card>
    )
  }
}
