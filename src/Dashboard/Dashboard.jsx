import React, { useEffect, useState, useRef} from "react";
import "./Dashboard.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import Alert from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // needs additional webpack config!
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import ReactLoading from "react-loading";
import DatePicker from 'react-datepicker';  
   
import "react-datepicker/dist/react-datepicker.css";
import { Section, Title, Article, Prop, list } from "../generic";
import {
    Container,
    Row,
    Col,
    Card,
    Nav,
    Button,
    NavItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Dropdown,
    Spinner
} from 'reactstrap';
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import bootstrap5Plugin from '@fullcalendar/bootstrap5';

const getURL = "http://localhost:50924/api/Leave/getLeaveEventList";
const getUserURL = "http://localhost:50924/api/Leave/getLeaveList"
const authToken = "jVGgspBwBv_p7QaLgBlqWiUVM1ShikxhVZP1wgrlps9WbEZRVXSlF5FtBZDsmxHQXl2-fUo3MDGnWHwe076XhVBktghZn880t4Uj559RxujYAzIMAU7pgPkEcTRUoyfwyG2CksnYPoVytctqR2zUF_I73j9msJ1M4VK6Ch_vAWGmPHiu-cFTKsfJOaE8_O42q5FNz5NAE1cfgSADckJMCzPVR5q71r4K7WaQkPBHHeFU2rSt00eqx8uXbXGtm7jATt-7A2IBkMQjKN3dpv7imgAx1BBpw2-5oAtCnpE8tvGyRPaoiGPTddlyryKFsRvyZ79MNJMsrHAnkPDl8jOz3EgT_WisBpBqO8_JhMiv4nOHHPMmUA-2ldAbbJdONRsm"
export default class Dashboard extends React.Component {
   
    constructor(props) {
        super(props);
   
        this.state = {
            events: [],
            externalEvents: [{}],
            DataisLoaded: false,
            title: '',
            startDate: new Date(),
            endDate: new Date(),
            modal: false
        };
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);  
        this.handleChangeEnd = this.handleChangeEnd.bind(this);  
        this.onFormSubmit = this.onFormSubmit.bind(this);  
    }
    toggle() {
      this.setState({
        modal: !this.state.modal
      });
    }
    handleChangeEnd(enddate){
      this.setState({
        endDate: enddate
      })
    }
    handleChange(date) {  
      this.setState({  
        startDate: date
      })  
    }  
    onChangeName = e => {
      this.setState({title: e.target.value});
    }
    onFormSubmit(event) {  
      event.preventDefault();  
      console.log(this.state.title)
      console.log(this.state.startDate);
      console.log(this.state.endDate);  
      axios.post('http://localhost:50924/api/Leave/postAddLeaveCal', {
        AccessID: this.state.title,
        StartDate: this.state.startDate,
        EndDate: this.state.endDate
              }, { headers: {"Authorization" : `Bearer ${authToken}`} })
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          return error;
        });
        Alert.fire("Success!", "Your Event has been added.", "success");
    }  
    componentDidMount() {
        fetch(getURL,{
            method: 'GET',
                headers: {
                "Content-Type": "application/json; charset=utf-8",
               "Authorization": "Bearer " + authToken
                }
              })
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    events: json,
                    DataisLoaded: true
                });
            });
        fetch(getUserURL,{
                method: 'GET',
                    headers: {
                    "Content-Type": "application/json; charset=utf-8",
                   "Authorization": "Bearer " + authToken
                    }
                  })
                .then((res) => res.json())
                .then((json) => {
                    this.setState({
                        externalEvents: json,
                        DataisLoaded: true
                    });

                     });   

    }
    

