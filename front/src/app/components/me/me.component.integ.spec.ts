import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import { expect } from '@jest/globals';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { of } from 'rxjs';

describe('MeComponent (Integration)', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let sessionService: SessionService;
  let userService: UserService;
  let router: Router;
  let matSnackBar: MatSnackBar;
  let controller: HttpTestingController;
  const pathService: string = 'api/user';

  class MockRouter {
    get url(): string {
      return '';
    }
    navigate(): Promise<boolean> {
      return new Promise<boolean>((resolve, _) => resolve(true));
    }
  }

  class MockSnackBar {
    open() {
      return {
        onAction: () => of({}),
      };
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        SessionService,
        UserService,
        { provide: MatSnackBar, useClass: MockSnackBar },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionService.logIn({
      token: '',
      type: '',
      id: 1,
      username: '',
      firstName: '',
      lastName: '',
      admin: false,
    });
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);
    controller = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on back', () => {
    const historyBackSpy = jest.spyOn(window.history, 'back');

    component.back();

    expect(historyBackSpy).toHaveBeenCalled();
  });

  it('should call userService.delete, display snackbar, logout, and navigate on delete', () => {
    jest.spyOn(userService, 'delete').mockReturnValue(of(null));
    const matSnackBarOpenSpy = jest.spyOn(matSnackBar, 'open');
    const sessionServiceLogOutSpy = jest.spyOn(sessionService, 'logOut');
    const routerNavigateSpy = jest.spyOn(router, 'navigate');

    component.delete();

    expect(userService.delete).toHaveBeenCalledWith('1');
    expect(matSnackBarOpenSpy).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      {
        duration: 3000,
      }
    );
    expect(sessionServiceLogOutSpy).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/']);
  });
});
