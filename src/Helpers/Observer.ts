export class Observer {
  eventsList: any = {};
  constructor() {}

  notify(type: string, data: object = {}): void {
    this.eventsList[type].forEach( event => {
      event(data);
    })
  }

  subscribe(type: string, event: Function): void { 
    if (!this.eventsList[type]) {
      this.eventsList[type] = [event];
      return;
    }

    if (this.isExist(type, event)) { return };
    this.eventsList[type].push(event);
  }

  isExist(type: string, event: Function): boolean {
    let exist: boolean = false;
    this.eventsList[type].find(item => {
      exist = item.name === event.name ? true : false;
    })

    return exist;
  }
}

