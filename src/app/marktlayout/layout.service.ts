import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { Logger } from '../logger';
import { TnNode } from '../shared/models/tn-node';
import { IInfo, ILayoutEntry } from './ilayout-entry';

@Injectable()
export class LayoutService {
  canvas: fabric.Canvas;
  canvasRef = 'myCanvas';
  nodes: TnNode[];
  savedLayoutEntries: ILayoutEntry[];
  fontSize = 14;
  currentSelectedObj;
  currentScale;
  defaultData: ILayoutEntry = {x: 10, y: 10, width: 150, height: 40, angle: 0, systemId: 1 };
  savedJson;
  dummyNodes: TnNode[] = [
    {
    category: 1,
    connection: 'string',
    connectionType: 1,
    firmware: 'string',
    name: 'string1',
    position: 'po1',
    priority: 1,
    serial: 'string',
    swType: 1,
    swTypeStr: 'string',
    systemId: 1,
    type: 'string',
    vendor: 'string',
    verbundnr: 1
  },
  {
    category: 1,
    connection: 'string',
    connectionType: 1,
    firmware: 'string',
    name: 'string2',
    position: 'po2',
    priority: 1,
    serial: 'string',
    swType: 1,
    swTypeStr: 'string',
    systemId: 2,
    type: 'string',
    vendor: 'string',
    verbundnr: 1
  },
  {
    category: 1,
    connection: 'string',
    connectionType: 1,
    firmware: 'string',
    name: 'string3',
    position: 'po3',
    priority: 1,
    serial: 'string',
    swType: 1,
    swTypeStr: 'string',
    systemId: 3,
    type: 'string',
    vendor: 'string',
    verbundnr: 1
  },
  {
    category: 1,
    connection: 'string',
    connectionType: 1,
    firmware: 'string',
    name: 'string444',
    position: 'po3',
    priority: 1,
    serial: 'string',
    swType: 1,
    swTypeStr: 'string',
    systemId: 4,
    type: 'string',
    vendor: 'string',
    verbundnr: 1
  },
  {
    category: 1,
    connection: 'string',
    connectionType: 1,
    firmware: 'string',
    name: 'string555',
    position: 'po3',
    priority: 1,
    serial: 'string',
    swType: 1,
    swTypeStr: 'string',
    systemId: 5,
    type: 'string',
    vendor: 'string',
    verbundnr: 1
  }
];

  constructor() {
  }
  
  
  /**
   * the main function that generate canvas with boxes that show nodes data 
   * @param nodes
   * @param layoutEntries
   * @param isEditMode
   * @param canvasWidth
   * @param canvasHeight
   */
  generateLayout(nodes: TnNode[], layoutEntries: ILayoutEntry[], isEditMode: boolean, canvasWidth: number,
    canvasHeight: number) {
      this.nodes = nodes;
      const defaultLayoutEntries = this.getDefaultLayoutEntries(nodes.map( node => { 
        return {systemId: node.systemId}; 
      }),
      canvasWidth);
      if ( !layoutEntries) { 
        this.savedLayoutEntries = defaultLayoutEntries;
      } else {
        this.savedLayoutEntries = layoutEntries;
      }

      // initialize canvas
      this.initializeCanvas(canvasWidth, canvasHeight);
      
      // create boxes on the canvas
      nodes.forEach( (node, nodeIndex) => {
        const boxInfo = this.getBoxInfo(node, this.savedLayoutEntries[nodeIndex]);
        this.createBox(boxInfo);
      });

      this.enableEditing(isEditMode);
      this.savedJson = this.canvas.toObject();
      this.canvas.renderAll();
  }

  /**
   * update the current layout when the user scales a box
   * @param modifiedLayoutEntry 
   */
  updateLayout(modifiedLayoutEntry: ILayoutEntry) {
    this.canvas.clear();
    this.nodes.forEach( (node, index) => {
      if ( modifiedLayoutEntry && modifiedLayoutEntry.systemId === node.systemId) {
        this.savedLayoutEntries[index] = modifiedLayoutEntry;
      }
      const info = this.getBoxInfo(node, this.savedLayoutEntries[index]);
      this.createBox(info);  
    });
    // this.savedJson = this.canvas.toObject();
    this.canvas.renderAll();
  }


/**
 * modify a layout entry by his id in the arry of the saved 
 * layout entries
 * @param obj 
 */
modifyLayoutEntry(obj: any) {
  const modifiedLayoutEntry = this.getModifiedLayoutEntry(obj);
  const id = modifiedLayoutEntry.systemId;
  const index = this.savedLayoutEntries.findIndex( entry => {
    return entry.systemId === id;
  });
  if ( index  !== -1) {
    this.savedLayoutEntries[index] = modifiedLayoutEntry;
  }
}

