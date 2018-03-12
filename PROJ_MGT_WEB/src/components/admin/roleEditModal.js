import React, { PropTypes } from 'react';
import { Form, Modal, Checkbox } from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  wrapperCol: {
    span: 14, offset: 6,
  },
};

const modal = ({
  visible,
  item = {},
  rights,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldValue,
  },
}) => {
  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const rights = getFieldValue('rights');
      onOk(rights);
    });
  }

  const modalOpts = {
    title: '配置角色权限',
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    width: 800,
  };
  const plainOptions = rights.map(right => ({ label: right.rightName, value: right.id }));
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('rights', {
            initialValue: item.rights && item.rights.map(right => right.id),
          })(<CheckboxGroup options={plainOptions} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
};

export default Form.create()(modal);
