export class Observer {
  eventList: any = {};
  constructor() {}
  
  notify(type: string, data: object = {}): void {

    if(this.eventList[type]) {
       this.eventList[type].forEach( event => {
        event(data);
      })
    }
  }

  subscribe(type: string, event: Function): void { 
    if (!this.eventList[type]) {
      this.eventList[type] = [event];
      return;
    }

    if (this.isExist(type, event)) { return };
    this.eventList[type].push(event);
  }

  isExist(type: string, event: Function): boolean {
    let exist: boolean = false;
    this.eventList[type].find(item => {
      exist = item.name === event.name ? true : false;
    })

    return exist;
  }
}

