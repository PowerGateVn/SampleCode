import LoadingComponent from "containers/components/loading";
import { MDBContainer } from "mdbreact";
import React, { Fragment, useEffect, useState } from "react";
import FooterComponent from "../footer";
import HeaderComponent from "../header";
import { IProps } from "./propState";

export default function ContainerComponent(props: IProps) {
  const [isDisconnected, setIsDisconnected] = useState(false);

  useEffect(() => {
    handleConnectionChange();
    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);
    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  /** check internet connection */
  const handleConnectionChange = () => {
    const condition = navigator.onLine ? "online" : "offline";
    if (condition === "online") {
      const webPing = setInterval(() => {
        fetch("//google.com", { mode: "no-cors" })
          .then(() => {
            setIsDisconnected(false);
            return clearInterval(webPing);
          })
          .catch(() => this.setState({ isDisconnected: true }));
      }, 2000);
      return;
    }
    setIsDisconnected(true);
  };

  return (
    <Fragment>
      {isDisconnected && <p>Internet connection lost</p>}
      <LoadingComponent />
      <HeaderComponent />
      <MDBContainer>{props.children}</MDBContainer>
      <FooterComponent />
    </Fragment>
  );
}
