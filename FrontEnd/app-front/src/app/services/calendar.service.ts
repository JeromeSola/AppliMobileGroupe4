import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient,) { }

  getMySportEvents(access_token){
    return this.http.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&alt=json&access_token=${access_token}&key=AIzaSyAqdQDXdIX8WGmPXEcTLAepq8A5aag-mJI`)
  }

  createSportEvent(access_token,event){
    return this.http.post(`https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json&access_token=${access_token}&key=AIzaSyAqdQDXdIX8WGmPXEcTLAepq8A5aag-mJI`,event)
  }

  
  deleteSportEvent(access_token,eventId){
    return this.http.delete(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?alt=json&access_token=${access_token}&key=AIzaSyAqdQDXdIX8WGmPXEcTLAepq8A5aag-mJI`)
  }

  parseEvent(dialogflow_params){
    let minutes=dialogflow_params.duration.amount%60
    let dateEnd=new Date(dialogflow_params.date+'T'+dialogflow_params.time)
    let minuteBadSyntax=dateEnd.getMinutes()+minutes


    let hours=Math.trunc(dialogflow_params.duration.amount/60)
    console.log(hours)
    if (minuteBadSyntax>=60){
      hours+=1
      minuteBadSyntax=minuteBadSyntax%60
    }
    let hourBadSyntax=dateEnd.getHours()+hours
    console.log(hourBadSyntax)
    if (hourBadSyntax>=24){
      console.log(hourBadSyntax%24)
      hourBadSyntax=hourBadSyntax%24
      dateEnd.setDate(dateEnd.getDate()+1)
    }
    console.log(hourBadSyntax)
    dateEnd.setHours(hourBadSyntax)
    dateEnd.setMinutes(minuteBadSyntax)
    return {
      summary: 'Coach Man '+dialogflow_params.activity.charAt(0).toUpperCase() + dialogflow_params.activity.substring(1).toLowerCase(),
      description: 'Séance de '+ dialogflow_params.activity+" avec ton coach préféré ! Prépare ta plus belle tenue de sport pour l'occasion.",
      start: {
        dateTime: dialogflow_params.date+'T'+dialogflow_params.time,
        timeZone: 'Europe/Paris'
      },
      end: {
        dateTime: dateEnd.toISOString(),
        timeZone: 'Europe/Paris'
      },
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 }
        ]
      }
    }

     
  }

  parseDate(event){
    let monthParser={
      "0":"01",
      "1":"02",
      "2":"03",
      "3":"04",
      "4":"05",
      "5":"06",
      "6":"07",
      "7":"08",
      "8":"09",
      "9":"10",
      "10":"11",
      "11":"12",
    }
    let dateStart=new Date(event.start.dateTime)
    let dateEnd=new Date(event.end.dateTime)
    let stringDateStart='Start: '+dateStart.getDate()+'/'+ monthParser[dateStart.getMonth()]+'/'+dateStart.getFullYear()+' at '+dateStart.getHours()+':'+(String(dateStart.getMinutes()).length==1?dateStart.getMinutes()+'0':dateStart.getMinutes());
    let stringDateEnd= 'End: '+dateEnd.getDate()+'/'+ monthParser[dateEnd.getMonth()]+'/'+dateEnd.getFullYear()+' at '+dateEnd.getHours()+':'+(String(dateEnd.getMinutes()).length==1?dateEnd.getMinutes()+'0':dateEnd.getMinutes());
    return stringDateStart+' - '+stringDateEnd
  }
}
