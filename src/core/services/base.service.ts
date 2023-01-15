
import { Service } from '../base/service';

export abstract class BaseService implements Service{
    Logger(message: string | object): void {
        console.log(message);
    }
    
}