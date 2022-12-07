import ContainerComponent from "containers/components/layout/container";
import { MDBBtn, MDBCol, MDBRow } from "mdbreact";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { IProps } from "./propState";

export default class YouAreInComponent extends React.Component<RouteComponentProps<IProps>> {
  private _submit = () => {
    this.props.history.push("/sign-up/thank-you");
  };

  public render() {
    return (
      <ContainerComponent>
        <MDBRow>
          <MDBCol md="12">
            <form>
              <p className="h5 text-center mb-4">You 're in</p>
              <div className="text-center">
                <MDBBtn type="button" onClick={this._submit}>
                  Submit
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </ContainerComponent>
    );
  }
}
