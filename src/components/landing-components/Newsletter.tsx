import React from "react";
import swal from 'sweetalert';

export default class Newsletter extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {value: ''};
          
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
          
  handleChange(e) {
    this.setState({value: e.target.value});
  }
          
  handleSubmit(e) {
    swal('E-mail ' + this.state.value + ' cadastrado!');
    e.preventDefault();
  }
  
  render() {
    return (
      <div className="d-flex justify-content-center m-5 rounded shadow-sm p-3 bg-light rounded">
        <div id="content" className="text-center">
          <h4>Sign up to stay updated on news and promotions</h4>
          <form onSubmit={this.handleSubmit} id="form" className="d-flex justify-content-center align-items-center p-4">
            <input className="input border border-secondary rounded p-2 mx-2" type="email" value={this.state.value}
                   onChange={this.handleChange} required/>
            <input className="btn btn-warning mx-2" type="submit" value="Send"/>
          </form>
        </div>
      </div>
    );
  }
}
