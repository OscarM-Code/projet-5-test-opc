import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { of } from 'rxjs';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch all teachers', () => {
    const mockTeachers = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Michael Johnson' },
    ];
    jest
      .spyOn(service['httpClient'], 'get')
      .mockReturnValueOnce(of(mockTeachers));

    service.all().subscribe((teachers) => {
      expect(teachers).toEqual(mockTeachers);
    });
  });

  it('should fetch teacher detail by id', () => {
    const mockTeacherId = '1';
    const mockTeacher = { id: '1', name: 'John Doe' };

    jest
      .spyOn(service['httpClient'], 'get')
      .mockReturnValueOnce(of(mockTeacher));

    service.detail(mockTeacherId).subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher);
    });
  });
});
