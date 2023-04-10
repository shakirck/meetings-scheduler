# Meeting Scheduler 

- integrate with google calender


# API endpoints

These endpoints allow you to handle Stripe subscriptions for Publish and Analyze.

## GET
`Login` [/auth/login](#auth-login) <br/>

## POST
`Auth/Callback` [/auth/callback](#auth-callback) <br/>
`Schedule Meetings` [/schedule/](#Schedulemeetings) <br/>
`Get Availabilities` [/schedule/availability?date=DD/MM/YYYY](#availability) <br/>
`Get meetings` [/schedule/meetings](#schedulemeetings) <br/>
___

### GET /auth/login
Get tokens required for google calendar using google oauth. The host need to login atleast once to start scheduling meetings with other non hosts



### GET /auth/gmail/callback
callback url from google oauth. this will get the accesstokens required 



### GET /schedule/
This will schedule a meeting with a host and non-host(can be another host);

##### Request Body 
```
{
  "summary": "meeting test calendely clone 1 ",
  "description": "This is an example meeting description",
  "startDateTime": "2023-04-11T11:00:00+05:30",
  "endDateTime": "2023-04-11T13:30:00+05:30",
  "attendee":"shakirckyt@gmail.com",
 
 
  "email":"shakirck333@gmail.com"
}


```


### GET /schedule/availability?date=11/04/2023
Get availability of a host 


##### parameters 
    date: string 
    format : dd/mm/yyyy
##### requestBody
    
```
{
    "email":"email@gmail.com"
}

```


### GET /schedule/meetings?date=11/04/2023
Get all meetings scheduled  . non host must be a registered user to get the data 


##### parameters 
    date: string 
    format : dd/mm/yyyy
##### requestBody
    
```
{
    "email":"email@gmail.com"
}

```



