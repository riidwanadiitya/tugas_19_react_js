import React, { Component } from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, Container, Form, Header, Icon, Table } from 'semantic-ui-react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainData: [],
      edit: false,
      dataPost: {
        id: 0,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: ""
      }
    };
  };

  inputChange = (e) => {
    let newdataPost = { ...this.state.dataPost };

    if (this.state.edit === false) {
      newdataPost['id'] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;
    this.setState({
      dataPost: newdataPost
    }, () => console.log(this.state.dataPost))
  };

  clearInputData = () => {
    let newdataPost = { ...this.state.dataPost };
    newdataPost['id'] = "";
    newdataPost['nama_karyawan'] = "";
    newdataPost['jabatan'] = "";
    newdataPost['jenis_kelamin'] = "";
    newdataPost['tanggal_lahir'] = "";
    this.setState({
      dataPost: newdataPost
    })
  };

  reloadData = () => {
    axios('http://localhost:4000/data-karyawan').then(res => {
      this.setState({
        mainData: res.data
      })
    });
  };

  handleSubmit = () => {
    if (this.state.edit === false) {
      axios.post(`http://localhost:4000/data-karyawan`, this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearInputData();
        })
    } else {
      axios.put(`http://localhost:4000/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearInputData();
        })
    }
  };

  handleRemove = (e) => {
    console.log(e.target.value);
    axios.delete(`http://localhost:4000/data-karyawan/${e.target.value}`)
      .then(res => {
        this.reloadData();
        this.clearInputData();
      })
  };

  handleEdit = (e) => {
    console.log(e.target.value);
    axios.get(`http://localhost:4000/data-karyawan/${e.target.value}`)
      .then(res => {
        this.setState({
          dataPost: res.data,
          edit: true
        });
      });

  };

  componentDidMount() {
    this.reloadData();
  };

  render() {
    return (
      <div>

        <Container fluid>
          <Header
            as="h1" textAlign="center"
            style={{ backgroundColor: "maroon", color: "white", padding: "15px" }}
          >
            <Icon name="group" />
            Data Karyawan
            </Header>

          <Container>
            <Form>
              <Form.Group widths="equal">
                <Form.Input value={this.state.dataPost.nama_karyawan} onChange={this.inputChange} placeholder="Masukkan Nama Karyawan" name="nama_karyawan" />
                <Form.Input value={this.state.dataPost.jabatan} onChange={this.inputChange} placeholder="Masukkan Jabatan" name="jabatan" />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input value={this.state.dataPost.jenis_kelamin} onChange={this.inputChange} placeholder="Masukkan Jenis Kelamin" name="jenis_kelamin" />
                <Form.Input type="date" value={this.state.dataPost.tanggal_lahir} onChange={this.inputChange} name="tanggal_lahir" />
              </Form.Group>
              <Button primary fluid type="submit" onClick={this.handleSubmit}>Save Data</Button>
            </Form>
          </Container>

          <br /><br />

          {/* <input type="text" value={this.state.dataPost.nama_karyawan} name="nama_karyawan" placeholder="Masukkan Nama Karyawan" onChange={this.inputChange} /> &nbsp;
        <input type="text" value={this.state.dataPost.jabatan} name="jabatan" placeholder="Masukkan Jabatan" onChange={this.inputChange} /> &nbsp;
        <input type="text" value={this.state.dataPost.jenis_kelamin} name="jenis_kelamin" placeholder="Masukkan Jenis Kelamin" onChange={this.inputChange} /> &nbsp;
        <input type="date" value={this.state.dataPost.tanggal_lahir} name="tanggal_lahir" onChange={this.inputChange} /> &nbsp;
        <button type="submit" onClick={this.handleSubmit}>Save Data</button> */}

          {this.state.mainData.map((dat, index) => {
            return (
              <div key={index}>
                {/* <p>Nama : {dat.nama_karyawan}</p>
                <p>Jabatan: {dat.jabatan}</p>
                <p>Jenis Kelamin: {dat.jenis_kelamin}</p>
                <p>Tanggal Lahir : {dat.tanggal_lahir}</p>
                <button onClick={this.handleRemove} value={dat.id} >Delete</button>
              &nbsp;
                <button onClick={this.handleEdit} value={dat.id}>Edit</button>
                <br />
                <br /> */}


                <Container style={{ display: "flex", justifyContent: "center", paddingBottom: "20px" }} >
                  <Card.Group>
                    <Card>
                      <Card.Content style={{ textTransform: "capitalize" }}>
                        <Card.Header textAlign="center">{dat.nama_karyawan}</Card.Header>
                        <Card.Meta textAlign="center">{dat.jabatan}</Card.Meta>
                        <Card.Description>
                          <Table basic="very">
                            <Table.Body>
                              <Table.Row>
                                <Table.Cell>Jenis Kelamin : </Table.Cell>
                                <Table.Cell>{dat.jenis_kelamin}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell>Tanggal Lahir : </Table.Cell>
                                <Table.Cell>{dat.tanggal_lahir}</Table.Cell>
                              </Table.Row>
                            </Table.Body>
                          </Table>
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <div className='ui two buttons'>
                          <Button.Group fluid>
                            <Button color="red" onClick={this.handleRemove} value={dat.id}>
                              <Icon name="trash alternate" />
                            </Button>
                            <Button.Or />
                            <Button positive onClick={this.handleEdit} value={dat.id}>
                              <Icon name="edit outline" />
                            </Button>
                          </Button.Group>
                        </div>
                      </Card.Content>
                    </Card>
                  </Card.Group>
                </Container>
              </div>
            )
          }
          )}
        </Container>
      </div>
    );
  }
}

export default App;