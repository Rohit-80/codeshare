import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ColDef, ColGroupDef, GridApi } from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
    selector : 'app-ag-grid',
  template: `
    <ag-grid-angular
      class="ag-theme-quartz-dark"
      style="width: 100%; height: 96%; text-align: center; "
      [rowData]="rowData"
      [columnDefs]="columnDefss"
      [pagination]="true"
      (paginationChanged)="pageChanged($event)"
      [paginationPageSize]="8"
      rowSelection="single"
      (selectionChanged)="row($event)"
      (gridReady)="onGridReady($event)" >

    </ag-grid-angular>
  `,
})
export class AgGridComponent implements OnChanges {
  @Input('rowDatas') rowDatas: any;
  @Input('colDefs') coldDefs: any;

  @Output() out : EventEmitter<any> = new EventEmitter<any>;
  @Output() pageEvent : EventEmitter<any> = new EventEmitter<any>;

 

  rowData: any;
  columnDefss : any;
  private gridApi!: GridApi<any>;
  obs! : Observable<any>;
  row(p: any) {
   
    let row = this.gridApi.getSelectedRows()
    this.out.emit(row);
     this.obs = new Observable(obs=>{
         obs.next({row});
        
     });  
    
  }

  pageChanged(event : any){
      if(this.gridApi){
          this.pageEvent.emit(this.gridApi.paginationGetCurrentPage());
      }
  }

  onGridReady(p: any) {
    this.gridApi = p.api;
  }

  ngOnChanges() {
    this.rowData = this.rowDatas;
    this.columnDefss = this.coldDefs;
  }
}
