class Observer {
  eventList: { [key: string]: Function[] } = {};

  notify<T>(eventType: string, data: T): void {
    if (this.eventList[eventType]) {
      this.eventList[eventType].forEach((func) => func(data));
    }
  }

  subscribe(eventType: string, callback: Function): void {
    if (!this.eventList[eventType]) {
      this.eventList[eventType] = [callback];
    } else if (!this.isExist(eventType, callback)) {
    } else {
      this.eventList[eventType].push(callback);
    }
  }

  isExist(eventType: string, callback: Function): boolean {
    let exist = false;
    this.eventList[eventType].find((func) => {
      exist = func.name === callback.name;
    });

    return exist;
  }
}

export default Observer;
