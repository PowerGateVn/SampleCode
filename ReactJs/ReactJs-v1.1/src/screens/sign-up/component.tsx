import ContainerComponent from "containers/components/layout/container";
import { MDBBtn, MDBCol, MDBInput, MDBRow } from "mdbreact";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { signUpAction } from "./ducks/actions";
import { IActionProps, IProps, IState } from "./propState";

class SignupComponent extends React.Component<IProps & IActionProps, IState> {
  constructor(props: IProps & IActionProps) {
    super(props);
  }

  private _submitSignup = () => {
    this.props.signUpAction({
      email: "ninh.phammanh@powergate.com",
      name: "Ninh",
      surName: "Pham",
      mobilePhone: "0973918273123",
      password: "jsbdjasd",
      employeeOrContractor: "employee"
    });
  };

  public render() {
    return (
      <ContainerComponent>
        <MDBRow>
          <MDBCol md="12">
            <form>
              <p className="h5 text-center mb-4">Sign in</p>
              <div className="grey-text">
                <MDBInput label="Name" type="text" />
                <MDBInput label="Surname" type="text" />
                <MDBInput label="Mobile Phone" type="text" />
                <MDBInput label="Password" type="password" />
                <MDBInput label="Repeat Password" type="password" />
                <div>
                  <p>Are you an employee or a contractor?</p>
                  <select className="browser-default custom-select">
                    <option>Choose your option</option>
                    <option value="1">Employee</option>
                    <option value="2">Contractor</option>
                  </select>
                </div>
                <div className="md-form pb-3">
                  <div className="form-check my-4">
                    <MDBInput
                      label="By signing up I agree to Terms of Use, Privacy, Security, and Disclosure Policies."
                      type="checkbox"
                      id="checkbox1"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <MDBBtn type="button" onClick={this._submitSignup}>
                  Sign up
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </ContainerComponent>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ signUpAction }, dispatch);

export default connect(null, mapDispatchToProps)(SignupComponent);
