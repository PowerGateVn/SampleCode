import { IUserModel } from "models";

interface IProps {}

interface IState {
  email: string;
  password: string;
}

interface IActionProps {
  signUpAction: (user: IUserModel) => void;
}

export { IProps, IState, IActionProps };
