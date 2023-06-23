import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(UserService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user by id', () => {
    const userId = '1';
    const expectedUser = { id: '1', name: 'John Doe' };

    // Mock the HTTP request for get() and return a predefined user
    jest.spyOn(httpClient, 'get').mockReturnValue(of(expectedUser));

    service.getById(userId).subscribe((user) => {
      expect(user).toEqual(expectedUser);
      expect(httpClient.get).toHaveBeenCalledWith('api/user/1'); // Verify the HTTP request was made with the correct URL
    });
  });

  it('should delete user by id', () => {
    const userId = '1';

    // Mock the HTTP request for delete() and return an empty response
    jest.spyOn(httpClient, 'delete').mockReturnValue(of(null));

    service.delete(userId).subscribe((response) => {
      expect(response).toBeNull();
      expect(httpClient.delete).toHaveBeenCalledWith('api/user/1'); // Verify the HTTP request was made with the correct URL
    });
  });
});
