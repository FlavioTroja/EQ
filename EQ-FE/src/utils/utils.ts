import { isArray, isEqual, isObject, transform } from 'lodash-es';
import { Sort } from "../app/models/Table";
import { DateTime } from "luxon";

function changes(newObj : any, origObj: any) {
  let arrayIndexCounter = 0
  return transform(newObj, function (result: any, value, key) {
    if (!isEqual(value, origObj[key])) {
      let resultKey = isArray(origObj) ? arrayIndexCounter++ : key
      result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value
    }
  })
}

export function difference(origObj: any, newObj: any) {
  return changes(newObj, origObj)
}

export function createORQuery(noActionColumns: string[], searchText: string) {
  if(!searchText) {
    return {}
  }
  return {
    OR: noActionColumns.map(searchColumn => ({
      [searchColumn]: { contains: (searchText), mode: "insensitive" },
    }))
  }
}

export function createSortArray(arr: Sort[]) {
  return arr.map(({ active, direction }) => ({
    [active]: direction
  }));
}

export function formatDate(date: string) {
  return DateTime.fromISO(date).setLocale("it").toLocaleString({ month: "long", day: "numeric", year: "numeric" });
}

export function formatDateWithHour(date: string) {
  return DateTime.fromISO(date).setLocale("it").toLocaleString({ month: "numeric", day: "numeric", year: "numeric", hour:"numeric", minute:"numeric" });
}

export function checkArrayDifference(original: any[], current?: any[]): number {
  return current?.filter(o => original.find(ob => JSON.stringify(o) !== JSON.stringify(ob)))?.length || 0;
}


// export function writeHtml(product: Product, canvas: HTMLCanvasElement, eanOrSku: "ean"|"sku", showPrice?: boolean) {
//   return `<html lang="it">
//                 <head>
//                     <title>${product.name}</title>
//                     <style>
//                         @page {
//                             size: auto;
//                             margin: 0;
//                         }
//                     </style>
//                 </head>
//                 <body onload="window.print()" onafterprint="window.close()">
//                     <div style="font-family: Times New Roman, Times, serif; text-align: center">
//                         <h4 style="margin-bottom: -20px;">${product.name}</h4><br>
//                         <div style="position: relative;">
//                             <span style="font-size: 10px;">${product[eanOrSku]}</span>
//                         </div>
//                         <img style="margin-top: -4px;margin-bottom: -4px;" alt src="${canvas?.toDataURL()}"/><br>
//                         ${ !!showPrice ? `
//                             <span style="font-size: 12px">PREZZO DI VENDITA: € ${((product.sellingPrice * (100 + (product.vat || 22)) / 100) || 0).toFixed(2).replace(".", ",")}</span>
//                          ` : ""}
//                     </div>
//                 </body>
//             </html>`;
// }

export function generateRandomCode(): string {
  return Math.random().toString(36).substring(2,7);
}
