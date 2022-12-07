import { LoadingComponent } from "containers/components";
import Loadable from "react-loadable";

export default Loadable({
  loader: () => import("./component"),
  loading: LoadingComponent
});
