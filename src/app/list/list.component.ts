import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  ComponentRef,
  ComponentFactory
} from '@angular/core';


import { Subscription } from 'rxjs';

import { Node } from '../shared/node';
import { ListItemComponent } from './list-item/list-item.component';
import { DataService } from '../data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("nodescontainer", { read: ViewContainerRef, static: true }) vf: ViewContainerRef;
  rootnode: Node;
  sub: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private dataService: DataService) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sub = this.dataService.getData().subscribe(d => {
      this.vf.clear()
      this._addELement(d, this.vf);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  _addELement(node: Node, vf: ViewContainerRef) {
    let resolver: ComponentFactory<ListItemComponent> = this.componentFactoryResolver.resolveComponentFactory(ListItemComponent);
    let componentRef: ComponentRef<ListItemComponent> = vf.createComponent(resolver);
    componentRef.instance.nodeItem = node;
    componentRef.changeDetectorRef.detectChanges();
    if (node.childNodes.length === 0) {
      return;
    } else {
      for (let n of node.childNodes) {
        this._addELement(n, componentRef.instance.vf);
      }
    }
}
}
