import ContainerComponent from "containers/components/layout/container";
import { MDBBtn, MDBCol, MDBRow } from "mdbreact";
import React from "react";

export default class AccessCodeComponent extends React.Component {
  public render() {
    return (
      <ContainerComponent>
        <MDBRow>
          <MDBCol md="12">
            <form>
              <p className="h5 text-center mb-4">Sign Up Access Code</p>
              <p>enter the access code sent via SMS to +60 XXXXXXXXXX32</p>
              <div className="text-center">
                <MDBBtn>Submit</MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </ContainerComponent>
    );
  }
}
