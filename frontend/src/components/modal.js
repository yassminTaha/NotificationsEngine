import React, { Component } from "react";
import DatePicker from "react-datepicker";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }
  handleStartDate = date => {
    const activeItem = { ...this.state.activeItem, startDate: date };
    this.setState({ activeItem });
    
  }
  handleEndDate = date => {
    const activeItem = { ...this.state.activeItem, endDate: date };
    this.setState({ activeItem });
  }
  handleChange = e => {
    let { name, value } = e.target;
    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  };
  render() {
    const { toggle, onSave } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> Campaign </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                value={this.state.activeItem.name}
                onChange={this.handleChange}
                placeholder="Enter Campaign Name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="pnTemplate">Push notification text</Label>
              <Input
                type="text"
                name="pnTemplate"
                value={this.state.activeItem.pnTemplate}
                onChange={this.handleChange}
                placeholder="Enter push notification text"
              />
            </FormGroup>
            <FormGroup>
              <Label for="smsTemplate">SMS text</Label>
              <Input
                type="text"
                name="smsTemplate"
                value={this.state.activeItem.smsTemplate}
                onChange={this.handleChange}
                placeholder="Enter push notification text"
              />
            </FormGroup>
            <FormGroup>
              <Label for="numberOfPoints"> Number of points</Label>
              <Input
                  type="number"
                  name="numberOfPoints"
                  value={this.state.activeItem.numberOfPoints}
                  onChange={this.handleChange}
                  placeholder="Number of points"
                />
            </FormGroup>
            <FormGroup>
              <Label for="costPerUser">Cost per user in $</Label>
              <Input
                  type="number"
                  name="costPerUser"
                  value={this.state.activeItem.costPerUser}
                  onChange={this.handleChange}
                  placeholder="Cost per user in $"
                />
            </FormGroup>
            <FormGroup>
              <Label for="costPerUser">Start Date</Label>
              <DatePicker
                selected={this.state.activeItem.startDate}
                selectsStart
                startDate={this.state.activeItem.startDate}
                endDate={this.state.endDate}
                onChange={this.handleStartDate}
            />
            
            </FormGroup>
            <FormGroup>
              <Label className="label" for="costPerUser">End Date</Label>
              <DatePicker
                selected={this.state.activeItem.endDate}
                selectsEnd
                startDate={this.state.activeItem.startDate}
                endDate={this.state.activeItem.endDate}
                onChange={this.handleEndDate}
            />
            
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.activeItem)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}