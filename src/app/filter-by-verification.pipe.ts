import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByVerification'
})
export class FilterByVerificationPipe implements PipeTransform {

  transform(items: any[], filterVerified: string): any[] {
    if (!filterVerified) {
      return items;
    }
    const isVerified = filterVerified === 'true';
    return items.filter(item => item.is_verified === isVerified);
  }

}
