import './App.css';
import React, { useState, useEffect } from 'react';
//Importing FullCalendar Module
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
//Importing axios service
import axios from 'axios';
const getURL = `http://localhost:50924/api/Leave/getLeaveEventList`;
const authToken = "fQO9MhkQrCydXcgh4oS8IvE7E1GXDGwO3xhKV6VWGVm0yIw0_89kFpxrgpGz1DI_Jm7zWbuUhd0i0nlT3I13_242PqyTmO8iU99vT9d1SOblC3XBpX7U__MurXc6gRtAUqFheNAqrHBnpknL2PccGNubgTqcODTID515GeSDHObDJHeufzxgZhEqjVypUczEQYWxoiCKwx7EDAu9ToS8ahQhKC0r84NvstAbUQonHMpgrKkfS"
export default function EventData() {
  const [events, setEvents] = useState([])
  const fetchData = async () => {
    const response = await fetch(getURL,{
      method: 'GET',
    headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Bearer " + authToken
      }
    })
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }
  useEffect(() => {
    fetchData()
      .then((res) => {
        setEvents(res)
        console.log(res);
      })
      .catch((e) => {
        console.log(e.message)
      })
  }, [])
}
