class TreeNode {
   constructor(value) {
       this.value = value;
       this.children = [];
   }

   addChild(childValue) {
       const childNode = new TreeNode(childValue);
       this.children.push(childNode);
       return childNode;
   }
}

const root = new TreeNode('Root');
const child1 = root.addChild('Child 1');
const child2 = root.addChild('Child 2');
child1.addChild('Grandchild 1.1');
child1.addChild('Grandchild 1.2');
child2.addChild('Grandchild 2.1');

console.log(root);