/**
   * when we click on event we are displaying event details
   */
  eventClick = eventClick => {
    Alert.fire({
      title: eventClick.event.title,
      html:
        `<div class="table-responsive">
      <table class="table">
      <tbody>
      <tr >
      <td>Title</td>
      <td><strong>` +
        eventClick.event.title +
        `</strong></td>
      </tr>
      <tr >
      <td>Start Time</td>
      <td><strong>
      ` +
        eventClick.event.start +
        `
      </strong></td>
      <td><strong>
      ` +
        eventClick.event.end +
        `
      </strong></td>
      </tr>
      </tbody>
      </table>
      </div>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove Event",
      cancelButtonText: "Close"
    }).then(result => {
      if (result.value) {
        eventClick.event.remove(); // It will remove event from the calendar
        axios.post('http://localhost:50924/api/Leave/postDeleteLeaveCal', {
          id: eventClick.event.id,
        }, { headers: {"Authorization" : `Bearer ${authToken}`} })
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          return error;
        });
        Alert.fire("Deleted!", "Your Event has been deleted.", "success");
      }
    });
  };
  drop = drop=>{
    Alert.fire("Edited!", "Your Event has been edited.", "success");
    axios.post('http://localhost:50924/api/Leave/postEditLeaveCal', {
          id: drop.event.id,
          StartDate: drop.event.start,
          EndDate: drop.event.end
        }, { headers: {"Authorization" : `Bearer ${authToken}`} })
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          return error;
        });
  }
  eventResize = eventResize=>{
    Alert.fire("Edited!", "Your Event has been edited.", "success");
    axios.post('http://localhost:50924/api/Leave/postEditLeaveCal', {
          id: eventResize.event.id,
          StartDate: eventResize.event.start,
          EndDate: eventResize.event.end
        }, { headers: {"Authorization" : `Bearer ${authToken}`} })
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          return error;
        });
  }
  handleTimeSelection= (info) => {
    this.setState({
      start: info.startStr,
      end: info.endStr,
      filledIn: true
    })
  }

render(){
    const { DataisLoaded, events,externalEvents, title } = this.state;
    if (!DataisLoaded) return <Spinner color="secondary" type="grow" style={{position: "fixed", top: "50%", left: "50%"}}>Loading...</Spinner>
        // <div>
        //     <h1> Pleses wait some time.... </h1> 
        // </div> ;
        
        return (
            
            <Container className="animated fadeIn p-4 App" >
                    <Row>                        
                      <Button className="button col-2" color="danger" onClick={this.toggle}>
                          <p>Create New Leave</p>
                        </Button>
                          <Modal isOpen={this.state.modal} toggle={this.toggle}>
                          <form onSubmit={ this.onFormSubmit }>
                              <ModalHeader toggle={this.toggle}>Add New Leave</ModalHeader>
                              <ModalBody>
                                <Row className="col-md-9">
                                    <div className="col-md-5 mb-3">
                                      <label className="form-label" >Name:</label>
                                      <input className="form-control" type="text" id="txtLeaveName" placeholder="eg: John Doe" value={title} onChange={this.onChangeName}></input>
                                    </div>
                                </Row>
                                <Row className="col-md-9">
                                    <div className="col-md-5 mb-3">
                                      <label className="form-label">Start Date: </label>
                                      <DatePicker className="form-control"
                                        showTimeSelect
                                        selected={ this.state.startDate }  
                                        onChange={ this.handleChange }  
                                        name="startDate"  
                                        dateFormat="MM/dd/yyyy"  
                                      />
                                    </div>
                                    <div className="col-md-5 mb-3">
                                      <label className="form-label">End Date:</label>
                                      <DatePicker className="form-control"
                                        showTimeSelect
                                        selected={ this.state.endDate }  
                                        onChange={ this.handleChangeEnd }  
                                        name="endDate"  
                                        dateFormat="MM/dd/yyyy"  
                                      />
                                    </div>
                                  </Row>
                                <ModalFooter>
                                  <Button type="submit" color="primary" className="btn btn-primary">Create</Button>
                                  <Button type="button" color="secondary" className="btn btn-secondary" onClick={this.toggle}>Cancel</Button>
                                </ModalFooter>                               
                              </ModalBody>
                          </form>


                          </Modal>   
                        <Col lg={3} sm={3} md={3}>
                            <div
                            id="external-events"
                            style={{
                                padding: "10px",
                                width: "80%",
                                height: "auto",
                                maxHeight: "-webkit-fill-available"
                            }}
                            >
                            <p align="center">
                                <strong> Events</strong>
                            </p>
                            {(this.state.externalEvents.data||[]).map((data, key)=>(
                                <div
                                className="fc-event"
                                title={data.title}
                                id={data.id}
                                key={key}
                                style={{
                                    marginBottom: "2px",
                                    marginRight: "10px",
                                    padding: "3px",
                                    cursor: "pointer"
                            }}
                                >
                                {data.title}
                                </div>
                            ))}
                            </div>
                        </Col>                        

                        <Col md="12">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin ]}
                                headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay"
                                }}
                                initialView="dayGridMonth"
                                editable={true}
                                selectable={true}
                                select={this.handleTimeSelection}
                                selectMirror={true}
                                weekends={true}
                                events={this.state.events.leaveevents}
                                droppable={true}
                                //eventReceive={handleEventReceive}
                                themeSystem= "bootstrap5"
                                eventDurationEditable={true}
                                eventDrop={this.drop}
                                eventClick={this.eventClick}
                                eventResize={this.eventResize}
                                // drop={this.drop}
                            />
                        </Col>
                    </Row>
            </Container>
        );
    }
    componentDidUpdate() {
        let draggableEl = document.getElementById("external-events");
        new Draggable(draggableEl, {
          itemSelector: ".fc-event",
          eventData: function(eventEl) {
            let title = eventEl.getAttribute("title");
            let id = eventEl.getAttribute("id");
            return {
              title: title,
              id: id
            };
          }
        });
      }
}