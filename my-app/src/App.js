import React from'react';
import {ProgressBar,Form,Card, Container, Jumbotron, FormGroup, Button} from 'react-bootstrap';
import axios from 'axios';
import './App.css';
import Background1 from './5195ebb8c5f9772deda82aa2937134d3.jpg';
const sectionStyle1 = {
  width: "100%",
  height: "100%",
  padding : "5%",
  backgroundImage: `url(${Background1})`,
  backgroundSize : 'cover',
};


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
            uploadPercentage : 0,
            checkIntegrity : 1,
            isDisplayCheck : false,
            isDisplay : false,
            isFalse : false,
            error : null,
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
          isMd5 : false,
          isDisplayCheck : false,
          isFalse : false
        });
        if(this.state.isDone === true){
            this.setState({
                isDone : !this.state.isDone,
            });
        }
    };
    handleAlgo = (event) => {
        event.preventDefault();
        var value = event.target.value;
        this.setState({
            algo : value,
            isFalse : false
        })
        if(this.state.isDone === true){
            this.setState({
                isDone : !this.state.isDone,
            });
        }
    }
    upLoadFile = (evt) => {
        evt.preventDefault();
        this.setState({
            file: evt.target.files[0],
            isMd5 : false,
            isDisplayCheck:false,
            isFalse : false
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
            isMd5 : false,
            isDisplayCheck:false,
            isFalse : false
        });
        if(this.state.isDone === true){
            this.setState({
                isDone : !this.state.isDone,
            });
        }
    };
    handleSubmit = (event) => {
        event.preventDefault();
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
        if((this.state.key == null)){
            this.setState({
                isFalse : true,
                error : 'Bạn cần nhập key để thực thi',
                isMd5 : false
            })
            return;
        }
        if((this.state.file == null)){
            this.setState({
                isFalse : true,
                error : 'Bạn cần nhập file để thực thi',
                isMd5 : false
            })
            return;
        }
        if(this.state.option === "Decrypt" && this.state.file.name.slice(-4) !== '.dat'){
            this.setState({
                isFalse : true,
                error : 'Sai định dạng file',
                isMd5 : false
            })
            return;
        }
        if(this.state.key.name.slice(-4) !== '.txt'){
            this.setState({
                isFalse : true,
                error : 'Key được định dạng file .txt',
                isMd5 : false
            })
            return;
        }
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
                this.setState({error : response.data.typeerr, isDone : response.data.isFalse ? this.state.isDone : !this.state.isDone,buf : response.data.check, isFalse : response.data.isFalse ?response.data.isFalse : this.state.isFalse ,uploadPercentage: 100,checkIntegrity : response.data.checked,isDisplayCheck : response.data.isFalse ?  false: this.state.isDisplay ,isMd5 : response.data.isFalse ? false : this.state.isMd5 }, ()=>{
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
    }
    yesIntegrity = (event) => {
        this.setState({
            isIntegrity : false,
            checkMd5 : true,
            isDisplay : true
        })
    }
    noIntegrity = (event) => {
        this.setState({
            isIntegrity : false,
        })
    }
    hashvalue = (event) => {
        this.setState({
            hashMd5 : event.target.value,
            isDisplayCheck :false
        })
    }
    render(){
        return(
            <div className = "form" style = {sectionStyle1}>
                <Container className = "cccc">
                    <h1 className = "name"><i>Welcome to Cryptopgraphy Website</i></h1>
                        {/* <Jumbotron> */}
                        <Form className = "middle"onSubmit = {(event) => this.handleSubmit(event)}>
                            <FormGroup controlId = "optionCrypto">
                                <Form.Label><b>Chọn quá trình</b></Form.Label>
                                <Form.Control as = "select" placeholder = "Option" onChange = {(event) => this.handleChange(event)}>
                                    <option value = "Encrypt"> Mã hóa</option>
                                    <option value = "Decrypt">Giải mã</option>
                                </Form.Control>
                            </FormGroup>
                            <FormGroup controlId = "optionCrypto">
                                <Form.Label><b>Chọn giải thuật</b></Form.Label>
                                <Form.Control as = "select" placeholder = "Option" onChange = {(event) => this.handleAlgo(event)}>
                                    <option value = "AES128"> AES-128</option>
                                    <option value = "AES192"> AES-192</option>
                                    <option value = "AES256"> AES-256</option>
                                    <option value = "DES"> DES</option>
                                    <option value = "RSA"> RSA</option>
                                </Form.Control>
                            </FormGroup>
                            <FormGroup controlId = "fileEncrypt">
                            <Form.Label>{this.state.isEncrypt ? <b>Chọn file mã hóa</b> :  <b>Chọn file giải mã</b>}</Form.Label>
                                <Form.File id = "custom-file" label = {this.state.file ? (this.state.file.name):(this.state.isEncrypt ? "File mã hóa" : "File giải mã")} onChange = {(event) => this.upLoadFile(event)} custom  />
                                <Form.Text className = "text-muted">Chúng tôi sẽ không ghi nhận File của bạn như là dữ liệu của mình</Form.Text>
                            </FormGroup>
                            <FormGroup controlId = "fileKey">
                                <Form.Label><b>Chọn File khóa</b></Form.Label>
                                <Form.File id = "custom-file-key" label = {this.state.key ? (this.state.key.name) : 'Key'} onChange = {(event) => this.upLoadKey(event)} custom />
                            </FormGroup>
                            { this.state.isEncrypt? "" : 
                            <FormGroup controlId = "formIntergrity">
                                {this.state.isIntegrity ? (<Form.Label>Bạn có muốn kiểm tra tính toàn vẹn sau khi giải mã ?</Form.Label>):""}
                                {this.state.isIntegrity ? (<br/> ):''}
                                {this.state.isIntegrity ? (<Button variant = "outline-primary" onClick = {(event) => this.yesIntegrity(event)}>Có</Button>) : ""}{' '}
                                {this.state.isIntegrity ? (<Button variant = "outline-danger" onClick = {(event) => this.noIntegrity(event)}>Không</Button>) : ""}
                                {this.state.checkMd5 ? 
                                <Form.Label><b>Nhập Hash Value từ file gốc của bạn </b></Form.Label>
                                : ""
                                }
                                {this.state.checkMd5 ? 
                                <Form.Control placeholder = "Hash Value" onChange = {(event) => this.hashvalue(event)}></Form.Control>
                                : ""
                                }
                            </FormGroup>
                            }
                            {this.state.isDone ? "" : (<Button className = "upload" type = "submit" variant = "outline-info"> {this.state.option}</Button>)}
                            { this.state.uploadPercentage > 0 && <ProgressBar striped variant="info" animated now={this.state.uploadPercentage}  label={this.state.uploadPercentage.toString() + '%'} /> }<br/>
                        </Form>
                        
                        <Form  className = "result" action = "http://localhost:8080/download" onSubmit = {(event) => this.handleDownload(event)}>
                            {this.state.isDone ? (  <Button className = "download" type = "submit" variant = "outline-info" size="lg" block>Download</Button>) : '' }
                            {this.state.isMd5 ? (<Card><Card.Header><i>Bạn có thể lưu Hash value sau để đảm bảo tính toàn vẹn khi giải mã</i></Card.Header><Card.Body>{this.state.buf}</Card.Body></Card>) : ""}
                            {this.state.isFalse ? (<Card><Card.Header><i>{this.state.error}</i></Card.Header></Card>) : ""}
                            {this.state.isIntegrity ? '':
                                (this.state.isDisplayCheck ?  (<Card><Card.Header><i>File của bạn</i> {this.state.checkIntegrity ? <i>không </i> : '' }<i>toàn vẹn</i></Card.Header></Card>) : '')
                            }
                        </Form>
                    {/* </Jumbotron> */}
                </Container>
            </div>
        )
    }
}
export default UserForm;