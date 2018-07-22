import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ILayoutEntry } from './ilayout-entry';
import { Logger } from '../logger';

@Injectable()
export class LayoutDataService {
  private dummyData: ILayoutEntry[] = [{ x: 1, y: 2, width: 10, height: 10, angle: 0, systemId: 1 }];
  private initialLayoutData = {
    version: '2.3.3',
  objects: [
    {
      type: 'group',
      version: '2.3.3',
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
      width: 151,
      height: 71,
      fill: 'rgb(0,0,0)',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      shadow: null,
      visible: true,
      clipTo: null,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      transformMatrix: null,
      skewX: 0,
      skewY: 0,
      objects: [
        {
          type: 'rect',
          version: '2.3.3',
          originX: 'center',
          originY: 'center',
          left: 0,
          top: -17.5,
          width: 150,
          height: 35,
          fill: 'green',
          stroke: '#ffffff',
          strokeWidth: 1,
          strokeDashArray: null,
          strokeLineCap: 'butt',
          strokeLineJoin: 'miter',
          strokeMiterLimit: 4,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          flipX: false,
          flipY: false,
          opacity: 1,
          shadow: {
            color: 'rgba(0,0,0,0.3)',
            blur: 5,
            offsetX: 5,
            offsetY: 5,
            affectStroke: false
          },
          visible: true,
          clipTo: null,
          backgroundColor: '',
          fillRule: 'nonzero',
          paintFirst: 'fill',
          globalCompositeOperation: 'source-over',
          transformMatrix: null,
          skewX: 0,
          skewY: 0,
          rx: 0,
          ry: 0
        },
        {
          type: 'rect',
          version: '2.3.3',
          originX: 'center',
          originY: 'center',
          left: 0,
          top: 17.5,
          width: 150,
          height: 35,
          fill: 'blue',
          stroke: '#ffffff',
          strokeWidth: 1,
          strokeDashArray: null,
          strokeLineCap: 'butt',
          strokeLineJoin: 'miter',
          strokeMiterLimit: 4,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          flipX: false,
          flipY: false,
          opacity: 1,
          shadow: {
            color: 'rgba(0,0,0,0.3)',
            blur: 5,
            offsetX: 5,
            offsetY: 5,
            affectStroke: false
          },
          visible: true,
          clipTo: null,
          backgroundColor: '',
          fillRule: 'nonzero',
          paintFirst: 'fill',
          globalCompositeOperation: 'source-over',
          transformMatrix: null,
          skewX: 0,
          skewY: 0,
          rx: 0,
          ry: 0
        },
        {
          type: 'text',
          version: '2.3.3',
          originX: 'center',
          originY: 'center',
          left: -30,
          top: -17.5,
          width: 73.49,
          height: 25.99,
          fill: 'white',
          stroke: '#ffffff',
          strokeWidth: 1,
          strokeDashArray: null,
          strokeLineCap: 'butt',
          strokeLineJoin: 'miter',
          strokeMiterLimit: 4,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          flipX: false,
          flipY: false,
          opacity: 1,
          shadow: {
            color: 'rgba(0,0,0,0.3)',
            blur: 5,
            offsetX: 5,
            offsetY: 5,
            affectStroke: false
          },
          visible: true,
          clipTo: null,
          backgroundColor: '',
          fillRule: 'nonzero',
          paintFirst: 'fill',
          globalCompositeOperation: 'source-over',
          transformMatrix: null,
          skewX: 0,
          skewY: 0,
          text: '-17 °C',
          fontSize: 23,
          fontWeight: 'normal',
          fontFamily: 'Hoefler Text',
          fontStyle: 'italic',
          lineHeight: 0.7,
          underline: false,
          overline: false,
          linethrough: false,
          textAlign: 'left',
          textBackgroundColor: '',
          charSpacing: 0,
          styles: {}
        },
        {
          type: 'text',
          version: '2.3.3',
          originX: 'center',
          originY: 'center',
          left: -30,
          top: 17.5,
          width: 58.65,
          height: 25.99,
          fill: 'white',
          stroke: '#ffffff',
          strokeWidth: 1,
          strokeDashArray: null,
          strokeLineCap: 'butt',
          strokeLineJoin: 'miter',
          strokeMiterLimit: 4,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          flipX: false,
          flipY: false,
          opacity: 1,
          shadow: {
            color: 'rgba(0,0,0,0.3)',
            blur: 5,
            offsetX: 5,
            offsetY: 5,
            affectStroke: false
          },
          visible: true,
          clipTo: null,
          backgroundColor: '',
          fillRule: 'nonzero',
          paintFirst: 'fill',
          globalCompositeOperation: 'source-over',
          transformMatrix: null,
          skewX: 0,
          skewY: 0,
          text: '8888',
          fontSize: 23,
          fontWeight: 'normal',
          fontFamily: 'Hoefler Text',
          fontStyle: 'italic',
          lineHeight: 0.7,
          underline: false,
          overline: false,
          linethrough: false,
          textAlign: 'left',
          textBackgroundColor: '',
          charSpacing: 0,
          styles: {}
        }
      ]
    }
  ]
  };

  constructor() {}

  load(): Observable<ILayoutEntry[]> {
    let data;
    if (typeof Storage !== 'undefined') {
      const storageData = localStorage.getItem('layoutData');
      if (storageData) {
        data = JSON.parse(storageData);
      }
    }

    return of(data || null);
  }

  save(data: ILayoutEntry[]): Observable<boolean> {
    if (typeof Storage !== 'undefined') {
      localStorage.setItem('layoutData', JSON.stringify(data));
    }

    return of(true);
  }

  clear() {
    localStorage.clear();
  }




}


