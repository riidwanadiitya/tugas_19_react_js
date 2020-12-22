import React, { Component } from 'react';
import axios from 'axios';

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
    }
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
    console.log(e.target.value)
    axios.get(`http://localhost:4000/data-karyawan/${e.target.value}`)
      .then(res => {
        this.setState({
          dataPost: res.data,
          edit: true
        })
      })
  };

  componentDidMount() {
    this.reloadData();
  };

  render() {
    return (
      <div>
        <h1>Data Karyawan</h1>

        <input type="text" value={this.state.dataPost.nama_karyawan} name="nama_karyawan" placeholder="Masukkan Nama Karyawan" onChange={this.inputChange} /> &nbsp;
        <input type="text" value={this.state.dataPost.jabatan} name="jabatan" placeholder="Masukkan Jabatan" onChange={this.inputChange} /> &nbsp;
        <input type="text" value={this.state.dataPost.jenis_kelamin} name="jenis_kelamin" placeholder="Masukkan Jenis Kelamin" onChange={this.inputChange} /> &nbsp;
        <input type="date" value={this.state.dataPost.tanggal_lahir} name="tanggal_lahir" onChange={this.inputChange} /> &nbsp;
        <button type="submit" onClick={this.handleSubmit}>Save Data</button>

        {this.state.mainData.map((dat, index) => {
          return (
            <div key={index}>
              <p>Nama : {dat.nama_karyawan}</p>
              <p>Jabatan: {dat.jabatan}</p>
              <p>Jenis Kelamin: {dat.jenis_kelamin}</p>
              <p>Tanggal Lahir : {dat.tanggal_lahir}</p>
              <button onClick={this.handleRemove} value={dat.id} >Delete</button>
              &nbsp;
              <button onClick={this.handleEdit} value={dat.id}>Edit</button>
              <br />
            </div>
          )
        }
        )}

      </div>
    );
  }
}

export default App;