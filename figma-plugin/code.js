figma.showUI(__html__, { width: 260, height: 90 });

figma.ui.onmessage = (msg) => {
  if (msg.type === 'error') {
    figma.notify('Lỗi tải SVG: ' + msg.message);
    return;
  }
  if (msg.type === 'fill') {
    const data = msg.data;
    const frame = figma.currentPage.findOne(n => n.name === 'Icons pallete');
    if (!frame) { figma.notify('Không tìm thấy frame "Icons pallete"'); figma.closePlugin(); return; }
    let done = 0, missing = 0;
    for (const rid in data) {
      const rect = figma.currentPage.findOne(n => n.id === rid);
      if (!rect) { missing++; continue; }
      const node = figma.createNodeFromSvg(data[rid].svg);
      node.name = data[rid].file.replace('.svg', '');
      const pad = 16, size = rect.width - pad * 2;
      node.resize(size, size);
      node.x = rect.x + pad;
      node.y = rect.y + pad;
      frame.appendChild(node);
      done++;
    }
    figma.notify('Đã fill ' + done + ' icon (thiếu ' + missing + ')');
    figma.closePlugin();
  }
};