  /**
   * initialize canvas then set some settings and add some events listeners
   * @param canvasWidth 
   * @param canvasHeight 
   */
  initializeCanvas(canvasWidth: number, canvasHeight: number) {
    this.canvasRef = 'myCanvas';
    this.canvas = new fabric.Canvas(this.canvasRef);
    this.canvas.setWidth(canvasWidth);
    this.canvas.setHeight(canvasHeight);
    this.setSelectionOptions();
    this.onObjectModified(this.canvas);
    this.onObjectScaled(this.canvas);
    this.onMouseClick(this.canvas);
    this.onMultiSelect(this.canvas);
    this.onMouseMoving();
    this.onObjectScaling();
    this.preventMultiSelection(this.canvas);
  }

  /**
   * return array of default layout entries that will be used when the user
   * has no already saved layout entries
   * @param nodes
   * @param canvasWidth
   */
  getDefaultLayoutEntries(nodes: {systemId: number}[], canvasWidth: number): ILayoutEntry[] {
    const positionsArr: { x: number; y: number }[] = [];
    const defaultLayoutEntries = [];
    const columns = Math.floor(canvasWidth / (this.defaultData.width + 10));
    const rows = Math.ceil(nodes.length / columns);
    for (let i = 0; i <= rows - 1; i++) {
      for (let j = 0; j <= columns - 1; j++) {
        const x = 10 + (j * 10) + (j * this.defaultData.width);
        const y = 10 + (i * 10) + (i * this.defaultData.height);
        positionsArr.push({x, y});
      }
    }
    nodes.forEach( (node, index) => {
        const entry = {
          x: positionsArr[index].x,
          y: positionsArr[index].y,
          width: 150,
          height: 40,
          angle: 0,
          systemId: node.systemId
         };
         defaultLayoutEntries.push(entry);
    });
    return defaultLayoutEntries;
  }

  onObjectModified(canvas) {
    const _this = this;
    canvas.on('object:modified', function(options) {
      if (options.target) {
        _this.modifyLayoutEntry(options.target);
        this.savedJson = this.toObject();
        this.renderAll();

      }
    });
  }


  /**
   * return layout entry object from the box that was modified
   * after setting some constraints on the elements of this object 
   * @param obj 
   */
  getModifiedLayoutEntry(obj: any): ILayoutEntry {

    const group: fabric.Group = <fabric.Group>obj;
    const rect1: fabric.Rect = <fabric.Rect>group.getObjects()[0];
    const rect2: fabric.Rect = <fabric.Rect>group.getObjects()[1];
    const textBlock1: fabric.Text = <fabric.Text>group.getObjects()[2];
    const textBlock2: fabric.Text = <fabric.Text>group.getObjects()[3];
    const textBlock3: fabric.Text = <fabric.Text>group.getObjects()[4];
    let height = group.get('height') * group.get('scaleY');
    let y = group.top;
    if ( height <  this.defaultData.height) {
      height =  this.defaultData.height;
      if ( group.get('top') + height > this.canvas.getHeight()) {
        y = this.canvas.getHeight() - height;
      }
    }
    let width = group.get('width') * group.get('scaleX');
    let x = group.left;
    if ( width <  50) {
      width =  50;
      if ( group.get('left') + width > this.canvas.getWidth()) {
        x = this.canvas.getWidth() - width;
      }
    }
    const layoutEntry = {
      systemId: Number(textBlock3.text),
      x: x,
      y: y,
      width: width,
      height: height,
      angle: 0
    }; 
   
    return layoutEntry;
}



  onMouseClick(canvas) {
    const _this = this;
    canvas.on('mouse:down', function(options) {
      if (options.target) {
        _this.currentScale = {
          scaleX: 1 + options.target.left / options.target.get('width'),
          scaleY: 1 + options.target.top / options.target.get('height')
        };
      }
    });
  }

