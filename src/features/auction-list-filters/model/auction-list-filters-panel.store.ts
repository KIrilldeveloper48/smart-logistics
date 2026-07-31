import { makeAutoObservable } from 'mobx';

export class AuctionListFiltersPanelStore {
  isOpen = false;

  public constructor() {
    makeAutoObservable(this);
  }

  public setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
  }

  public close(): void {
    this.isOpen = false;
  }
}
