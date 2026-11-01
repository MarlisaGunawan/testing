import { HttpErrorResponse } from '@angular/common/http';

export function errorMessage(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'Cannot reach the API. Is testing-api running on port 3000?';
  }
  return (err.error && err.error.message) || err.message || 'Something went wrong';
}
