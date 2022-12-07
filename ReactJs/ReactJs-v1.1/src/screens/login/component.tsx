import ContainerComponent from "containers/components/layout/container";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBModalFooter,
  MDBRow
} from "mdbreact";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { IState } from "screens/sign-up/propState";

export default function LoginComponent() {
  let history = useHistory();
  const [state, setState] = useState<IState>({ email: "", password: "" });

  const handleChange = (field: string) => (event: any) => {
    event.persist();
    setState(state => ({ ...state, [field]: event.target.value }));
  };

  const login = () => {
    //console.log(this.prop)
    history.push("/login/access-code");
  };

  return (
    <ContainerComponent>
      <MDBRow>
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
              <MDBCardHeader className="form-header deep-blue-gradient rounded">
                <h3 className="my-3">
                  <MDBIcon icon="lock" /> Login:
                </h3>
              </MDBCardHeader>
              <form>
                <div className="grey-text">
                  <MDBInput value={state.email} onChange={handleChange("email")} label="email" type="email" />
                  <MDBInput
                    value={state.password}
                    onChange={handleChange("password")}
                    label="Password"
                    type="password"
                  />
                  <div className="md-form pb-3">
                    <div className="form-check my-4">
                      <MDBInput label="Remember me" type="checkbox" id="checkbox1" />
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <MDBBtn color="light-blue" className="mb-3" type="button" onClick={login}>
                    Submit
                  </MDBBtn>
                </div>
              </form>
              <MDBModalFooter>
                <div className="font-weight-light">
                  <Link to="/sign-up">Not a member? Sign Up</Link>
                  <p>Forgot Password?</p>
                </div>
              </MDBModalFooter>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </ContainerComponent>
  );
}
