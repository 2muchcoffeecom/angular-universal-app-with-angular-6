import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { Observable, Subject, Subscription, of } from 'rxjs/index';
import { filter, switchMap, map, withLatestFrom } from 'rxjs/internal/operators';

import { DialogComponent } from './dialog/dialog.component';

export interface Order {
  name: string;
  completed: boolean;
}

const PURCHASES = makeStateKey('purchases');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  shoppingList$: Observable<Order[]>;
  shoppingList: Order[];

  add$: Subject<null> = new Subject<null>();
  update$: Subject<{ name: string, index: number }> = new Subject<{ name: string, index: number }>();
  delete$: Subject<number> = new Subject<number>();
  toggleStatus$: Subject<number> = new Subject<number>();

  addSubscription: Subscription;
  updateSubscription: Subscription;
  deleteSubscription: Subscription;
  toggleStatusSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private state: TransferState,
  ) { }

  ngOnInit() {
    this.shoppingList = this.state.get(PURCHASES, null as Order[]);
    if (!this.shoppingList) {
      this.shoppingList$ = this.getPurchases().pipe(
        switchMap((data) => {
          this.state.set(PURCHASES, data as any);
          return of(data);
        }),
      );
    } else {
      this.shoppingList$ = of(this.shoppingList as Order[]);
    }

    this.addSubscription = this.add$.pipe(
      switchMap(() => {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: { name: '' },
        });
        return dialogRef.afterClosed();
      }),
      filter((data) => data && data.name.trim() && data.choose),
      withLatestFrom(this.shoppingList$),
      map(([data, shoppingList]) => {
        shoppingList.push({ name: data.name, completed: false });
      }),
    )
    .subscribe(() => console.log('added'));

    this.updateSubscription = this.update$.pipe(
      switchMap((data) => {
        const dialogRef = this.dialog.open(DialogComponent, {
          data,
        });
        return dialogRef.afterClosed();
      }),
      filter((data) => data && data.name.trim() && data.choose),
      withLatestFrom(this.shoppingList$),
      map(([data, shoppingList]) => {
        shoppingList[data.index].name = data.name;
      }),
    )
    .subscribe(() => console.log('updated'));

    this.deleteSubscription = this.delete$.pipe(
      withLatestFrom(this.shoppingList$),
      map(([index, shoppingList]) => {
        shoppingList.splice(index, 1);
      }),
    )
    .subscribe(() => console.log('deleted'));

    this.toggleStatusSubscription = this.toggleStatus$.pipe(
      withLatestFrom(this.shoppingList$),
      map(([index, shoppingList]) => {
        shoppingList[index].completed = !shoppingList[index].completed;
      }),
    )
    .subscribe(() => console.log('toggled the status'));
  }

  ngOnDestroy() {
    this.addSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
    this.deleteSubscription.unsubscribe();
    this.toggleStatusSubscription.unsubscribe();
  }

  getPurchases(): Observable<Order[]> {
    return this.http.get<Order[]>('api/purchases');
  }

  add() {
    this.add$.next();
  }

  delete(index: number) {
    this.delete$.next(index);
  }

  toggleStatus(index: number) {
    this.toggleStatus$.next(index);
  }

  update(name: string, index: number) {
    this.update$.next({ name, index });
  }
}
