import { Mapper } from '../../../base/mapper';
import { CardResponse } from '../../../../shared/response/card/card.response';
import { CardEntity } from '../../entities/card.entity';

export class CardResponseMapper
  implements Mapper<CardResponse, CardEntity>
{
  public mapFrom(response: CardResponse): CardEntity {
    const card = new CardEntity();

    return card;
  }

  public mapTo(card: CardEntity): CardResponse {

    const response = new CardResponse();
    
    const [month, day, year] = card?.dataValidade.split('/');

    const date = new Date(+year, +month - 1, +day);
    const noSpaceCardNumber = card.numeroCartao.replace(/\s/g, "");
     response.cardNumber = +noSpaceCardNumber
     response.securityCode = card.codigoSeguranca
     response.expirationDate = date


    return response;
  }
}
