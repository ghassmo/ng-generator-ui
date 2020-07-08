import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Node, Tools } from './shared/node';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  rootNode: Node = new Node("MAINAPPID", "APP", Tools.MODULE, []);
  nodes = new BehaviorSubject<Node>(this.rootNode);

  constructor() { }

  onAddNewNode(newNode: Node, parentNodeId: string) {
    newNode.name = newNode.name.toLowerCase();
    this.searchForNode(parentNodeId, this.rootNode).current.childNodes.push(newNode);
    this.nodes.next(this.rootNode);
  };

  onDeleteNode(node: Node) {
    let cn = this.searchForNode(node.id, this.rootNode);
    cn.last.childNodes.splice(cn.indexOfNode, 1);
    this.nodes.next(this.rootNode);
  }


  onUpdateNode(node: Node) {
    let cn = this.searchForNode(node.id, this.rootNode);
    cn.current.name = node.name;
    cn.current.type = node.type;
    this.nodes.next(this.rootNode);
  }

  onClearNodes() {
    this.rootNode = new Node("MAINAPPID", "APP", Tools.MODULE, []);
    this.nodes.next(this.rootNode);
  }

  private searchForNode(nodeId: string, root: Node, indexOfNode: number = 0, lastNode?: Node, ): { current: Node, last: Node, indexOfNode: number } {
    if (nodeId === root.id) {
      return { current: root, last: lastNode, indexOfNode: indexOfNode };
    }
    else {
      if (root.childNodes.length > 0) {
        lastNode = root;
        for (let [i, n] of root.childNodes.entries()) {
          let x = this.searchForNode(nodeId, n, i, lastNode);
          if (x) {
            return x;
          }
        }
      } else {
        return null;
      }
    }

  }

  getData() {
    return this.nodes;
  }

}