  preventMultiSelection(canvas) {
    canvas.on('mouse:down', function(options) {
      const objs = this.getActiveObjects();
      if (objs) {
        if (objs.length > 1) {
          objs.forEach ( obj => {
            this.discardActiveObject();
          });
        }
       }
    });
  }

  onMultiSelect(canvas) {
    const _this = this;
    canvas.on('selection:created', function (e) {
    });
  }

  /**
   * set constraints on the moving of boxes withen their canvas
   */
  onMouseMoving() {
    this.canvas.on('object:moving', function(e) {
      const activeObject = e.target;
      if ((activeObject.get('left')) < 0 ) {
         activeObject.set('left', 10);
      }
      if ((activeObject.get('top') < 0)) {
        activeObject.set('top', 10);
      }
      if (activeObject.get('left')
        > this.getWidth() - (activeObject.get('width') * activeObject.get('scaleX'))) {
        const positionX = this.getWidth() - (activeObject.get('width') * activeObject.get('scaleX'));
          activeObject.set('left', positionX - 10);
      }
      if (activeObject.get('top')
        > this.getHeight() - (activeObject.get('height') * activeObject.get('scaleY'))) {
          const positionY = this.getHeight() - (activeObject.get('height') * activeObject.get('scaleY'));
          activeObject.set('top', positionY - 10);
      }

    });
  }

  onObjectScaling() {
    const _this = this;
    this.canvas.on('object:scaling', function(e) {
      _this.setConstraints(e.target, false);
   });
  }

  onObjectScaled(canvas) {
    const _this = this;
    canvas.on('object:scaled', function (e) {
      try {
        _this.setConstraints(e.target, true);
        const modifiedLayoutEntry = _this.getModifiedLayoutEntry(e.target);
        _this.updateLayout(modifiedLayoutEntry);
      } catch (err) {

      }
    });
  }

  /**
   * set constraints on the scale of boxes
   * @param activeObject 
   * @param scaleEnded 
   */
  setConstraints(activeObject: any, scaleEnded: boolean) {
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    const activeObjectLeft = activeObject.get('left');
    const activeObjectTop = activeObject.get('top');

    const activeObjectWidth = activeObject.get('width');
    const activeObjectScaleX = activeObject.get('scaleX');
    const newWidth = activeObjectWidth * activeObjectScaleX ;

    const activeObjectHeight = activeObject.get('height');
    const activeObjectScaleY = activeObject.get('scaleY');
    const newHeight = activeObjectHeight * activeObjectScaleY ;


    if ( activeObjectLeft < 0) {
      activeObject.set('scaleX', this.currentScale.scaleX );
      activeObject.set('left', 0);
     }

     if ( activeObjectTop < 0) {
      activeObject.set('scaleY', this.currentScale.scaleY);
      activeObject.set('top', 0);
     }

     if ( (activeObjectLeft + newWidth) > canvasWidth ) {
        activeObject.set('scaleX', 1 + (canvasWidth - activeObjectLeft - activeObjectWidth) /  activeObjectWidth);
     }
     if ( (activeObjectTop + newHeight) > canvasHeight ) {
        activeObject.set('scaleY', 1 + (canvasHeight - activeObjectTop - activeObjectHeight) /  activeObjectHeight);
     }
     if (scaleEnded) {
       if ((activeObjectScaleX < 1) && (activeObjectLeft + this.defaultData.width
         > canvasWidth)) {
         const positionX = canvasWidth - (activeObjectWidth * activeObjectScaleX);
         activeObject.set('left', positionX);
       }

       if ((activeObjectScaleY < 1) && (activeObjectTop + this.defaultData.height
         > canvasHeight)) {
         const positionY = canvasHeight - (activeObjectHeight * activeObjectScaleY);
           activeObject.set('top', positionY);
       }
       if ( newWidth >= canvasWidth) {
         activeObject.set('scaleX', (canvasWidth - 10) / activeObjectWidth);
        }
       if ( newHeight >= canvasHeight) {
          activeObject.set('scaleY', (canvasHeight - 10) / activeObjectHeight);
       }
     }
  }


