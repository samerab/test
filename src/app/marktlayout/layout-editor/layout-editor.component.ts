import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LayoutService } from '../layout.service';
import { LayoutDataService } from '../layout-data.service';
import { NodesService } from '../../nodes/nodes.service';
import { forkJoin } from 'rxjs';
import { Logger } from '../../logger';
import { PanelComponent } from '../../shared/foundation-components/panel/panel.component';

@Component({
  selector: 'eag-layout-editor',
  templateUrl: './layout-editor.component.html',
  styleUrls: ['./layout-editor.component.less'],
  providers: [LayoutService, LayoutDataService]
})
export class LayoutEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('body') body: ElementRef;
  canvasWidth: number;
  canvasHeight: number;
  editMode = false;
  nodeList;


  constructor(  private layoutService: LayoutService,
                private layoutDataService: LayoutDataService,
                private nodesService: NodesService) {}

  ngOnInit() {
    //this.render();
    this.canvasWidth = this.body.nativeElement.clientWidth;
    this.canvasHeight = this.body.nativeElement.clientHeight;
    this.tempRender();
  }

  ngAfterViewInit() {}

  tempRender() {
    this.nodeList = this.layoutService.dummyNodes;
    this.getLayoutData().subscribe(
      results => {
        const layoutData = results;
        this.layoutService.generateLayout(this.nodeList, layoutData, this.editMode,
          this.canvasWidth, this.canvasHeight);
      }
    );

  }

  // render() {
  //   forkJoin(this.getNodeList(), this.getLayoutData()).subscribe(
  //     results => {
  //       this.nodeList = results[0];
  //       const layoutData = results[1];
  //       this.layoutService.generateLayout(this.nodeList, layoutData, this.editMode,
          // this.canvasWidth, this.canvasHeight);
  //     }
  //   );
  // }

  getNodeList() {
    return this.nodesService.getNodeList();
  }

  getLayoutData() {
   return this.layoutDataService.load();
  }

  save() {
    const modifiedEntries = this.layoutService.getModifiedEntries(this.nodeList);
    this.layoutDataService.save(modifiedEntries);
    this.edit(false);

  }



  cancel() {
    this.edit(false);
    this.layoutService.load();
  }



  edit(enabled: boolean) {
    this.layoutService.enableEditing(enabled);
    this.editMode = enabled;
  }


  setBackground() {
    this.layoutService.changeBackground('https://www.jensen-media.de/wp-content/uploads/2018/06/edeka_goerse_01.jpg');
  }

  clear() {
    this.layoutDataService.clear();

  }



}
