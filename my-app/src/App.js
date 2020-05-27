import React from'react';
import {ProgressBar,Form,Card, Container, Jumbotron, FormGroup, Button} from 'react-bootstrap';
import axios from 'axios';
// import { CardHeader } from 'react-bootstrap/Card';

class UserForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isDone : false,
            isEncrypt : true,
            isMd5 : false,
            isIntegrity : true,
            hashMd5 : null,
            checkMd5 : false,
            option : "Encrypt",
            algo : "AES128",
            file: null,
            key : null,
            buf : null,
            uploadPercentage : 0
        };
    };
    handleChange = (event) => {
        event.preventDefault();
        var algo = true;
        var value = event.target.value;   
        if(value === "Encrypt")
            algo = true;
        else    
            algo = false;
        this.setState({
          option: value,
          isEncrypt : algo,
          isIntegrity : true,
          checkMd5 : false,
          isMd5 : false
        });
    };
    handleAlgo = (event) => {
        event.preventDefault();
        var value = event.target.value;
        this.setState({
            algo : value
        })
    }
    upLoadFile = (evt) => {
        evt.preventDefault();
        this.setState({
            file: evt.target.files[0],
            isMd5 : false
        });
        if(this.state.isDone === true){
            this.setState({
                isDone : !this.state.isDone,
            });
        }
    };
    upLoadKey = (evt) => {
        evt.preventDefault();
        this.setState({
            key: evt.target.files[0],
            isMd5 : false
        });
        if(this.state.isDone === true){
            this.setState({
                isDone : !this.state.isDone,
            });
        }
    };
    handleSubmit = (event) => {
        event.preventDefault();
        // this.setState({
        //     isDone : !this.state.isDone
        // })
        if(this.state.isEncrypt === false){
            this.setState({
                isMd5 : false,
            })
        }
        else{
            this.setState({
                isMd5 : true
            })
        }
        // if(this.state.isDone === false){
        //     this.setState({
        //         isDone : !this.state.isDone
        //     });
        // }
        const formData = new FormData();
        const {option,algo,file,key,hashMd5} = this.state;
        formData.append('option',option);
        formData.append('algo',algo);
        formData.append('file',file);
        formData.append('key',key);
        formData.append('hashMd5',hashMd5);
        const config = { 
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                const {loaded, total} = progressEvent;
                let percent = Math.floor( (loaded * 100) / total )
                console.log( `${loaded}kb of ${total}kb | ${percent}%` );
        
                if( percent < 100 ){
                  this.setState({ uploadPercentage: percent })
                }
              }
        };
        axios
            .post('http://localhost:8080/submit',formData,config)
            .then((response) => {
                console.log(this.state.isDone);
                // this.setState({
                //     isDone : !this.state.isDone,
                //     buf : response.data.check,
                // });
                this.setState({ isDone : !this.state.isDone,buf : response.data.check, uploadPercentage: 100 }, ()=>{
                    setTimeout(() => {
                      this.setState({ uploadPercentage: 0 })
                    }, 1000);
                  })
                console.log(response);
                return response;
            })
            .catch(err => {
                console.error(err.response);
            });
    };
    handleDownload = (event) => {
        this.setState({
            isDone : !this.state.isDone
        });
        // return true;
        // const config = { headers: { 'Content-Type': 'multipart/form-data' }};
        // axios
        //     .get('http://localhost:8080/download',config)
        //     .then((response) => {
        //         console.log("cccccccccccccccccccccccccc");
        //     })
        //     .catch(err => {
        //         console.error(err.response);
        //     });
    }
    yesIntegrity = (event) => {
        this.setState({
            isIntegrity : false,
            checkMd5 : true
        })
    }
    noIntegrity = (event) => {
        this.setState({
            isIntegrity : false,
        })
    }
    hashvalue = (event) => {
        this.setState({
            hashMd5 : event.target.value
        })
    }
    render(){
        return(
            <Container className = "p-3">
                <Jumbotron>
                    <h1>Welcome to Cryptopgraphy Website</h1>
                    <Form onSubmit = {(event) => this.handleSubmit(event)}>
                        <FormGroup controlId = "optionCrypto">
                            <Form.Label>Chọn quá trình</Form.Label>
                            <Form.Control as = "select" placeholder = "Option" onChange = {(event) => this.handleChange(event)}>
                                <option value = "Encrypt"> Mã hóa</option>
                                <option value = "Decrypt">Giải mã</option>
                            </Form.Control>
                        </FormGroup>
                        <FormGroup controlId = "optionCrypto">
                            <Form.Label>Chọn giải thuật</Form.Label>
                            <Form.Control as = "select" placeholder = "Option" onChange = {(event) => this.handleAlgo(event)}>
                                <option value = "AES128"> AES-128</option>
                                <option value = "AES192"> AES-192</option>
                                <option value = "AES256"> AES-256</option>
                                <option value = "DES"> DES</option>
                                <option value = "RSA"> RSA</option>
                            </Form.Control>
                        </FormGroup>
                        <FormGroup controlId = "fileEncrypt">
                        <Form.Label>{this.state.isEncrypt ? "Chọn file mã hóa" :  "Chọn file giải mã"}</Form.Label>
                            <Form.File id = "custom-file" label = {this.state.file ? (this.state.file.name):(this.state.isEncrypt ? "File mã hóa" : "File giải mã")} onChange = {(event) => this.upLoadFile(event)} custom  />
                            <Form.Text className = "text-muted">Chúng tôi sẽ không ghi nhận File của bạn như là dữ liệu của mình</Form.Text>
                        </FormGroup>
                        <FormGroup controlId = "fileKey">
                            <Form.Label>Chọn File khóa</Form.Label>
                            <Form.File id = "custom-file-key" label = {this.state.key ? (this.state.key.name) : 'Key'} onChange = {(event) => this.upLoadKey(event)} custom />
                        </FormGroup>
                        { this.state.isEncrypt? "" : 
                        <FormGroup controlId = "formIntergrity">
                            {this.state.isIntegrity ? (<Form.Label>Bạn có muốn kiểm tra tính toàn vẹn sau khi giải mã ?</Form.Label>):""}
                            {this.state.isIntegrity ? (<Button variant = "outline-primary" onClick = {(event) => this.yesIntegrity(event)}>Có</Button>) : ""}{' '}
                            {this.state.isIntegrity ? (<Button variant = "outline-danger" onClick = {(event) => this.noIntegrity(event)}>Không</Button>) : ""}
                            {this.state.checkMd5 ? 
                            <Form.Label>Nhập Hash Value từ file gốc của bạn </Form.Label>
                            : ""
                            }
                            {this.state.checkMd5 ? 
                            <Form.Control placeholder = "Hash Value" onChange = {(event) => this.hashvalue(event)}></Form.Control>
                            : ""
                            }
                        </FormGroup>
                        }
                        {this.state.isDone ? "" : (<button className="btn btn-primary" type = "submit" > {this.state.option}</button>)}
                        { this.state.uploadPercentage > 0 && <ProgressBar now={this.state.uploadPercentage} active label={`${this.state.uploadPercentage}%`} /> }
                    </Form>
                    <br/>
                    <Form  action = "http://localhost:8080/download" onSubmit = {(event) => this.handleDownload(event)}>
                        {this.state.isDone ? (<button className="btn btn-primary" type = "submit" >Download</button>) : '' }
                        {this.state.isMd5 ? (<Card><Card.Header>Bạn có thể lưu Hash value sau để đảm bảo tính toàn vẹn khi giải mã</Card.Header><Card.Body>{this.state.buf}</Card.Body></Card>) : ""}
                    </Form>
                </Jumbotron>
            </Container>
        )
    }
}
export default UserForm;