  // Combine data from a node and a layoutEntry to return info object
  getBoxInfo(node: TnNode, layoutEntry: ILayoutEntry): IInfo {
    const info = {
      systemId: node.systemId,
      name: node.name,
      position: node.position,
      x: layoutEntry.x,
      y: layoutEntry.y,
      width: layoutEntry.width,
      height: layoutEntry.height,
      angle: layoutEntry.angle
    };
    return info;
  }

   createBox(info: IInfo) {
    const fixedHeight = this.defaultData.height / 2;
    const rect1 = this.createRect(0, info.width, fixedHeight, '#f5f5f5');
    const changeableHeihgt = info.height - fixedHeight;
    const rect2 = this.createRect(info.height / 2, info.width, changeableHeihgt, '#b0bec5');
    const text1 = this.createText(info.name, 0, '#857d8b', this.fontSize);
    const text2 = this.createText(info.position.toString(), fixedHeight, '#f5f5f5', this.fontSize);
    const text3 = this.createText(info.systemId.toString(), fixedHeight, '#f5f5f5', 0);
    const group = new fabric.Group([rect1, rect2, text1, text2, text3], {
      left: info.x,
      top: info.y,
      angle: info.angle,
      hasRotatingPoint: false,
    });
    this.canvas.add(group);
   }



  private createText(text: string, top: number, fill: string, fontSize: number) {
    return new fabric.Text(text, {
      top: top,
      left: 0,
      fontStyle: 'normal',
      fontFamily: 'Kapra',
      fontSize: fontSize,
      lineHeight: 0.7,
      strokeWidth: 1,
      fill: fill,
      textAlign: 'left',
      originX: 'center',
      originY: 'center'
    });
  }

  private createRect(top: number, width: number, height: number, fill: string) {
    const rect = new fabric.Rect({
      top: top,
      width: width,
      height: height,
      fill: fill,
      stroke: '#ffffff',
      strokeWidth: 1,
      shadow: 'rgba(0,0,0,0.3) 5px 5px 5px',
      originX: 'center',
      originY: 'center'
    });
    return rect;
  }

  // return array of all layout entries that were modified
  getModifiedEntries(nodes: TnNode[]): ILayoutEntry[] {
    this.savedJson = this.canvas.toObject();
    const layoutEntries: ILayoutEntry[] = [];
    nodes.forEach( (node, index) => {
      const width = this.canvas.toObject().objects[index].width *
        this.savedJson.objects[index].scaleX;

      const height = this.canvas.toObject().objects[index].height *
        this.savedJson.objects[index].scaleY;
      const layoutEntry = {
              systemId: node.systemId,
              x: this.canvas.toObject().objects[index].left,
              y: this.canvas.toObject().objects[index].top,
              width: width,
              height: height,
              angle: this.canvas.toObject().objects[index].angle
      };


      layoutEntries.push(layoutEntry);
    });
    return layoutEntries;
  }

  load() {
    this.canvas.clear();
    this.canvas.loadFromJSON(this.savedJson, this.canvas.renderAll.bind(this.canvas));
    this.savedLayoutEntries = this.getModifiedEntries(this.nodes);
    this.canvas.renderAll();
    
  }

  private setSelectionOptions() {
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: 'rgba(102,153,255,0.5)',
      cornerSize: 15,
      padding: 10
    });
  }

  changeBackground(src: string) {
    this.canvas.setBackgroundImage(src, this.canvas.renderAll.bind(this.canvas));
  }

  /**
   * allow or prevent modifying a box on the canvas
   * @param group 
   * @param allowEdit 
   */
  private setEditorPropertiesForGroup(group, allowEdit: boolean) {
    group.lockMovementX = !allowEdit;
    group.lockMovementY = !allowEdit;
    group.lockRotation = true;
    group.lockScalingFlip = !allowEdit;
    group.lockScalingX = !allowEdit;
    group.lockScalingY = !allowEdit;
    group.lockUniScaling = !allowEdit;
    fabric.Object.prototype.selectable = allowEdit;
  }

  enableEditing(allowEdit: boolean) {
    this.canvas.getObjects().forEach(group => {
      this.setEditorPropertiesForGroup(group, allowEdit);
    });
    if (allowEdit) {
      this.canvas.setActiveObject(this.canvas.getObjects()[0]);
    } else {
      this.canvas.discardActiveObject();
    }
    this.canvas.renderAll();
  }

}












