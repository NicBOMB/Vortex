import {IExtensionApi} from '../types/IExtensionContext';

class ReduxProp<T> {
  private mInputs: string[][];
  private mFunc: (...args) => T;
  private mApi: IExtensionApi;
  private mSubscribers: Array<React.Component<any, any>>;
  private mUnsubscribe: () => void;

  constructor(api: IExtensionApi, inputs: string[][], func: (...args) => T) {
    this.mInputs = inputs;
    this.mFunc = func;
    this.mApi = api;
    this.mSubscribers = [];
  }

  public attach(component: React.Component<any, any>) {
    if (this.mSubscribers.length === 0) {
      this.subscribe();
    }
    this.mSubscribers.push(component);
  }

  public detach(component: React.Component<any, any>) {
    const idx = this.mSubscribers.indexOf(component);
    this.mSubscribers.splice(idx, 1);
    if (this.mSubscribers.length === 0) {
      this.unsubscribe();
    }
  }

  public calculate(): T {
    if (this.mApi === undefined) {
      return undefined;
    }
    const values = this.mInputs.map((valPath) => valPath.reduce((p,e)=>(p?.[e]),this.mApi.store.getState()));
    return this.mFunc(...values);
  }

  private subscribe() {
    if (this.mApi === undefined) {
      return;
    }
    let oldState = this.mApi.store.getState();
    this.mUnsubscribe = this.mApi.store.subscribe(() => {
      const changed = this.mInputs.find((valPath) =>
        valPath.reduce((p,e)=>(p?.[e]), oldState) !==
        valPath.reduce((p,e)=>(p?.[e]), this.mApi.store.getState())
      );

      oldState = this.mApi.store.getState();
      if (changed !== undefined) {
        this.mSubscribers.forEach(sub => sub.forceUpdate());
      }
    });
  }

  private unsubscribe() {
    this.mUnsubscribe();
    this.mUnsubscribe = undefined;
  }
}

export default ReduxProp;
