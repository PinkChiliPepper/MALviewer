import { HttpErrorResponse, } from '@angular/common/http';
import { Observable, retry, shareReplay, throwError, timer } from 'rxjs';

export function cacheForFiveMinutes<T>() {
  return shareReplay<T>({ bufferSize: 1, refCount: false, windowTime: 5 * 60 * 1000 });
}

export function retryOn429(maxRetries: number) {
  return <T>(source: Observable<T>) =>
    source.pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          if (!(error instanceof HttpErrorResponse) || error.status !== 429) {
            return throwError(() => error);
          }
          const retryAfter = error.headers.get('Retry-After');
          if (retryAfter) {
            const retrySec = parseInt(retryAfter, 10);
            if (!isNaN(retrySec)) return timer(retrySec * 1000);
          }
          return timer(2000 * Math.pow(2, retryCount));
        }
      })
    );
}
