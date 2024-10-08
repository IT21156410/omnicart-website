import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function ModalContact(props) {
  return (
      <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered className='p-5'
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Send us your details and we will get in touch!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal text-center d-block p-5">
          <form action="" method="get" onSubmit="return ConfMensage();">
            <div className="input-group mb-3">
              <label className="input-group-prepend mx-2" id="nome inputGroup-sizing-default">Name</label>
              <input type="text" className="form-control" aria-describedby="inputGroup-sizing-default" required />
            </div>
            <div className="input-group mb-3">
              <label className="input-group-prepend mx-2" id="inputGroup-sizing-default">Email</label>
              <input type="email" className="form-control" aria-describedby="inputGroup-sizing-default" required />
            </div>
            <div className="input-group mb-3">
              <label className="input-group-prepend mx-2" id="inputGroup-sizing-default">Phone</label>
              <input type="text" className="form-control" aria-describedby="inputGroup-sizing-default" />
            </div>
            <div className="input-group mb-3">
              <label className="input-group-prepend mx-2" id="inputGroup-sizing-default">Message</label>
              <textarea className="form-control" aria-describedby="inputGroup-sizing-default" />
            </div>
            <input className="btn btn-dark mx-2" type="submit" value="Send" />
          </form>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          <p>Thank you for contacting us. We will respond as soon as possible!</p>
        </Modal.Footer>
      </Modal>
  );
}
