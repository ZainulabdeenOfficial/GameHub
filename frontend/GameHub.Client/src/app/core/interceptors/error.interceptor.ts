import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error) => {
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error?.message || 'An error occurred',
        life: 3000
      });
      return throwError(() => error);
    })
  );
};
