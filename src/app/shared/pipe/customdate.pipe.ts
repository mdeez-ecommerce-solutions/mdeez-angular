import { Pipe, PipeTransform } from '@angular/core';
 import { UtcPipe } from 'angular2-moment';

@Pipe({
  name: 'customdate'
})
export class CustomdatePipe implements PipeTransform {

  transform(value:any ): unknown {
    var date = new Date(value);
//var month=date.getMonth()+1;
var moment =new UtcPipe().transform(date);
    return  moment.format("DD/MM/YYYY");//date.getUTCDate() +'/'+month+'/'+ +date.getUTCFullYear();
  }

}
