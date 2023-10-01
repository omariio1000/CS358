// You"re not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import {
  List, listToString, snoc,
  LogicTree
} from "./Main";

import {
  Parsers, unparseList, unparseTree
} from "./Library";	   

export {
  parseNum, parseList, parseTree, identity
} from "./Library";

export const handleForm =
  <Ts extends any[], T> (
    form: HTMLFormElement,
    parsers: Parsers<Ts>,
    prettyPrinter: (output: T) => HTMLElement,
    handle: (...inputs: Ts) => T
  ): void => {
  const output = form.querySelector(".output")!;
  try {
    const inputValues = <Ts> Array.from(
      <NodeListOf<HTMLInputElement>> form.querySelectorAll("input[type=text]"),
      (input, i) => parsers[i](input.value)
    );
    output.innerHTML = prettyPrinter(handle(...inputValues)).outerHTML;
  } catch (e) {
    if (e instanceof Error)
      output.innerHTML = "Uncaught exception: " + e.message;
  }
}

export const prettyPrintObject = (obj: object): HTMLElement => {
  const numElement = document.createElement("span");
  numElement.innerText = obj.toString();
  return numElement;
}

export const prettyPrintList = (list: List): HTMLElement => {
  const listElement = document.createElement("span");
  listElement.innerText = unparseList(list);
  return listElement;
}

export const prettyPrintTree = (tree: LogicTree): HTMLElement => {
  const containerElement = document.createElement("div");

  const unparseElement = document.createElement("p");
  unparseElement.innerText = unparseTree(tree);
  containerElement.appendChild(unparseElement);

  const treeElement = document.createElement("ast-tree");
  treeElement.appendChild(prettyPrintNode(tree));
  containerElement.appendChild(treeElement);

  return containerElement;
};

export const prettyPrintNode = (tree: LogicTree): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  switch (tree.tag) {
    case "or":
      rootElement.setAttribute("data-name", "or");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "and":
      rootElement.setAttribute("data-name", "and");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "not":
      rootElement.setAttribute("data-name", "not");
      rootElement.appendChild(prettyPrintNode(tree.subtree));
      break;
    case "bool":
      rootElement.setAttribute("data-name", tree.value.toString());
      break;
  }
  return rootElement;
}

export const createElementSVG =
  <K extends keyof SVGElementTagNameMap> (tag: K) =>
    document.createElementNS("http://www.w3.org/2000/svg", tag);

export class ASTTreeElement extends HTMLElement {
  readonly #shadowRoot: ShadowRoot;

  static readonly #BRANCH_MARGIN_PIXELS = 20;
  static readonly #EDGE_HEIGHT_LINES = 2;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
      <div>
        <svg id="ast-frame"></svg>
        <slot></slot>
      </div>
    `;

    this.#shadowRoot.appendChild(template.content.cloneNode(true));
  }

  render(): SVGGraphicsElement {
    const frame = this.#shadowRoot.querySelector("#ast-frame") as SVGSVGElement;
    const positionGroup = frame.appendChild(createElementSVG("g"));

    const rootSVG = positionGroup.appendChild(createElementSVG("text"));
    rootSVG.innerHTML = this.getAttribute("data-name") ?? "";

    const rootBox = rootSVG.getBBox();
    const height = rootBox.height * ASTTreeElement.#EDGE_HEIGHT_LINES;

    positionGroup.setAttribute("transform", `translate(0 ${rootBox.height.toString()})`);

    rootSVG.setAttribute("stroke", "black");
    rootSVG.setAttribute("stroke-width", "0.25");

    const subtrees =
      Array.from(
        this.querySelectorAll(":scope > ast-node") as NodeListOf<ASTNodeElement>,
        subtree => {
          const outerGroup = positionGroup.appendChild(createElementSVG("g"));
          outerGroup.appendChild(subtree.render());
          return outerGroup;
        });

    const maxSubtreeHeight =
      subtrees.length == 0 ?
        0 :
        Math.max(... subtrees.map(subtree => subtree.getBBox().height));

    frame.setAttribute("height", (1.1 * (rootBox.height + height + maxSubtreeHeight)).toString());

    let width = 0;
    for (const subtree of subtrees) {
      subtree.setAttribute("transform", `translate(${width.toString()} ${height.toString()})`);
      width += ASTTreeElement.#BRANCH_MARGIN_PIXELS + subtree.getBBox().width;
    }

    width = ASTTreeElement.#BRANCH_MARGIN_PIXELS + Math.max(width, rootBox.width);

    const origin = {
      x: (width - ASTTreeElement.#BRANCH_MARGIN_PIXELS) / 2,
      y: rootBox.height
    };

    frame.setAttribute("width", width.toString());

    const rootX =
      subtrees.length > 0 ?
        origin.x - (rootBox.width / 2) :
        ASTTreeElement.#BRANCH_MARGIN_PIXELS / 2;

    rootSVG.setAttribute("x", rootX.toString());

    let subtreeX = 0;
    for (const subtree of subtrees) {
      const subtreeWidth = subtree.getBBox().width;
      subtreeX += (ASTTreeElement.#BRANCH_MARGIN_PIXELS + subtreeWidth) / 2;
      const line = frame.appendChild(createElementSVG("line"));
      line.setAttribute("x1", origin.x.toString());
      line.setAttribute("y1", origin.y.toString());
      line.setAttribute("x2", subtreeX.toString());
      line.setAttribute("y2", (height + rootBox.height).toString());
      line.style.stroke = "black";
      subtreeX += (ASTTreeElement.#BRANCH_MARGIN_PIXELS + subtreeWidth) / 2;
    }

    return frame;
  }

  connectedCallback() {
    // stupid hack
    window.setTimeout(() => this.render(), 0);
  }
}

export class ASTNodeElement extends ASTTreeElement {
  constructor () { super(); }
  override connectedCallback() { }
}

customElements.define("ast-tree", ASTTreeElement);
customElements.define("ast-node", ASTNodeElement);
