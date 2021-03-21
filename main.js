let masyu_width = 10;
let masyu_height = 5;

let cc = new MasyuCanvas();

cc.set_size(masyu_width, masyu_height);
cc.draw_grid();

cc.draw_white(1,1);
cc.draw_black(2,2);

cc.draw_edge_line_right(0,3);
cc.draw_edge_line_below(1,0);
cc.draw_edge_line_below(1,1);
cc.draw_edge_line_below(0,2);

cc.draw_edge_cross_right(0,1);
cc.draw_edge_cross_right(1,1);
cc.draw_edge_cross_below(1,2);

let ms = new Masyu(masyu_width, masyu_height);
ms.set_face(2, 2, FaceType.black);
ms.set_edge_below(1,1, EdgeValue.line);
ms.set_edge_right(1,1, EdgeValue.cross);

ms.draw_on(cc);
