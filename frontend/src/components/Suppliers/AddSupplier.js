import React from 'react'
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Select,
    Button,
    AutoComplete,
    Spin,
    Progress,
  } from 'antd';

  import * as titleActions  from '../../Actions/TitleActions'
  import * as supplierActions  from '../../Actions/SupplierActions'
import supplierStore from '../../store/SupplierStore';
  
  const { Option } = Select;
  const AutoCompleteOption = AutoComplete.Option;
  
  class AddSupplierForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
      addSupplierStore : supplierStore.initialState
    };
    componentWillMount () {
        Spin.setDefaultIndicator(<Progress strokeColor = {'green'} type = "circle" percent = {this.state.addSupplierStore.loadingPercentage} />)
        supplierStore.on('update',()=>{
            this.setState({addSupplierStore:supplierStore.initialState})
        })
    }
    componentDidMount () {
        titleActions.changeTitle("Add Supplier")
    }
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {

          console.log('Received values of form: ', values);
          supplierActions.addSupplier(localStorage.getItem('token'),values)
        }
      });
    };
  
    handleConfirmBlur = e => {
      const { value } = e.target;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
  
    handleWebsiteChange = value => {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
      }
      this.setState({ autoCompleteResult });
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
      const { autoCompleteResult } = this.state;
  
      
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '+94',
      })(
        <Select style={{ width: 70 }}>
          <Option value="+94">+94</Option>
        </Select>,
      );
  
      const websiteOptions = autoCompleteResult.map(website => (
        <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
      ));
      return (
          <Spin spinning = {this.state.addSupplierStore.loading}>
        <Form  onSubmit={this.handleSubmit}>
        <Form.Item
            label={
              <span>
                Name&nbsp;
                <Tooltip title="What do you want others to call you?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: 'Please input supplier name!', whitespace: true }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input supplier E-mail!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          
          <Form.Item label="Phone Number">
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: 'Please input your phone number!' }],
            })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item label="Website">
            {getFieldDecorator('website', {
              rules: [{ required: false, message: 'Please input website!' }],
            })(
              <AutoComplete
                dataSource={websiteOptions}
                onChange={this.handleWebsiteChange}
                placeholder="website"
              >
                <Input />
              </AutoComplete>,
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Create Supplier
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      );
    }
  }
  
  const AddSupplier = Form.create({ name: 'register' })(AddSupplierForm);
  
  export default  AddSupplier