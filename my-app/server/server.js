const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const encryptor = require('file-encryptor');
const md5File = require('md5-file');

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


app.post('/submit', function(req, res) {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
    }
    const myFile = req.files.file;
    const myKey = req.files.key;
    myFile.mv(`${__dirname}/Listfile/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
    myKey.mv(`${__dirname}/Listkey/${myKey.name}`, function (err) {
      if (err) {
          console.log(err)
          // return res.status(500).send({ msg: "Error occured" });
      }
    });
    var options = {algorithm : null};
    switch(req.body.algo){
      case "DES":
        options = { algorithm: 'des' };
        break;
      case "RSA" :
        options = { algorithm: 'rsa' };
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
    fs.readFile(__dirname + '/Listkey/' + myKey.name, {encoding :'utf8'},(err,data) => {
      if(err)
        return res.send(err);
      if(req.body.option === "Encrypt"){
        encryptor.encryptFile(__dirname + '/Listfile/' + myFile.name, __dirname + '/Output/' + myFile.name + '.dat', data ,options, function(err) {
          // Encryption complete.
          console.log(myFile.name + " encrypted! ");
          md5File(__dirname + '/Listfile/' + myFile.name).then((hash) => {
            return res.send({check : hash});
          })
          fs.unlink(__dirname + '/Listkey/' + myKey.name,(err) => {
            if(err)
              console.log(err);
          });
          fs.unlink(__dirname + '/Listfile/' + myFile.name,(err) => {
            if(err)
              console.log(err);
          });
        });
      }
      if(req.body.option === "Decrypt"){
        encryptor.decryptFile(__dirname + '/Listfile/' + myFile.name, __dirname + '/Output/'+ myFile.name.split('.dat')[0], data,options, function(err) {
          // Decryption complete.
          console.log(myFile.name + " decrypted! ");
          md5File(__dirname + '/Output/'+ myFile.name.split('.dat')[0] ).then((hash) => {
            let check = hash.localeCompare(req.body.hashMd5);
            return res.send({checked : check });
          })
          fs.unlink(__dirname + '/Listkey/' + myKey.name,(err) => {
            if(err)
              console.log(err);
          });
          fs.unlink(__dirname + '/Listfile/' + myFile.name,(err) => {
            if(err)
              console.log(err);
          });
        });
      }
    });
});

app.get('/download', function (req, res) { 
  fs.readdir(__dirname + '/Output',(err,file) => {
    res.download(path.join(__dirname + '/Output/'+file), function (err) {
      if(err)
        console.log(err);
      fs.unlink(__dirname + '/Output/'+file, (err) => {
        if(err)
          console.log(err);
      });
    });
  })
});
//start your server on port 3001
app.listen(8080, () => {
  console.log('Server Listening on port 8080');
});