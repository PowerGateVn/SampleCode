import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DetailComponent from "./detail.component";
import DetailAction from "../../actions/detail/detail.action";

const mapStateToProps = (state) => {
    return {
        times: state.detailReducer.step
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        detailActions: bindActionCreators(DetailAction, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailComponent);