import { Mapper } from '../../../base/mapper';
import { PersonEntity } from '../../entities/person.entity';
import { PersonResponseDto } from '../../../../shared/dtos/person/person-response.dto';

export class PersonResponseMapper
  implements Mapper<PersonResponseDto, PersonEntity>
{
  public mapFrom(response: PersonResponseDto): PersonEntity {
    const person = new PersonEntity();


  person.nome = response.name
  person.idade = response.age
  person.cpf = response.cpf.toString()
  person.rg = response.rg
  person.data_nasc = response.birthdate.toLocaleString()
  person.sexo = response.gender
  person.signo = response.sign
  person.mae = response.mother
  person.pai = response.father
  person.email = response.email
  person.cep = response.cep
  person.endereco = response.address
  person.numero = +response.number
  person.bairro = response.district
  person.cidade = response.city
  person.celular = response.phone.toString()
  person.altura = response.height
  person.peso = response.weight
  person.tipo_sanguineo = response.blood
  person.cor = response.color
    
    return person;
  }

  public mapTo(person: PersonEntity): PersonResponseDto {

    const response = new PersonResponseDto();
    
    const [month, day, year] = person?.data_nasc.split('/');

    const date = new Date(+year, +month - 1, +day);
    
     response.name = person?.nome
     response.age = person?.idade
     response.cpf = +person?.cpf
     response.rg = person?.rg
     response.birthdate = date
     response.gender = person?.sexo
     response.sign = person?.signo
     response.mother = person?.mae
     response.father = person?.pai
     response.email = person?.email
     response.cep = person?.cep
     response.address = person?.endereco
     response.number = person?.numero.toString()
     response.district = person?.bairro
     response.city = person?.cidade
     response.phone= +person?.celular
     response.height = person?.altura
     response.weight = person?.peso
     response.blood = person?.tipo_sanguineo
     response.color = person?.cor


    return response;
  }
}
