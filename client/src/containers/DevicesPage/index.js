import React from "react";
import parse from 'html-react-parser';
import { FormattedMessage } from "react-intl";
import TableWrapper from "../../components/TableWrapper";
import CheckboxGroup from "../../components/CheckboxGroup";
import StatusTag from "../../components/StatusTag";
import { webSocketClient } from "../../Utils";
import { ACTION_TYPES, DEVICE_STATUS_TYPES } from "../../components/constants";
import { DevicesServices } from "../../components/Devices/DevicesServices";

import "./style.scss";
import { Badge } from "antd";

class DevicesPage extends React.PureComponent {

  constructor(props) {
    super(props);

    this.deviceStatus = DevicesServices.STATUS_TYPES_OPTIONS;
    this.state = {
      dataSource: [],
      selectedStatusTypes: props.match && props.match.params && props.match.params.type ? [props.match.params.type] : this.deviceStatus.map(type => type.value)
    };
  }

  componentDidMount() {
    webSocketClient.receivedMessage((response) => {
      if (response.type === ACTION_TYPES.DEVICE_LIST) {
        const dataSource = response.data && response.data.list.map(DevicesServices.transformDeviceList);
        this.setState({
          dataSource
        });
      }
    });

    webSocketClient.sendMessage({ type: ACTION_TYPES.DEVICE_LIST });
  }

  columnsDef = [
    {
      title: <FormattedMessage id="DEVICE_ID" />,
      dataIndex: 'dev_id',
      width: '15%',
    }, {
      title: <FormattedMessage id="SERIAL_NUMBER" />,
      dataIndex: 'dev_sn',
      width: '20%',
    }, {
      title: <FormattedMessage id="DEVICE_NAME" />,
      dataIndex: 'dev_name',
      width: '35%',
    }, {
      title: <FormattedMessage id="DEVICE_STATUS" />,
      dataIndex: 'convertedStatus',
      render: (convertedStatus, device) => <Badge color={device.statusColor} text={convertedStatus} />
    }
  ];

  onChangeTypes = (checkedValues) => {
    this.setState({
      selectedStatusTypes: checkedValues
    });
  }

  getFilteredDataSource = devices => devices.filter(device => this.state.selectedStatusTypes.indexOf(device.type) > -1)

  render() {
    const { dataSource = [], selectedStatusTypes } = this.state;
    return (
      <React.Fragment>
        <div className="page-header"><FormattedMessage id="DEVICES" /></div>
        <div className="page-contents">
          {/* eslint-disable-next-line no-undef */}
          <CheckboxGroup label={`${i18n.DEVICE_STATUS}:`} options={this.deviceStatus} defaultValue={selectedStatusTypes} onChange={this.onChangeTypes} />
          <TableWrapper columns={this.columnsDef} dataSource={this.getFilteredDataSource(dataSource)} />
        </div>
      </React.Fragment>
    );
  }
}

export default DevicesPage;