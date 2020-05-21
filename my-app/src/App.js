import React from'react';
import {Form, Container, Jumbotron, FormGroup} from 'react-bootstrap';
import axios from 'axios';

class UserForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isDone : false,
            isEncrypt : true,
            option : "Encrypt",
            algo : null,
            file: null,
            key : null
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
          isEncrypt : algo
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
        });
        if(this.state.isDone === true){
            this.setState({
                isDone : !this.state.isDone
            });
        }
    };
    upLoadKey = (evt) => {
        evt.preventDefault();
        this.setState({
            key: evt.target.files[0],
        });
        if(this.state.isDone === true){
            this.setState({
                isDone : !this.state.isDone
            });
        }
    };
    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.isDone === false){
            this.setState({
                isDone : !this.state.isDone
            });
        }
        const formData = new FormData();
        const {option,algo,file,key} = this.state;
        formData.append('option',option);
        formData.append('algo',algo);
        formData.append('file',file);
        formData.append('key',key);
        const config = { headers: { 'Content-Type': 'multipart/form-data' }};
        axios
            .post('http://localhost:8080/submit',formData,config)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch(err => {
                console.error(err.response);
            });
    };
    handleDownload = (event) => {
        event.preventDefault();
        const config = { headers: { 'Content-Type': 'multipart/form-data' }};
        axios
            .get('http://localhost:8080/download',config)
            .then((response) => {
                console.log(response);
            })
            .catch(err => {
                console.error(err.response);
            });
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
                                <option value = "DES"> DES</option>
                                <option value = "AES"> AES</option>
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
                        <button className="btn btn-primary" type = "submit" > {this.state.option}</button>
                    </Form>
                    <Form onSubmit = {(event) => this.handleDownload(event)} action = "http://localhost:8080/download">
                        {this.state.isDone ? (<a className= "btn btn-primary" href = "http://localhost:8080/download" >File   {this.state.option}ed  </a>) : '' }
                    </Form>
                </Jumbotron>
            </Container>
        )
    }
}
export default UserForm;