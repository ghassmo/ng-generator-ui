import { Component, OnInit, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Node, Tools } from '../../shared/node';
import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  @ViewChild("nodescontainer", { read: ViewContainerRef, static: true }) vf: ViewContainerRef;
  @Input() nodeItem: Node;

  updateMode: boolean = false;

  types: Array<Tools> = [
    Tools.COMPONENT,
    Tools.SERVICE,
    Tools.DIRECTIVE,
    Tools.PIPE,
    Tools.MODULE,
    Tools.LAZYLOADEDMODULE,
    Tools.GUARD,
    Tools.LIBRARY,
    Tools.INTERFACE,
    Tools.CLASS,
    Tools.ENUM,
    Tools.INTERCEPTOR,
    Tools.WEBWORKER
  ];

  addForm: FormGroup;

  showAddForm: boolean = false;
  constructor(private dataService: DataService) { }

  ngOnInit(): void { }

  addNewNode() {
    if (this.addForm.valid) {
      if (this.updateMode) {
        const newNode = new Node(this.nodeItem.id, this.addForm.value.name, this.addForm.value.type, this.nodeItem.childNodes);
        this.dataService.onUpdateNode(newNode);
      } else {
        const id = '_APP' + Math.random().toString(36).substr(2, 9);
        const newNode = new Node(id, this.addForm.value.name, this.addForm.value.type, []);
        this.dataService.onAddNewNode(newNode, this.nodeItem.id);
      }
    }
  }

  onAddNewNode() {
    if (this.updateMode) {
      this.showAddForm = true;
    } else {
      this.showAddForm = !this.showAddForm;
    }
    this.updateMode = false;
    this.addForm = new FormGroup({
      name: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
    });
  }

  onDeleteNode() {
    this.dataService.onDeleteNode(this.nodeItem)
  }

  onUpdateNode() {
    if (this.updateMode) {
      this.showAddForm = !this.showAddForm;
    } else {
      this.updateMode = true;
      this.addForm = new FormGroup({
        name: new FormControl(this.nodeItem.name, Validators.required),
        type: new FormControl(this.nodeItem.type, Validators.required),
      });
      this.showAddForm = true;
    }

  }

}
