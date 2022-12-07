import React from 'react';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import MyForm from '../../../common/FormValidate';
import { createUser, updateUser, editUser } from '../../../../actions/user';
import './styles.less';

const fieldsValidate = [
  {
    name: 'name',
    validate: ['required']
  },
  {
    name: 'username',
    validate: ['required']
  },
  {
    name: 'email',
    validate: ['emailAddress']
  }
];

const messageError = error => error && <span>({error.message})</span>;

class CreateOrEditUser extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    const { userSelected } = this.props;
    const isEdit = !!this.props.match.params.id;
    this.props.validateForm(userSelected, (validate) => {
      if (isEmpty(validate.error)) {
        this.props.dispatch(isEdit ? editUser(validate.value, this.props.match.params.id) : createUser(validate.value))
          .then(() => {
            this.props.history.push('/');
          }); 
      }
    });
  }

  handleUpdate = key => (event) => {
    const { userSelected } = this.props;
    this.props.onChange(event, (value) => {
      userSelected[key] = value;
      this.props.dispatch(updateUser(userSelected));
    })(key);
  }
  
  fieldGroup = ({ id, label, error, ...props }) =>
    (
      <FormGroup controlId={id} validationState={error ? 'error' : null}>
        <ControlLabel>{label} {messageError(error)} </ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    )
  
  render() {
    const { form, userSelected } = this.props;
    return (
      <form onSubmit={this.handleSubmit} >
        <this.fieldGroup
          id="formControlsText"
          type="text"
          label="Name"
          placeholder="Enter name"
          value={userSelected.name}
          onChange={this.handleUpdate('name')}
          error={form.error.name}
          name="name"
        />
        <this.fieldGroup
          id="formControlsEmail"
          type="text"
          label="Username"
          placeholder="Enter username"
          value={userSelected.username}
          onChange={this.handleUpdate('username')}
          name="username"
          error={form.error.username}
        />
        <this.fieldGroup
          id="formControlsPassword"
          label="Email Address"
          placeholder="Enter email"
          type="email"
          value={userSelected.email}
          onChange={this.handleUpdate('email')}
          error={form.error.email}
          name="email"
        />
        <FormGroup>
          <Button bsStyle="primary" type="submit">Save</Button>
        </FormGroup>
        <FormGroup>
          <Link to="/"><Button bsStyle="info">Cancel</Button></Link>
        </FormGroup>
      </form>
    );
  }
}

export default MyForm(fieldsValidate)(CreateOrEditUser);
