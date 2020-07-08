export enum Tools {
    MODULE = "module",
    LAZYLOADEDMODULE = "lazy-loaded module",
    COMPONENT = "component",
    SERVICE = "service",
    PIPE = "pipe",
    DIRECTIVE = "directive",
    CLASS = "class",
    ENUM = "enum",
    GUARD = "guard",
    INTERCEPTOR = "interceptor",
    INTERFACE = "interface",
    LIBRARY = "library",
    WEBWORKER = "webWorker",
}


export class Node {
    constructor(public id: string, public name: string, public type: Tools, public childNodes: Array<Node>) { }
}