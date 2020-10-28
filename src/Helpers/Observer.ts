export class Observer {
  eventsList: any = {};
  constructor() {}

  notify(type: string, data: object): void {
    this.eventsList[type].forEach( event => {
      event(data);
    })
  }

  subscribe(type: string, event: Function): void {
    if (!this.eventsList[type]) {
      this.eventsList[type] = [];
    } else {
      this.eventsList[type].push(event);
    }
  }
}

