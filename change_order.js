// For all the code bellow we are assuming that the parentheses are balanced

class Node {
    constructor(data) {
        this.data = data;
        this.children = [];
        this.parent = null;
    }

    isLeaf() {
        return this.children.length === 0;
    }

    hasChildren() {
        return !(this.isLeaf());
    }

    leftist() {
        if(this.isLeaf()) return this;
        return this.children[0].leftist();
    }

    popLeftist() {
        const leftist = this.leftist();
        leftist.parent.removeChild(leftist);
        return leftist;
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        this.children.splice(index, 1);
    }

    addChild(node) {
        node.parent = this;
        this.children.push(node);
    }

    addChildren(nodesArr) {
        nodesArr.forEach((node) => this.addChild(node))
    }

    // Just to help me debug
    print() {
        if(this.isLeaf()) {
            console.log('Leaf: ', this.data);
            return;
        }
        const childrenText = this.children.map((n) => n.data);
        console.log('Node: ', this.data, ' | Children:', childrenText);
        this.children.forEach((c) => c.print())
    }
}

// helper function
// text[startIndex] must be (
const findClosingParentheses = (startIndex, text) => {
    let counter = 0;
    for(let i = startIndex; i < text.length; i++) {
        if(text[i] === '(') {
            counter++;
        } else if(text[i] === ')') {
            counter--;
            if (counter === 0) {
                return i;
            }
        }
    }
};

const splitHelper = (str) => {
    let nextOpen = str.indexOf('(');
    if (nextOpen === -1) return [];
    let nextClose = 0;
    let startIndex = 0;
    const children = [];
    while (nextOpen !== -1) {
        nextClose = findClosingParentheses(nextOpen, str);
        let childText = str.slice(nextOpen+1, nextClose);
        children.push(childText);
        startIndex = nextClose + 1;
        nextOpen = str.indexOf('(', startIndex);
    }
    return children;
};

const extractHelper = (str) => {
    let nextOpen = str.indexOf('(');
    if (nextOpen === -1) return str;
    let nextClose = 0;
    let startIndex = 0;
    let realText = '';
    while (nextOpen !== -1) {
        realText += str.slice(startIndex,nextOpen);
        nextClose = findClosingParentheses(nextOpen, str);
        startIndex = nextClose + 1;
        nextOpen = str.indexOf('(', startIndex);
        if (nextOpen === -1) realText += str.slice(startIndex);
    }
    return realText;
};

const buildHelperTree = (data) => {
    const splitData = splitHelper(data);
    const node = new Node(data);
    if (splitData.length === 0) return node;
    const children = splitData.map((d) => buildHelperTree(d));
    node.addChildren(children);
    return node;
};

const buildRealTree = (helperNode) => {
    const realText = extractHelper(helperNode.data);
    const node = new Node(realText);
    if(helperNode.isLeaf()) return new Node(realText);
    const children = helperNode.children.map((n) => buildRealTree(n));
    node.addChildren(children);
    return node;
};

const changeOrder = (str) => {
    const helperRootNode = buildHelperTree(str);
    const realTreeRoot = buildRealTree(helperRootNode);
    let words = [];
    while(realTreeRoot.hasChildren()) {
        words.push(realTreeRoot.popLeftist().data);
    }
    words.push(realTreeRoot.data);
    return words.join(' ');
};

let text = 'n(my)at(i(name)s(NAME))an';
const newOrder = changeOrder(text);
console.log('newOrder:', newOrder);

// The out put should be: my name NAME is natan
