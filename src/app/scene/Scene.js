import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown, Checkbox} from "semantic-ui-react";
import AddScene from "./AddScene";

export default class Device extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            types: [],
            action: '',
            curDevice: {}
        }
    }
}