import React from 'react';
import Modal from 'react-modal';

export default class ViewRequests extends React.Component {

    constructor() {
        super();
        this.state = {
            modalOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({
            modalOpen: true
        });
    }

    closeModal() {
        this.setState({
            modalOpen: false
        });
    }

    render() {
        return (
            <div> 
                <div> 
                    <h1> View Your Open Requests </h1>
                    <button type="button" onClick={this.openModal}> Open Modal </button>
                    <Modal isOpen={this.state.modalOpen} onRequestClose={this.closeModal} contentLabel="Example Modal">
                        <h2> I am a Modal </h2>
                        <button type="button" onClick={this.closeModal}> Close Modal </button>
                        <div> 
                            <h3> I am inside of the modal </h3>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }

}

