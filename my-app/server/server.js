const express = require('express');
const encryptor = require('file-encryptor');
const md5File = require('md5-file');
const NodeRSA = require('node-rsa');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var triggerFalse = false;
process.on('uncaughtException', function (err) {
  console.log('Something went wrong! ');
  triggerFalse = true;
});

setTimeout(function () {
  console.log('This will still run.');
}, 500);
var fileDownload = '';
app.post('/submit', function(req, res) {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
    }
    fs.unlink(__dirname + '/Output/'+fileDownload, (err) => {
      if(err)
        console.log("No file to delete");
    });
    const myFile = req.files.file;
    const myKey = req.files.key;
    var options = {algorithm : null};
    switch(req.body.algo){
      case "DES":
        options = { algorithm: 'des' };
        break;
      case "AES128" : 
        options = { algorithm: 'aes128' };
        break;
      case "AES192" : 
        options = { algorithm: 'aes192' };
        break;
      case "AES256" : 
        options = { algorithm: 'aes256' };
        break;
      default :
        options = { algorithm: 'aes256' };
    }
    myFile.mv(`${__dirname}/Listfile/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // return res.send({name: myFile.name, path: `/${myFile.name}`});
        if(req.body.option === "Encrypt"){
          fileDownload = myFile.name + '.dat';
          if(req.body.algo === "RSA"){
            const key = new NodeRSA();
            try{
              key.importKey(myKey.data);
            }
            catch(err){
              res.send({isFalse : true, typeerr : "Key không phù hợp"});
            }
            fs.readFile(__dirname + '/Listfile/' + myFile.name,(err,file) => {
              var encrypted = null;
              try{
                encrypted = key.encrypt(file);
              }
              catch(err){
                res.send({isFalse : true, typeerr : "Key không phù hợp"});
              }
              fs.writeFileSync(__dirname + '/Output/' + myFile.name + '.dat',encrypted);
              md5File(__dirname + '/Listfile/' + myFile.name).then((hash) => {
                console.log(myFile.name + " encrypted! ");
                return res.send({check : hash});
              })
              fs.unlink(__dirname + '/Listfile/' + myFile.name,(err) => {
                if(err)
                  console.log("No file to delete");
              });
            })
          }
          else{
            encryptor.encryptFile(__dirname + '/Listfile/' + myFile.name, __dirname + '/Output/' + myFile.name + '.dat', myKey.data,options, function(err) {
              // Encryption complete.
              console.log(myFile.name + " encrypted! ");
              md5File(__dirname + '/Listfile/' + myFile.name).then((hash) => {
                return res.send({check : hash});
              })
              fs.unlink(__dirname + '/Listfile/' + myFile.name,(err) => {
                if(err)
                  console.log("No file to delete");
              });
            });
          }
        }
        if(req.body.option === "Decrypt"){
          fileDownload = myFile.name.split('.dat')[0]; 
          if(req.body.algo === "RSA"){
            const key = new NodeRSA();
            try{
              key.importKey(myKey.data);
            }
            catch(err){
              res.send({isFalse : true, typeerr : "Key hoặc File không phù hợp"});
            }
            // console.log(key.exportKey('pkcs8-private')); 
            fs.readFile(__dirname + '/Listfile/' + myFile.name,(err,file) => {
              var decrypted = null;
              try{
                decrypted = key.decrypt(file);
              }
              catch(err){
                res.send({isFalse : true, typeerr : "Key hoặc File không phù hợp"});
              }
              fs.writeFileSync(__dirname + '/Output/' + myFile.name.split('.dat')[0],decrypted);
              console.log(myFile.name + " decrypted! ");
              md5File(__dirname + '/Output/'+ myFile.name.split('.dat')[0] ).then((hash) => {
                let check = hash.localeCompare(req.body.hashMd5);
                return res.send({checked : check });
              })
              fs.unlink(__dirname + '/Listfile/' + myFile.name,(err) => {
                if(err)
                  console.log("No file to delete");
              });
            })
          }
          else{
              encryptor.decryptFile(__dirname + '/Listfile/' + myFile.name, __dirname + '/Output/'+ myFile.name.split('.dat')[0], myKey.data,options, function(err) {
                // Decryption complete.
                console.log(myFile.name + " decrypted! ");
                md5File(__dirname + '/Output/'+ myFile.name.split('.dat')[0] ).then((hash) => {
                  let check = hash.localeCompare(req.body.hashMd5);
                  return res.send({checked : check });
                })
                fs.unlink(__dirname + '/Listfile/' + myFile.name,(err) => {
                  if(err)
                    console.log("No file to delete");
                });
              });
          }
        }
      });
    });
app.get('/download', function (req, res) { 
    res.download(path.join(__dirname + '/Output/'+fileDownload), function (err) {
      if(err)
        console.log("Can not delete");
      fs.unlink(__dirname + '/Output/'+fileDownload, (err) => {
        if(err)
          console.log("No file to delete");
      });
    });
});
app.listen(8080, () => {
  console.log('Server Listening on port 8080');
});