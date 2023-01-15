import { applyDecorators } from '@nestjs/common';
import {  ApiResponse } from '@nestjs/swagger';
import { ErrorSwagger } from './error.swagger';

export function ApiErrorResponses () {
    return applyDecorators(
        ApiResponse({ status: 400, description: 'Bad Request' , type: ErrorSwagger}),
        ApiResponse({ status: 204, description: 'No Content' , type: ErrorSwagger}),
        ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorSwagger }),
        ApiResponse({ status: 404, description: 'Not Found', type: ErrorSwagger }),
        ApiResponse({ status: 500, description: 'Internal Server Error', type: ErrorSwagger }),
        ApiResponse({ status: 504, description: 'Timeout', type: ErrorSwagger }),
    );
      
}