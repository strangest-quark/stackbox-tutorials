figma.showUI(__html__, { width: 800, height: 650 });

async function fillImage(node, imageBytes) {
  if (imageBytes != null) {
    const newFills = [];
    for (const paint of node.fills) {
      if (paint.type === 'IMAGE') {
        const newPaint = JSON.parse(JSON.stringify(paint));
        newPaint.imageHash = figma.createImage(imageBytes).hash;
        newFills.push(newPaint);
      }
    }
    node.fills = newFills;
  }
}

figma.ui.onmessage = msg => {
  if (msg.type === 'fill-image') {
    const nodes: SceneNode[] = [];
    var imageBytes = msg.imageBytes;
    const imageNode = figma.currentPage.selection[0] as GeometryMixin;
    fillImage(imageNode, imageBytes);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
  figma.closePlugin();
};
