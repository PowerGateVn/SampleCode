import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { compose, getContext } from 'recompose';

import defined from '~app/utils/defined';
import { getFormState } from '~app/core/forms';
import Spacer from '~app/components/shared/Spacer';
import ClickableText from '~app/components/shared/ClickableText';
import styles from '~app/assets/styles/common';
import { goldColor, darkGrayColor, dividerColor, errorTextColor,
  fontSizes } from '~app/assets/styles/variables';
import { FontAwesomeIcon } from '~app/components/shared/TextIcon';

class FormErrors extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    modalDismissed: false,
    formError: this.props.form.formError,
  };

  componentWillReceiveProps(nextProps) {
    // only when a submission ends will we allow the form-level error modal
    // to be displayed again
    if (this.props.form.submitting && !nextProps.form.submitting) {
      this.setState({
        modalDismissed: false,
        formError: nextProps.form.formError,
      });
    }
  }

  renderFieldError(form, fieldName) {
    const error = form.errors[fieldName];
    const field = form.fields[fieldName] || {};
    if (!defined(error) || error === '' || !field.touched) {
      return null;
    }
    return (
      <Text key={fieldName} style={[styles.openSansFont, styles.errorText]}>
        {error}
      </Text>
    );
  }

  renderFormError(error, buttonText = 'BACK') {
    return (
      <View style={styles.modalContainer}>
        <View style={[styles.modalContentBlock, formErrorStyles.modalContentBlock]}>
          <FontAwesomeIcon name='warning' size={errorIconSize} color={errorTextColor} />
          <Spacer height={20} />
          <Text style={[styles.sansSemibold, styles.errorModalText]}>
            {error}
          </Text>
          <Spacer height={30} />
          <Spacer height={1} color={dividerColor} />
          <Spacer height={6} />
          <ClickableText
            text={buttonText}
            textStyle={[styles.sansExtrabold, styles.errorModalClickableText]}
            onPress={() => this.setState({modalDismissed: true})}
          />
        </View>
      </View>
    );
  }

  render() {
    const {form, fields} = this.props;
    const {formError, modalDismissed} = this.state;
    const showFormError = defined(formError) && formError !== '';
    return (
      <View>
        {fields.map((field, key) => this.renderFieldError(form, field))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showFormError && !modalDismissed}
          onRequestClose={() => {}}
        >
          {showFormError && this.renderFormError(formError)}
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const name = ownProps.name || ownProps.form.name;
  const formState = getFormState(name)(state);
  const fields = ownProps.fields || formState.fieldOrder;
  return {
    name,
    fields,
    form: formState,
  };
};

export default compose(
  getContext({
    form: PropTypes.object,
  }),
  connect(mapStateToProps),
)(FormErrors);

const errorIconSize = 32;
const formErrorStyles = StyleSheet.create({
  modalContentBlock: {
    paddingTop: 20,
  },
});

