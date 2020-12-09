export class Observer {
  eventList: {[key: string]: Function[]} = {};
  
  notify<T>(eventType: string, data: T): void {
    if(this.eventList[eventType]) {
       this.eventList[eventType].forEach( func => func(data))
    }
  }

  subscribe(eventType: string, callback: Function): void { 
    if (!this.eventList[eventType]) {
      this.eventList[eventType] = [callback];
      return;
    } else if (this.isExist(eventType, callback)) {
      return;
    } else {
      this.eventList[eventType].push(callback);
    }
  }

  isExist(eventType: string, callback: Function): boolean {
    let exist: boolean = false;
    this.eventList[eventType].find( func => {
      exist = func.name === callback.name ? true : false;
    })

    return exist;
  }
}

