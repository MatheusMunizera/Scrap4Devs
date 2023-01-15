import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
        catchError(err => {
            if (err instanceof HttpException) {
              switch (err.getStatus()) {
                case HttpStatus.BAD_REQUEST:
                    console.error(err.message);  
                  throw new HttpException('The request could not be understood or was missing required parameters', HttpStatus.BAD_REQUEST);
                case HttpStatus.UNAUTHORIZED:
                    console.error(err.message);  
                  throw new HttpException('The request requires user authentication', HttpStatus.UNAUTHORIZED);
                case HttpStatus.NOT_FOUND:
                    console.error(err.message);  
                  throw new HttpException('The requested resource could not be found', HttpStatus.NOT_FOUND);
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    console.error(err.message);  
                  throw new HttpException('An unexpected condition was encountered by the server', HttpStatus.INTERNAL_SERVER_ERROR);
                case HttpStatus.NO_CONTENT:
                    console.error(err.message);  
                  throw new HttpException('The server successfully processed the request, but is not returning any content"', HttpStatus.NO_CONTENT);
                  case HttpStatus.GATEWAY_TIMEOUT:
                    console.error(err.message);  
                  throw new HttpException('The server is acting as a gateway and did not receive a timely response from the upstream server', HttpStatus.GATEWAY_TIMEOUT);
                default:
                    console.error(err.message);  
                  throw new HttpException('An unexpected condition was encountered by the server', HttpStatus.INTERNAL_SERVER_ERROR);
              }
            } else {
                console.error(err.message);  
              throw new HttpException('An unexpected condition was encountered by the server', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            }),
    );
  }
}
