import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DialogComponent } from './dialog/dialog.component';

import { InMemoryDataService } from './in-memory-data.service';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    BrowserTransferStateModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),

    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    DialogComponent,
  ],
})
export class AppModule { }
