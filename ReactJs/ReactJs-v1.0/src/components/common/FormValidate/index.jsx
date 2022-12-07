import React from 'react';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import * as Validators from '../../../utils/validation';

function ValidateForm(data) {
  return function FormData(Form) {
    return class RenderForm extends React.Component {
      constructor() {
        super();
        this.state = {
          form: {
            value: {},
            error: {}
          }
        };
      }
      
      onChange = (event, callback: Function) => (key) => {
        const { form } = this.state;
        form.value = { ...form.value, [key]: event.target.value };
        form.error = !isEmpty(this.handleValidate(event.target.value)(key)) ? { ...form.error, [key]: this.handleValidate(event.target.value)(key) } : omit(form.error, [key]);
        this.setState({ form });
        return callback(event.target.value);
      };
      
      /*
        This function handle action to validate form when change elements
      */
      handleValidate = value => (key) => {
        const label = find(data, item => item.name === key);
        let error = {};
        if (label.validate.length) {
          const validateResult = this.validateField(label, value);
          error = !isEmpty(validateResult) ? validateResult : {};
        }
        return error;
      };
      
      /*
        This function validate field data.
      */
      validateField = (label, value) => {
        let result = {};
        label.validate.forEach((t) => {
          if (Validators[t](value)) { 
            result = Validators[t](value);
          }
        });
        return result;
      };
      

      /*
        This function get all info validate from all fields.
      */
      validateForm = (dataFields, callback: Function) => {
        const { form } = this.state;
        form.value = dataFields ? this.updateValueFields(data, dataFields) : {};
        form.error = {};
        Object.keys(data).forEach((key) => {
          if (data[key].validate && data[key].validate.length) {
            const errorData = this.validateField(data[key], form.value[data[key].name]);
            form.error = isEmpty(errorData) ? {} : Object.assign(form.error, { [data[key].name]: errorData });
          }
        });
        this.setState(form);
        return callback(form);
      };
      
      updateValueFields = (fields, dataFields: Object) => {
        const formData = {};
        if (fields) {
          fields.forEach((field) => {
            if (dataFields.hasOwnProperty(field.name)) {
              Object.assign(formData, { [field.name]: dataFields[field.name] });
            }
          });
        }
        return formData;
      };
      
      render() {
        return (
          <Form
            onChange={this.onChange}
            form={this.state.form}
            handleValidate={this.handleValidate}
            validateForm={this.validateForm}
            updateValueFields={this.updateValueFields}
            {...this.props}
          />
        );
      }
    };
  };
}
export default ValidateForm;
