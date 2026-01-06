import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encodeUrl'
})
export class EncodeUrlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return encodeURIComponent(value);
  }
}
