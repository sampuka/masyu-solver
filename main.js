"use strict";

let ms = new Masyu(8, 7, ".w....w..b.bb.b....................ww....b....b.........");
ms.initialize_borders();

while(ms.solve_step())
    ;

let cc = new MasyuCanvas("solver_masyu_canvas");
ms.draw_on(cc);

fill_pattern("propagate_blocks", 1, 1, "./..../cc.c", "./..../cccc");

fill_pattern("resolve_line_end_a", 1, 1, "./..../ccl.", "./..../ccll");
fill_pattern("resolve_line_end_b", 1, 1, "./..../c.lc", "./..../cllc");

fill_pattern("block_branches_a", 1, 1, "./..../..ll", "./..../ccll");
fill_pattern("block_branches_b", 1, 1, "./..../.ll.", "./..../cllc");

fill_pattern("white_block", 1, 1, "w/..../c...", "w/..../ccll");

fill_pattern("white_line", 1, 1, "w/..../..l.", "w/..../ccll");

function fill_pattern(pattern_name, w, h, fillinfo1, fillinfo2)
{
    let div_id = "pattern_" + pattern_name;
    let div_ele = document.getElementById(div_id);

    let c1 = document.createElement("canvas");
    let c2 = document.createElement("canvas");
    c1.id = div_id + "_1";
    c2.id = div_id + "_2";

    let arrow = document.createElement("p");
    arrow.text = "->";

    div_ele.appendChild(c1);
    //div_ele.appendChild(arrow);
    div_ele.appendChild(c2);

    let cc1 = new MasyuCanvas(c1.id);
    let ms1 = new Masyu(w, h, fillinfo1);
    ms1.draw_on(cc1)

    let cc2 = new MasyuCanvas(c2.id);
    let ms2 = new Masyu(w, h, fillinfo2);
    ms2.draw_on(cc2)
}
