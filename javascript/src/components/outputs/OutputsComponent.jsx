'use strict';

var React = require('react');
var OutputList = require('./OutputList');
var CreateOutputDropdown = require('./CreateOutputDropdown');
var AssignOutputDropdown = require('./AssignOutputDropdown');
var OutputsStore = require('../../stores/outputs/OutputsStore');
var StreamsStore = require('../../stores/streams/StreamsStore');
var UserNotification = require("../../util/UserNotification");
var PermissionsMixin = require('../../util/PermissionsMixin');
var Spinner = require('../common/Spinner');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var OutputsComponent = React.createClass({
    mixins: [PermissionsMixin],
    componentDidMount() {
        this.loadData();
    },
    loadData() {
        var callback = (outputs) => {
            this.setState({
                outputs: outputs
            });
            if (this.props.streamId) {
                this._fetchAssignableOutputs(outputs);
            }
        };
        if (this.props.streamId) {
            OutputsStore.loadForStreamId(this.props.streamId, callback);
        } else {
            OutputsStore.load(callback);
        }

        OutputsStore.loadAvailableTypes((types) => {
            this.setState({types:types});
        });
    },
    getInitialState() {
      return {
      };
    },
    _handleUpdate() {
        this.loadData();
    },
    _handleCreateOutput(data) {
        OutputsStore.save(data, (result) => {
            this.setState({typeName: "placeholder"});
            if (this.props.streamId) {
                StreamsStore.addOutput(this.props.streamId, result.id, () => {
                    this._handleUpdate();
                });
            } else {
                this._handleUpdate();
            }
        });
    },
    _fetchAssignableOutputs(outputs) {
        OutputsStore.load((allOutputs) => {
            var streamOutputIds = outputs.map((output) => {return output.id;});
            var assignableOutputs = allOutputs
                .filter((output) => { return streamOutputIds.indexOf(output.id) === -1; })
                .sort((output1, output2) => { return output1.title.localeCompare(output2.title);});
            this.setState({assignableOutputs: assignableOutputs});
        });
    },
    _handleAssignOutput(outputId) {
        StreamsStore.addOutput(this.props.streamId, outputId, () => {
            this._handleUpdate();
        });
    },
    _removeOutputGlobally(outputId) {
        if (window.confirm("Do you really want to terminate this output?")) {
            OutputsStore.remove(outputId, (jqXHR, textStatus, errorThrown) => {
                UserNotification.success("Output was terminated.", "Success");
                this._handleUpdate();
            });
        }
    },
    _removeOutputFromStream(outputId, streamId) {
        if (window.confirm("Do you really want to remove this output from the stream?")) {
            StreamsStore.removeOutput(streamId, outputId, (jqXHR, textStatus, errorThrown) => {
                UserNotification.success("Output was removed from stream.", "Success");
                this._handleUpdate();
            });
        }
    },
    _handleOutputUpdate(output, deltas) {
        OutputsStore.update(output, deltas, () => {
            this._handleUpdate();
        });
    },
    render() {
        if (this.state.outputs && this.state.types && (!this.props.streamId || this.state.assignableOutputs)) {
            var permissions = this.props.permissions;
            var streamId = this.props.streamId;
            var createOutputDropdown = (this.isPermitted(permissions, ["outputs:create"]) ?
                <CreateOutputDropdown types={this.state.types} onSubmit={this._handleCreateOutput}
                                      getTypeDefinition={OutputsStore.loadAvailable} streamId={streamId}/> : null);
            var assignOutputDropdown = (streamId ?
                <AssignOutputDropdown ref="assignOutputDropdown" streamId={streamId}
                                      outputs={this.state.assignableOutputs}
                                      onSubmit={this._handleAssignOutput}/> : null);
            return (<div className="outputs">
                <Row className="content">
                    <Col md={4}>
                        {createOutputDropdown}
                    </Col>
                    <Col md={8}>
                        {assignOutputDropdown}
                    </Col>
                </Row>

                <OutputList ref="outputList" streamId={streamId} outputs={this.state.outputs} permissions={permissions}
                            getTypeDefinition={OutputsStore.loadAvailable} types={this.state.types}
                            onRemove={this._removeOutputFromStream} onTerminate={this._removeOutputGlobally}
                            onUpdate={this._handleOutputUpdate}/>
            </div>);
        } else {
            return <Spinner />;
        }
    }
});
module.exports = OutputsComponent;

