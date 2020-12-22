type EventList = {
  [key: string]: ((data) => unknown)[];
};

class Observer {
  eventList: EventList = {};

  notify<T>(eventType: string, data: T): void {
    if (this.eventList[eventType]) {
      this.eventList[eventType].forEach((func) => func(data));
    }
  }

  subscribe<T, D>(eventType: string, callback: (data: T) => D): void {
    if (!this.eventList[eventType]) {
      this.eventList[eventType] = [callback];
    } else {
      this.eventList[eventType].push(callback);
    }
  }
}

export default Observer;
