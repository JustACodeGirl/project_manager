import React, { PropTypes } from 'react';
import { Form, Modal, Checkbox, Input } from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const modal = ({
  visible,
  type,
  roles,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      let data = {
        ...getFieldsValue(),
      };
      data.roleIds = data.roleIds.toString();
      data.roleNames = '';
      onOk(data);
    });
  }

  const modalOpts = {
    title: `${type === 'create' ? '添加方案' : '编辑方案'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    width: 800,
  };
  const plainOptions = roles.map(role => ({ label: role.roleName, value: role.id }));
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('userCode', {
            initialValue: item.userCode,
          })(<Input />)}
        </FormItem>
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('userName', {
            initialValue: item.userName,
          })(<Input />)}
        </FormItem>
        <FormItem label="角色" {...formItemLayout}>
          {getFieldDecorator('roleIds', {
            initialValue: item.roleIds ? item.roleIds.split(',').map(id => Number(id)) : [],
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
  roles: PropTypes.array,
};

export default Form.create()(modal);
