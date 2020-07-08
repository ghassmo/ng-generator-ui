import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { DataService } from '../data.service';
import { Node, Tools } from '../shared/node'

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss']
})
export class CommandsComponent implements OnInit, OnDestroy {

  commandsList: Array<string> = [];
  skipTests: boolean = true;
  sub: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData() {
    this.sub = this.dataService.nodes.subscribe((d: Node) => {
      this.commandsList = [];
      this._parseNode(d, ".");
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  _parseNode(d: Node, path: string) {
    path += d.name === "APP" ? "" : "/" + d.name;
    for (let n of d.childNodes) {
      let command = `ng g ${n.type === Tools.LAZYLOADEDMODULE ? "module" : n.type} ${path}/${n.name}`;
      command += n.type === Tools.LAZYLOADEDMODULE ? ` --route ${n.name} --module app.module` :
        !this.skipTests
          && n.type !== Tools.WEBWORKER
          && n.type !== Tools.ENUM
          && n.type !== Tools.MODULE
          && n.type !== Tools.INTERFACE
          && n.type !== Tools.LIBRARY 
          ? ` --skipTests=true` : ``;

      this.commandsList.push(command);
      this._parseNode(n, path);
    }
  }

  onSave() {
    const data = this.commandsList.join("\n");
    let blob = new Blob([data], { type: 'text/plain' });
    blob.arrayBuffer()
    let a = document.createElement('a');
    a.download = "ng.sh";
    a.href = (window.webkitURL || window.URL).createObjectURL(blob);
    a.dataset.downloadurl = ['text/plain', a.download, a.href].join(":");
    a.click();
  }

  onCheck() {
    this.skipTests = !this.skipTests;
    this.sub.unsubscribe();
    this._getData();
  }
  onClear() {
    this.dataService.onClearNodes();
  }

}


