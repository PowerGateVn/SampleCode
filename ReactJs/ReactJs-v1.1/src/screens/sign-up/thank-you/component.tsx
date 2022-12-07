import ContainerComponent from "containers/components/layout/container";
import { MDBBtn, MDBCol, MDBRow } from "mdbreact";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { IProps } from "./propState";

export default class ThankYouComponent extends React.Component<RouteComponentProps<IProps>> {
  private _submit = () => {
    this.props.history.push("/login");
  };

  public render() {
    return (
      <ContainerComponent>
        <MDBRow>
          <MDBCol md="12">
            <form>
              <p className="h5 text-center mb-4">Thank You</p>
              <div className="text-center">
                <MDBBtn type="button" onClick={this._submit}>
                  Ok
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </ContainerComponent>
    );
  }
}
